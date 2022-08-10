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
          <NuxtLink :to="{path: '/'+obj.mediaType, query: {n: obj.name}}">
            viewable media: {{ filterName(obj.name) }}
            <img v-if="thumbnail(obj)" :src="`/api/s3/proxy/${thumbnail(obj)}${thumbnailUrlParams}`" width="200" height="200"></img>
          </NuxtLink>
        </div>
        <div v-else>
          not-ready media: {{ filterName(obj.name) }} = {{ JSON.stringify(obj.meta) }}
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
        Regular file: {{ filterName(obj.name) }} JSON = {{ JSON.stringify(obj) }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MediaInfo from '../components/MediaInfo'
import { sessionParams } from '@/shared'

import {
  hasMediaType, isDirectory, isViewable, hasMediaInfo,
  mediaProfileByName, mediaType, isThumbnailProfile
} from '@/shared/media'
import { hasAssets, findAsset } from '@/shared/mediainfo'

export default {
  name: 'ListObjects',
  components: {
    MediaInfo
  },
  data () {
    return {
      mediaInfoObjectPath: null
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
    },
    thumbnailUrlParams () {
      return sessionParams()
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
    thumbnail (obj) {
      let thumb = null
      if (hasAssets(obj)) {
        // console.log(`thumbnail: examining obj.meta.assets=${JSON.stringify(obj.meta.assets)}`)
        // todo: in the future we will allow the user to specify which thumbnail
        // we would look that up here, and if not found, then pick the first one
        thumb = findAsset(obj, (assets, profile) => {
          const mediaProfile = mediaProfileByName(mediaType(obj.name), profile)
          return mediaProfile && isThumbnailProfile(mediaProfile)
        })
      }
      return thumb
    },
    toggleMediaInfo (obj) {
      this.mediaInfoObjectPath = this.isSelectedMedia(obj) ? this.mediaInfoObjectPath = null : obj.name
    },
    mediaInfoToggleButtonLabel (obj) {
      return `${this.isSelectedMedia(obj) ? 'hide' : 'show'} media info`
    },
    isSelectedMedia (obj) {
      return this.mediaInfo(obj) && this.mediaInfoObjectPath === obj.name
    },
    mediaInfoOptions (obj) {
      return {
        object: obj
      }
    }
  }
}
</script>
