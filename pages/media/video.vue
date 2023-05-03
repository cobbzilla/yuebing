<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <h4 v-if="videoTitle">
          {{ videoTitle }}
        </h4>
      </v-col>
    </v-row>
    <v-row v-if="isReady">
      <v-col>
        <v-container>
          <v-row>
            <div v-for="(qualitySetting, index) in qualitySettings" :key="index">
              <v-col cols="2">
                <VideoPlayer
                  :video-id="videoId(qualitySetting.key)"
                  :visible="qualitySetting.key === quality"
                  :options="allVideoOptions[qualitySetting.key]"
                />
              </v-col>
            </div>
          </v-row>
          <v-row v-if="hasQualitySettings">
            <v-col>
              <v-select
                v-model="quality"
                :label="messages.label_playback_quality"
                :items="qualitySettings"
                item-text="label"
                item-value="key"
                class="form-control"
                @change="selectQuality"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <MediaInfo :object="object" @update="onMediaInfoUpdate" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ContentComments :object="object" />
      </v-col>
    </v-row>
    <v-row v-if="loggedIn && (user.editor || user.admin) && thumbnail()">
      <v-col cols="2">
        <ThumbnailSelector :object="object" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="error" cols="2">
        <h3>{{ error }}</h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { basename } from 'path'
import videojs from 'video.js'

// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import MediaInfo from '../../components/MediaInfo'
import ThumbnailSelector from '../../components/ThumbnailSelector'
import ContentComments from '../../components/ContentComments'
import VideoPlayer from '../../components/media/VideoPlayer.vue'
import 'video.js/dist/video-js.min.css'
import { proxyMediaUrl, addQualityParam, getExtension, okl, chopFileExt } from '@/shared'
import { FILE_TYPE, VIDEO_MEDIA_TYPE, mediaProfileByName, objectDecodePath } from '@/shared/media'
import { hasAssets, findThumbnail } from '@/shared/mediainfo'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'VideoObject',
  components: {
    VideoPlayer, MediaInfo, ThumbnailSelector, ContentComments
  },
  data () {
    return {
      name: null,
      object: {},
      mediaInfo: null,
      error: null,
      allVideoOptions: {},
      defaultVideoOptions: {
        autoplay: false,
        controls: true,
        width: Math.min(this.mediaInfo?.width || 640, window.screen.width - 50),
        height: null, // always auto-set height based on width, maintains aspect ratio
        poster: null,
        sources: []
      },
      qualitySettings: [],
      prevQuality: null,
      quality: null
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState('source', ['objectList', 'metadata', 'assetData', 'userMediaInfo']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    loggedIn () { return this.user && this.userStatus && this.user.email },
    videoOptions () { return this.quality && this.allVideoOptions[this.quality] ? this.allVideoOptions[this.quality] : null },
    videoTitle () {
      return this.mediaInfo && this.mediaInfo.title
        ? this.mediaInfo.title
        : this.object && this.object.name
          ? chopFileExt(basename(this.object.name))
          : this.object.path
            ? chopFileExt(basename(this.object.path))
            : null
    },
    hasQualitySettings () { return this.qualitySettings && this.qualitySettings.length > 1 },
    isReady () {
      return this.object && this.object.meta && this.object.meta.status && this.object.meta.status.ready &&
        this.defaultVideoOptions.sources.length > 0 && okl(this.allVideoOptions) > 0
    }
  },
  watch: {
    metadata (newMeta) {
      if (newMeta && newMeta[this.name] && newMeta[this.name].ctime && newMeta[this.name].assets) {
        this.object.meta = newMeta[this.name]
      } else {
        this.object.meta = newMeta[this.name]
      }
      if (this.object.meta.selectedThumbnail) {
        this.defaultVideoOptions.poster = proxyMediaUrl(this.object.meta.selectedThumbnail, this.user, this.status)
        for (const quality of Object.keys(this.allVideoOptions)) {
          this.allVideoOptions[quality].poster = this.defaultVideoOptions.poster
        }
      }
      this.object = Object.assign({}, this.object) // force vue refresh
      this.refreshMeta()
    }
  },
  created () {
    const name = objectDecodePath(this.$route.query.n)
    if (!name) {
      this.error = 'Video not found'
      return
    }
    this.name = name
    this.object.path = name

    // there are a couple of cached places we can check for the metadata, or we fetch it
    const cachedObject = this.objectList.find(o => o.name === name)
    if (cachedObject && cachedObject.meta && okl(cachedObject.meta) > 1) {
      this.object = cachedObject
      this.refreshMeta()
    } else if (name in Object.keys(this.metadata)) {
      this.object = {
        name,
        type: FILE_TYPE,
        mediaType: VIDEO_MEDIA_TYPE,
        meta: this.metadata[name]
      }
      this.refreshMeta()
    } else {
      this.fetchMetadata({ path: this.object.path })
    }
  },
  methods: {
    ...mapActions('source', ['fetchMetadata', 'fetchAsset', 'fetchUserMediaInfo', 'updateUserMediaInfo']),
    refreshMeta () {
      if (hasAssets(this.object) && this.defaultVideoOptions.sources.length === 0) {
        this.qualitySettings = []
        for (const assetProfileName in this.object.meta.assets) {
          const mediaProfile = mediaProfileByName(VIDEO_MEDIA_TYPE, assetProfileName)
          if (mediaProfile.primary && mediaProfile.noop !== true) {
            if (mediaProfile.subProfiles) {
              this.qualitySettings.push({ key: '', label: this.messages.label_playback_quality_auto })
              this.qualitySettings.push(...mediaProfile.subProfiles
                .map(sub => sub && sub.name && sub.videoSize && sub.videoBitrate
                  ? this.qualityForProfile(sub)
                  : null).filter(e => e))
            } else {
              this.qualitySettings.push(this.qualityForProfile(mediaProfile))
            }
          }
          const assets = this.object.meta.assets[assetProfileName]
          assets.forEach((asset) => {
            if (mediaProfile.enabled && mediaProfile.primary && getExtension(asset) === mediaProfile.ext) {
              this.defaultVideoOptions.sources.push({
                src: proxyMediaUrl(asset, this.user, this.userStatus),
                type: mediaProfile.contentType
              })
            }
          })
        }
        if (this.defaultVideoOptions.sources.length === 0) {
          // console.log('refreshMeta: no default sources, video not prepared')
          return
        }
        for (const qSetting of this.qualitySettings) {
          const q = qSetting.key
          if (this.quality === null) {
            this.quality = q
            this.prevQuality = this.quality.key
          }
          this.allVideoOptions[q] = Object.assign({}, this.defaultVideoOptions)
          this.allVideoOptions[q].sources = this.defaultVideoOptions.sources.map((source) => {
            return {
              src: addQualityParam(source.src, q),
              type: source.type,
              label: q
            }
          })
        }
      }
    },
    mediaInfoField (field) {
      return this.mediaInfo && this.mediaInfo[field] ? this.mediaInfo[field] : null
    },
    thumbnail () { return findThumbnail(this.object) },
    onMediaInfoUpdate (newMediaInfo) {
      if (newMediaInfo) {
        this.mediaInfo = newMediaInfo
      }
    },
    qualityForProfile (p) { return { key: p.name, label: `${p.videoSize} @ ${p.videoBitrate}bps` } },
    videoId (quality) { return `videoPlayer_${quality && quality.length > 0 ? quality : 'auto'}` },
    selectQuality () {
      if (this.prevQuality !== this.quality) {
        const prevPlayer = videojs(this.videoId(this.prevQuality))
        const currentPlayer = videojs(this.videoId(this.quality))
        const playing = prevPlayer && prevPlayer.paused && !prevPlayer.paused()
        if (playing) {
          prevPlayer.pause()
          currentPlayer.currentTime(prevPlayer.currentTime())
          if (currentPlayer && currentPlayer.play && playing) {
            currentPlayer.play()
          }
        }
        this.prevQuality = this.quality
      }
    }
  }
}
</script>
