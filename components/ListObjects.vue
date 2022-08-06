<template>
  <div>
    <div>Dir is {{ displayPrefix }}</div>
    <div v-if="isNotRoot">
      Go back (prefix = {{ prefix }})
      <button @click="refresh(parentPrefix)">{{ parentPrefixDisplay }}</button>
    </div>
    <div v-for="(obj, index) in filteredObjectList" v-bind:key="index">
      <div v-if="isDir(obj)">
        Directory:
        <button @click="refresh(obj.name)">
          {{ filterName(obj.name) }}
        </button>
      </div>
      <div v-else-if="hasMedia(obj)">
        <div v-if="canView(obj)">
          <NuxtLink :to="{path: '/'+obj.mediaType, query: {n: obj.name}}">
            viewable media: {{ filterName(obj.name) }}
            <img v-if="thumbnail(obj)" :src="`/s3/proxy/${thumbnail(obj)}`" width="200" height="200"></img>
          </NuxtLink>
        </div>
        <div v-else>
          not-ready media: {{ filterName(obj.name) }} = {{ JSON.stringify(obj.meta) }}
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
import { hasMediaType, isDirectory, isViewable, mediaProfileByName, mediaType } from '@/shared/media'

function isThumbnailProfile (profile) {
  return profile.operation === 'thumbnails' || profile.operation === 'firstThumbnail'
}

export default {
  name: 'ListVideos',
  data () {
    return {
      prefix: ''
    }
  },
  computed: {
    ...mapState('s3', ['objectList', 'metadata']),
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
      return pos === -1 ? '' : base.substring(0, pos - 1)
    },
    parentPrefixDisplay () {
      const base = this.prefix.endsWith('/') ? this.prefix.substring(0, this.prefix.length - 1) : this.prefix
      const pos = base.lastIndexOf('/')
      return pos === -1 ? '(back to top level)' : '(back to ' + base.substring(0, pos - 1) + ')'
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
      this.prefix = prefix
      this.fetchObjects({ prefix })
    },
    filterName (name) {
      return name.startsWith(this.prefix) ? name.substring(this.prefix.length) : name
    },
    isDir (obj) { return isDirectory(obj) },
    hasMedia (obj) { return hasMediaType(obj) },
    canView (obj) { return isViewable(obj) },
    thumbnail (obj) {
      let thumb = null
      if (obj && obj.meta && typeof obj.meta.assets === 'object' &&
        Object.keys(obj.meta.assets).length > 0) {
        console.log(`thumbnail: examining obj.meta.assets=${JSON.stringify(obj.meta.assets)}`)
        // todo: in the future we will allow the user to specify which thumbnail
        // we would look that up here, and if not found, then pick the first one
        Object.keys(obj.meta.assets).every((assetProfileName) => {
          console.log(`thumbnail: examining assetProfileName=${assetProfileName}`)
          const assets = obj.meta.assets[assetProfileName]
          if (assets.length > 0) {
            const mt = mediaType(obj.name)
            const mediaProfile = mediaProfileByName(mt, assetProfileName)
            if (!mediaProfile) {
              console.warn(`thumbnail: profile ${assetProfileName} not found for mediaType ${mt}`)
            } else if (isThumbnailProfile(mediaProfile)) {
              thumb = assets[0]
              return false
            }
          }
          return true
        })
      }
      return thumb
    }
  }
}
</script>
