<template>
  <v-container>
    <v-row>
      <v-col>
        <h4 v-if="videoTitle">
          {{ videoTitle }}
        </h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-if="isReady">
          <VideoPlayer :options="videoOptions" />
        </div>
        <div v-if="mediaInfo()">
          <v-btn @click.stop="toggleMediaInfo()">
            <span v-if="showMediaInfo">{{ messages.button_hide_metadata }}</span>
            <span v-else>{{ messages.button_show_metadata }}</span>
          </v-btn>
          <MediaInfo v-if="showMediaInfo" :object="object" />
        </div>
        <div v-if="thumbnail()">
          <ThumbnailSelector :object="object" />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-if="error">
          <h3>{{ error }}</h3>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { basename } from 'path'

// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import MediaInfo from '../../components/MediaInfo'
import ThumbnailSelector from '../../components/ThumbnailSelector'
import VideoPlayer from '@/components/media/VideoPlayer.vue'
import 'video.js/dist/video-js.min.css'
import { proxyMediaUrl, getExtension, okl, chopFileExt } from '@/shared'
import { FILE_TYPE, VIDEO_MEDIA_TYPE, mediaProfileByName, isMediaInfoJsonProfile, hasMediaInfo } from '@/shared/media'
import { mediaInfoField, hasAssets, findThumbnail } from '@/shared/mediainfo'
import { localeMessagesForUser } from '@/shared/locale'

function hasSourceVideos (vid) {
  return vid.videoOptions.sources && vid.videoOptions.sources.length && vid.videoOptions.sources.length > 0
}

export default {
  name: 'VideoObject',
  components: {
    VideoPlayer, MediaInfo, ThumbnailSelector
  },
  data () {
    return {
      name: null,
      object: {},
      mediaInfoJsonPath: null,
      mediaInfoJson: null,
      showMediaInfo: false,
      error: null,
      videoOptions: {
        autoplay: false,
        controls: true,
        width: Math.floor(document.documentElement.clientWidth * 0.6),
        height: Math.floor(document.documentElement.clientHeight * 0.7),
        poster: null,
        sources: []
      }
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState('source', ['objectList', 'metadata', 'assetData', 'userMediaInfo']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    videoTitle () {
      return this.object && this.object.name
        ? chopFileExt(basename(this.object.name))
        : this.object.path
          ? chopFileExt(basename(this.object.path))
          : null
    },
    hasSources () { return hasSourceVideos(this) },
    isReady () {
      return this.object && this.object.meta && this.object.meta.status && this.object.meta.status.ready && hasSourceVideos(this)
    },
    hasMediaInfoJsonPath () { return this.object && this.mediaInfoJsonPath },
    getUserMediaInfo () {
      return this.name && this.userMediaInfo && this.userMediaInfo[this.name]
        ? this.userMediaInfo[this.name]
        : {}
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
        this.videoOptions.poster = proxyMediaUrl(this.object.meta.selectedThumbnail, this.user, this.status)
      }
      this.object = Object.assign({}, this.object) // force vue refresh
      this.refreshMeta()
    },
    assetData (newAssetData) {
      if (this.hasMediaInfoJsonPath && newAssetData[this.mediaInfoJsonPath]) {
        this.mediaInfoJson = newAssetData[this.mediaInfoJsonPath]
        const width = this.mediaInfoField('width')
        const height = this.mediaInfoField('height')
        const aspectRatio = width / height
        if (height && width) {
          this.videoOptions.width = Math.min(width, Math.floor(document.documentElement.clientWidth * 0.7))
          this.videoOptions.height = Math.floor(this.videoOptions.width / aspectRatio)
          // console.log(`watch:assets -- set video width/height to ${this.videoOptions.width}/${this.videoOptions.height} from original ${width}/${height}`)
        }
      } else {
        // console.log(`watch:assets: ${this.mediaInfoJsonPath} was not found in ${JSON.stringify(Object.keys(newAssetData))}`)
      }
    }
  },
  created () {
    const name = this.$route.query.n
    if (typeof name !== 'string') {
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
      if (this.name) {
        // get user media info
        this.fetchUserMediaInfo({ path: this.name })
      }
      const sources = this.videoOptions.sources
      if (hasAssets(this.object) && !this.hasSources) {
        Object.keys(this.object.meta.assets).forEach((assetProfileName) => {
          const assets = this.object.meta.assets[assetProfileName]
          const mediaProfile = mediaProfileByName(VIDEO_MEDIA_TYPE, assetProfileName)
          if (isMediaInfoJsonProfile(mediaProfile)) {
            const path = this.mediaInfoJsonPath = assets[0]
            this.fetchAsset({ path })
          }
          assets.forEach((asset) => {
            if (mediaProfile.enabled && mediaProfile.primary && getExtension(asset) === mediaProfile.ext) {
              const src = proxyMediaUrl(asset, this.user, this.userStatus)
              sources.push({
                src,
                type: mediaProfile.contentType
              })
            }
          })
        })
      } else {
        // console.log(`refreshMeta: sources already loaded for video, not replacing=\n${JSON.stringify(sources, null, 2)}`)
      }
    },
    mediaInfo () { return hasMediaInfo(this.object) },
    mediaInfoField (field) {
      return this.mediaInfoJson ? mediaInfoField(field, this.mediaInfoJson, this.getUserMediaInfo) : null
    },
    toggleMediaInfo () { this.showMediaInfo = !this.showMediaInfo },
    thumbnail () { return findThumbnail(this.object) }
  }
}
</script>
