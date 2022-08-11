<template>
  <div>
    <div>Dir is {{ displayPrefix }}</div>
    <div v-if="isNotRoot">
      Go back (prefix = {{ prefix }})
      <button @click="refresh(parentPrefix)">
        {{ parentPrefixDisplay }}
      </button>
    </div>
    <div v-for="(obj, index) in filteredObjectList" :key="index">
      <div v-if="isDir(obj)">
        Directory:
        <button @click="refresh(obj.name)">
          {{ filterDirName(obj.name) }}
        </button>
      </div>
      <div v-else-if="hasMedia(obj)">
        <div v-if="canView(obj)">
          <NuxtLink :to="{path: '/media/'+obj.mediaType, query: {n: obj.name}}">
            {{ filterName(obj.name) }}
            <img v-if="thumbnail(obj)" :src="proxyUrl(thumbnail(obj))" width="200" height="200"></img>
          </NuxtLink>
          <div v-if="thumbnail(obj)">
            <ThumbnailSelector :options="{ object: obj }" />
          </div>
        </div>
        <div v-else>
          (not-ready) {{ filterName(obj.name) }} = {{ JSON.stringify(obj.meta) }}
        </div>
        <div v-if="mediaInfo(obj)">
          <button @click="toggleMediaInfo(obj)">
            {{ mediaInfoToggleButtonLabel(obj) }}
          </button>
          <div v-if="isSelectedMedia(obj)">
            <MediaInfo :options="{ object: obj }" />
          </div>
        </div>
      </div>
      <div v-else>
        {{ filterName(obj.name) }}
<!--        JSON = {{ JSON.stringify(obj) }}-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MediaInfo from '../components/MediaInfo'
import ThumbnailSelector from '../components/ThumbnailSelector'

import { hasMediaType, isDirectory, isViewable, hasMediaInfo } from '@/shared/media'
import { findThumbnail } from '@/shared/mediainfo'
import { proxyMediaUrl } from '@/shared'

export default {
  name: 'ListObjects',
  components: {
    MediaInfo, ThumbnailSelector
  },
  data () {
    return {
      mediaInfoObjectPath: null,
      showThumbnailSelector: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'status']),
    ...mapState('s3', ['prefix', 'objectList', 'metadata']),
    displayPrefix () {
      return this.prefix === ''
        ? '/'
        : this.prefix.endsWith('/')
          ? this.prefix.substring(0, this.prefix.length - 1)
          : this.prefix
    },
    isNotRoot () {
      return this.prefix !== ''
    },
    parentPrefix () {
      const base = this.prefix.endsWith('/') ? this.prefix.substring(0, this.prefix.length - 1) : this.prefix
      const pos = base.lastIndexOf('/')
      return pos === -1 ? '' : base.substring(0, pos + 1)
    },
    parentPrefixDisplay () {
      const base = this.prefix.endsWith('/') ? this.prefix.substring(0, this.prefix.length - 1) : this.prefix
      const pos = base.lastIndexOf('/')
      return pos === -1 ? '(back to top level)' : '(back to ' + base.substring(0, pos + 1) + ')'
    },
    filteredObjectList () {
      const filtered = []
      if (this.objectList && this.objectList.length && this.objectList.length > 0) {
        this.objectList.forEach((obj) => {
          if (obj.name && obj.name !== this.prefix && (hasMediaType(obj) || isDirectory(obj))) {
            filtered.push(obj)
          }
        })
      }
      return filtered
    }
  },
  watch: {
    objectList (newObjectList, oldObjectList) {
      if (Array.isArray(newObjectList)) {
        newObjectList.forEach((obj) => {
          const path = obj.name
          this.fetchMetadata({ path })
        })
      }
    }
  },
  created () {
    const prefix = this.prefix
    this.fetchObjects({ prefix })
  },
  methods: {
    ...mapActions('s3', ['fetchObjects', 'fetchMetadata']),
    refresh (prefix) {
      this.fetchObjects({ prefix })
    },
    filterName (name) {
      return name.startsWith(this.prefix) ? name.substring(this.prefix.length) : name
    },
    filterDirName (name) {
      const n = this.filterName(name)
      return n.endsWith('/') ? n.substring(0, n.length - 1) : n
    },
    isDir (obj) { return isDirectory(obj) },
    hasMedia (obj) { return hasMediaType(obj) },
    canView (obj) { return isViewable(obj) },
    mediaInfo (obj) { return hasMediaInfo(obj) },
    thumbnail (obj) { return findThumbnail(obj) },
    toggleMediaInfo (obj) {
      this.mediaInfoObjectPath = this.isSelectedMedia(obj) ? this.mediaInfoObjectPath = null : obj.name
    },
    mediaInfoToggleButtonLabel (obj) {
      return `${this.isSelectedMedia(obj) ? 'hide' : 'show'} media info`
    },
    isSelectedMedia (obj) {
      return this.mediaInfo(obj) && this.mediaInfoObjectPath === obj.name
    },
    proxyUrl (obj) { return proxyMediaUrl(obj) }
  }
}
</script>
