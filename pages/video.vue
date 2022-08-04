<template>
  <div>
    <span v-if="object && object.name">
      The {{ object.name }} video goes here
      <VideoPlayer></VideoPlayer>
    </span>
    <hr/>
    <div v-if="object && object.meta">
      {{ JSON.stringify(object.meta) }}
    </div>
    <hr/>
    <div v-if="error">
      <h3>{{ error }}</h3>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { MEDIA, FILE_TYPE, VIDEO_MEDIA_TYPE, profileFromAsset } from '~/media'
import VideoPlayer from '@/components/VideoPlayer.vue'

export default {
  name: 'VideoObject',
  components: {
    VideoPlayer
  },
  data () {
    return {
      name: null,
      object: {},
      error: null,
      videoOptions: {
        autoplay: true,
        controls: true
      }
    }
  },
  computed: {
    ...mapState('s3', ['objectList', 'metadata']),
    hasSources () {
      return this.videoOptions.sources && this.videoOptions.sources.length && this.videoOptions.sources.length > 0
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
    ...mapActions('s3', ['fetchMetadata']),

    refreshMeta () {
      if (this.object.meta && this.object.meta.status && this.object.meta.status.ready &&
        this.object.meta.assets && this.object.meta.assets.length && this.object.meta.assets.length > 0 &&
        !this.hasSources) {
        const sources = []
        this.object.meta.assets.forEach((asset) => {
          const assetProfile = profileFromAsset(asset)
          if (assetProfile) {
            if (assetProfile in Object.keys(MEDIA.video.profiles)) {
              const mediaProfile = MEDIA.video.profiles[assetProfile]
              if (mediaProfile.primary) {
                sources.push({
                  src: `/s3/proxy/${asset}`,
                  type: 'video/mp4'
                })
              }
            }
          }
        })
      } else {
        console.log('refreshMeta: sources already loaded for video, not replacing')
      }
    }
  }
}
</script>
