<template>
  <div>
    <h4 v-if="object && object.name">
      Video: {{ name }}
    </h4>
    <div v-if="isReady">
      <VideoPlayer :options="videoOptions"></VideoPlayer>
    </div>
<!--    <div v-if="mediaInfoJson">-->
      <h4>media info json</h4>
      <h5>Width: {{ mediaInfoField('width') }}</h5>
      <h5>Height: {{ mediaInfoField('height') }}</h5>
      <h5>Duration: {{ mediaInfoField('duration') }}</h5>
<!--    </div>-->
    <div v-if="error">
      <h3>{{ error }}</h3>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { FILE_TYPE, VIDEO_MEDIA_TYPE, mediaProfileByName } from '@/shared/media'
import VideoPlayer from '@/components/VideoPlayer.vue'
import 'video.js/dist/video-js.min.css'

const c = require('../shared')
const m = require('../shared/media')
const info = require('../shared/mediainfo')

function hasSourceVideos (vid) {
  return vid.videoOptions.sources && vid.videoOptions.sources.length && vid.videoOptions.sources.length > 0
}

export default {
  name: 'VideoObject',
  components: {
    VideoPlayer
  },
  data () {
    return {
      name: null,
      object: {},
      mediaInfoJsonPath: null,
      mediaInfoJson: null,
      error: null,
      videoOptions: {
        autoplay: true,
        controls: true,
        width: Math.floor(document.documentElement.clientWidth * 0.6),
        height: Math.floor(document.documentElement.clientHeight * 0.7),
        sources: []
      }
    }
  },
  computed: {
    ...mapState('s3', ['objectList', 'metadata', 'assetData']),
    hasSources () {
      return hasSourceVideos(this)
    },
    isReady () {
      return this.object && this.object.meta && this.object.meta.status && this.object.meta.status.ready && hasSourceVideos(this)
    },
    hasMediaInfoJsonPath () {
      return this.object && this.mediaInfoJsonPath
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
      this.object = Object.assign({}, this.object) // force vue refresh
      this.refreshMeta()
    },
    assetData (newAssetData, oldAssetData) {
      if (this.hasMediaInfoJsonPath && newAssetData[this.mediaInfoJsonPath]) {
        this.mediaInfoJson = newAssetData[this.mediaInfoJsonPath]
      } else {
        console.log(`watch:assets: ${this.mediaInfoJsonPath} was not found in ${JSON.stringify(Object.keys(newAssetData))}`)
      }
    }
  },
  created () {
    const name = this.$route.query.n
    if (typeof name !== 'string') {
      this.error = 'Thing not found'
      return
    }
    this.name = name

    // there are a couple of cached places we can check for the metadata, or we fetch it
    const cachedObject = this.objectList.find(o => o.name === name)
    if (cachedObject && cachedObject.meta && Object.keys(cachedObject.meta) > 1) {
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
      this.object = {
        name,
        type: FILE_TYPE,
        mediaType: VIDEO_MEDIA_TYPE
      }
    }
  },
  methods: {
    ...mapActions('s3', ['fetchMetadata', 'fetchAsset']),

    refreshMeta () {
      const sources = this.videoOptions.sources
      if (this.object.meta &&
        this.object.meta.status &&
        this.object.meta.status.ready &&
        typeof this.object.meta.assets === 'object' &&
        Object.keys(this.object.meta.assets).length > 0 &&
        !this.hasSources) {
        Object.keys(this.object.meta.assets).forEach((assetProfileName) => {
          const assets = this.object.meta.assets[assetProfileName]
          // console.log(`this.object.meta.assets = ${JSON.stringify(this.object.meta.assets)}`)
          const mediaProfile = mediaProfileByName(VIDEO_MEDIA_TYPE, assetProfileName)
          if (m.isMediaInfoJsonProfile(mediaProfile)) {
            const path = this.mediaInfoJsonPath = assets[0]
            this.fetchAsset({ path })
          }
          assets.forEach((asset) => {
            // console.log(`for asset ${asset}, checking enabled/primary on profile ${JSON.stringify(mediaProfile)}`)
            if (mediaProfile.enabled && mediaProfile.primary && c.getExtension(asset) === mediaProfile.ext) {
              console.log(`video.vue: pushing src = /s3/proxy/${asset}`)
              sources.push({
                src: `/s3/proxy/${asset}`,
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

    mediaInfoField (field) {
      return this.mediaInfoJson ? info.mediaInfoField(field, this.mediaInfoJson) : null
    }
  }
}
</script>
