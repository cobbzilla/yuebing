<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <h4 v-if="videoTitle">
          {{ videoTitle }}
        </h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="isReady" cols="2">
        <VideoPlayer :options="videoOptions" />
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
    <v-row v-if="loggedIn && user.admin && thumbnail()">
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

// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import MediaInfo from '../../components/MediaInfo'
import ThumbnailSelector from '../../components/ThumbnailSelector'
import ContentComments from '../../components/ContentComments'
import VideoPlayer from '@/components/media/VideoPlayer.vue'
import 'video.js/dist/video-js.min.css'
import { proxyMediaUrl, getExtension, okl, chopFileExt } from '@/shared'
import { FILE_TYPE, VIDEO_MEDIA_TYPE, mediaProfileByName, objectDecodePath } from '@/shared/media'
import { hasAssets, findThumbnail } from '@/shared/mediainfo'
import { localeMessagesForUser } from '@/shared/locale'

function hasSourceVideos (vid) {
  return vid.videoOptions.sources && vid.videoOptions.sources.length && vid.videoOptions.sources.length > 0
}

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
      videoOptions: {
        autoplay: false,
        controls: true,
        width: Math.min(this.mediaInfo?.width || 640, window.screen.width - 50),
        height: null, // always auto-set height based on width, maintains aspect ratio
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
    loggedIn () { return this.user && this.userStatus && this.user.email },
    videoTitle () {
      return this.mediaInfo && this.mediaInfo.title
        ? this.mediaInfo.title
        : this.object && this.object.name
          ? chopFileExt(basename(this.object.name))
          : this.object.path
            ? chopFileExt(basename(this.object.path))
            : null
    },
    hasSources () { return hasSourceVideos(this) },
    isReady () {
      return this.object && this.object.meta && this.object.meta.status && this.object.meta.status.ready && hasSourceVideos(this)
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
      const sources = this.videoOptions.sources
      if (hasAssets(this.object) && !this.hasSources) {
        Object.keys(this.object.meta.assets).forEach((assetProfileName) => {
          const assets = this.object.meta.assets[assetProfileName]
          const mediaProfile = mediaProfileByName(VIDEO_MEDIA_TYPE, assetProfileName)
          assets.forEach((asset) => {
            if (mediaProfile.enabled && mediaProfile.primary && getExtension(asset) === mediaProfile.ext) {
              const src = proxyMediaUrl(asset, this.user, this.userStatus)
              console.log(`refreshMeta: pushing source: ${src}`)
              sources.push({
                src,
                type: mediaProfile.contentType
              })
            }
          })
          if (sources.length > 0) {
            console.log(`refreshMeta: prepared video with ${sources.length} sources`)
          } else {
            console.log('refreshMeta: no sources, video not prepared')
          }
        })
      } else {
        console.log(`refreshMeta: sources already loaded for video, not replacing=${JSON.stringify(sources)}`)
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
    }
  }
}
</script>
