<template>
  <div>
    <span v-if="object && object.name">
      The {{ object.name }} video goes here
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
import { FILE_TYPE, VIDEO_MEDIA_TYPE } from '~/util/shared'

export default {
  name: 'VideoPlayer',
  data () {
    return {
      name: null,
      object: {},
      error: null
    }
  },
  computed: {
    ...mapState('s3', ['objectList', 'metadata'])
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
    } else if (name in Object.keys(this.metadata)) {
      console.log('video.created: found cached meta, using it')
      this.object = {
        name,
        type: FILE_TYPE,
        mediaType: VIDEO_MEDIA_TYPE,
        meta: this.metadata[name]
      }
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
    ...mapActions('s3', ['fetchMetadata'])
  }
}
</script>
