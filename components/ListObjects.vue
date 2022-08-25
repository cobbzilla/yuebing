<template>
  <v-container>
    <h3>{{ messages.title_browsing_folder.parseMessage({ folder: displayPrefix }) }}</h3>
    <div v-if="isNotRoot">
      <button @click="refresh(parentPrefix)">
        <span v-if="isParentRootFolder">{{ messages.button_back_to_root_folder }}</span>
        <span v-else>{{ messages.button_back_to.parseMessage({ parentPrefix }) }}</span>
      </button>
    </div>
    <div v-for="(obj, index) in filteredObjectList" :key="index">
      <div v-if="isDir(obj)">
        <button @click="refresh(obj.name)">
          {{ filterDirName(obj.name) }}
        </button>
      </div>
      <div v-else-if="hasMedia(obj)">
        <div v-if="canView(obj)">
          <NuxtLink :to="{path: '/media/'+obj.mediaType, query: {n: obj.name}}">
            {{ filterName(obj.name) }}
            <!--suppress HtmlExtraClosingTag -->
            <img
              v-if="thumbnail(obj)"
              :src="proxyUrl(thumbnail(obj))"
              width="200"
              height="200"
              :alt="messages.thumbnail_alt_text.parseMessage({name: obj.name})"
            ></img>
          </NuxtLink>
          <div v-if="thumbnail(obj)">
            <ThumbnailSelector :options="{ object: obj }" />
          </div>
        </div>
        <div v-else>
          {{ messages.label_media_unprocessed }}
          {{ filterName(obj.name) }} = {{ JSON.stringify(obj.meta) }}
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
      </div>
    </div>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import MediaInfo from '../components/MediaInfo'
import ThumbnailSelector from '../components/ThumbnailSelector'

import { hasMediaType, isDirectory, isViewable, hasMediaInfo } from '@/shared/media'
import { findThumbnail } from '@/shared/mediainfo'
import { proxyMediaUrl } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'

// noinspection JSUnusedGlobalSymbols
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
    ...mapState('user', ['user', 'userStatus']),
    ...mapState('source', ['prefix', 'objectList', 'metadata']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    displayPrefix () {
      return this.prefix === ''
        ? '/'
        : this.prefix.endsWith('/')
          ? this.prefix.substring(0, this.prefix.length - 1)
          : this.prefix
    },
    isRootFolder () { return this.prefix === '' || this.prefix === '/' },
    isNotRoot () { return !this.isRootFolder },
    isParentRootFolder () { return this.parentPrefix === '' || this.parentPrefix === '/' },
    parentPrefix () {
      const base = this.prefix.endsWith('/') ? this.prefix.substring(0, this.prefix.length - 1) : this.prefix
      const pos = base.lastIndexOf('/')
      return pos === -1 ? '' : base.substring(0, pos + 1)
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
    objectList (newObjectList) {
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
    ...mapActions('source', ['fetchObjects', 'fetchMetadata']),
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
    proxyUrl (obj) { return proxyMediaUrl(obj, this.user, this.userStatus) }
  }
}
</script>
