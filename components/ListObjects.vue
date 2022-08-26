<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>{{ messages.title_browsing_folder.parseMessage({ folder: displayPrefix }) }}</h3>
        <div v-if="isNotRoot">
          <button @click="refresh(parentPrefix)">
            <span v-if="isParentRootFolder">{{ messages.button_back_to_root_folder }}</span>
            <span v-else>{{ messages.button_back_to.parseMessage({ prefix: parentPrefix }) }}</span>
          </button>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-card v-for="(obj, index) in filteredObjectList" :key="index">
          <div v-if="isDir(obj)">
            <v-btn icon @click.stop="refresh(obj.name)">
              <v-icon>mdi-folder</v-icon>
              <span>{{ filterDirName(obj.name) }}</span>
            </v-btn>
          </div>
          <div v-else-if="hasMedia(obj)">
            <div v-if="canView(obj)">
              <NuxtLink :to="{path: '/media/'+obj.mediaType, query: {n: obj.path}}">
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
              <v-btn @click.stop="toggleMediaInfo(obj)">
                {{ mediaInfoToggleButtonLabel(obj) }}
              </v-btn>
              <div v-if="isSelectedMedia(obj)">
                <MediaInfo :object="obj" />
              </div>
            </div>
          </div>
          <div v-else>
            {{ filterName(obj.name) }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import MediaInfo from '../components/MediaInfo'
import ThumbnailSelector from '../components/ThumbnailSelector'

import { proxyMediaUrl } from '@/shared'
import { hasMediaType, isDirectory, isViewable, hasMediaInfo } from '@/shared/media'
import { findThumbnail } from '@/shared/mediainfo'
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
          if (obj.path && obj.path !== this.prefix && (hasMediaType(obj) || isDirectory(obj))) {
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
          if (obj.path) {
            this.fetchMetadata({ path: obj.path })
          } else {
            console.log(`watch.objectList: item in list does not have path: ${JSON.stringify(obj)}`)
          }
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
