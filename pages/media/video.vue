<template>
  <div>
    <h4 v-if="object && object.name">
      {{ videoTitle }}
    </h4>

    <div v-if="isReady">
      <VideoPlayer :options="videoOptions"></VideoPlayer>
    </div>

    <div v-if="mediaInfo()">
      <button @click="toggleMediaInfo()">
        <span v-if="showMediaInfo">{{ messages.button_hide_metadata }}</span>
        <span v-else>{{ messages.button_show_metadata }}</span>
      </button>
      <MediaInfo v-if="showMediaInfo" :options="{ object }" />
    </div>

    <div v-if="thumbnail()">
      <ThumbnailSelector :options="{ object }" />
    </div>

    <div v-if="error">
      <h3>{{ error }}</h3>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MediaInfo from '../../components/MediaInfo'
import ThumbnailSelector from '../../components/ThumbnailSelector'
import VideoPlayer from '@/components/media/VideoPlayer.vue'
import 'video.js/dist/video-js.min.css'

import { proxyMediaUrl, getExtension, okl } from '@/shared'
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
    ...mapState('user', ['user', 'userStatus']),
    ...mapState('s3', ['objectList', 'metadata', 'assetData', 'userMediaInfo']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    hasSources () { return hasSourceVideos(this) },
    isReady () {
      return this.object && this.object.meta && this.object.meta.status && this.object.meta.status.ready && hasSourceVideos(this)
    },
    hasMediaInfoJsonPath () { return this.object && this.mediaInfoJsonPath },
    getUserMediaInfo () {
      return this.name && this.userMediaInfo && this.userMediaInfo[this.name]
        ? this.userMediaInfo[this.name]
        : {}
    },
    videoTitle () {
      const mediaTitle = mediaInfoField('title')
      return mediaTitle || this.name
    }
  },
  watch: {
    metadata (newMeta, oldMeta) {
      if (newMeta && newMeta.path && newMeta.path.ctime && newMeta.path.assets) {
        // fixme Don't know why, but there it is, metadata stored under a 'path' property
        // My frontend development skills could be better. Sorry; this is hacky
        this.object.meta = newMeta.path
      } else {
        this.object.meta = newMeta
      }
      if (this.object.meta.selectedThumbnail) {
        this.videoOptions.poster = proxyMediaUrl(this.object.meta.selectedThumbnail, this.user, this.status)
        console.log(`watch.metadata: set poster: ${this.videoOptions.poster}`)
      }
      this.object = Object.assign({}, this.object) // force vue refresh
      this.refreshMeta()
    },
    assetData (newAssetData, oldAssetData) {
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
        console.log(`watch:assets: ${this.mediaInfoJsonPath} was not found in ${JSON.stringify(Object.keys(newAssetData))}`)
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

    // there are a couple of cached places we can check for the metadata, or we fetch it
    const cachedObject = this.objectList.find(o => o.name === name)
    if (cachedObject && cachedObject.meta && okl(cachedObject.meta) > 1) {
      console.log('video.created: found cached object with good meta, using it')
      this.object = cachedObject
      this.refreshMeta()
    } else if (name in Object.keys(this.metadata)) {
      console.log('video.created: found cached meta, using it')
      this.object = {
        name,
        type: FILE_TYPE,
        mediaType: VIDEO_MEDIA_TYPE,
        meta: this.metadata[name]
      }
      this.refreshMeta()
    } else {
      console.log('nothing cached, fetching meta...')
      const path = name
      this.fetchMetadata({ path })
      this.object = this.objectList.find(o => o.name === name)
      if (!this.object) {
        console.log('>>>> AFTER fetching meta, object not found in objectList, creating default/detached object')
        this.object = {
          name,
          type: FILE_TYPE,
          mediaType: VIDEO_MEDIA_TYPE
        }
      }
    }
  },
  methods: {
    ...mapActions('s3', ['fetchMetadata', 'fetchAsset', 'fetchUserMediaInfo', 'updateUserMediaInfo']),

    refreshMeta () {
      if (this.name) {
        // get user media info
        this.fetchUserMediaInfo(this.name)
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
              console.log(`video.vue: pushing src = ${src}`)
              sources.push({
                src,
                type: mediaProfile.contentType
              })
            }
          })
        })
        console.log(`refreshMeta: added sources=${JSON.stringify(sources, null, 2)}`)
      } else {
        console.log(`refreshMeta: sources already loaded for video, not replacing=\n${JSON.stringify(sources, null, 2)}`)
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
