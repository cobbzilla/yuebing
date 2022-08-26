<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h3>{{ messages.title_browsing_folder.parseMessage({ folder: displayPrefix }) }}</h3>
        <div v-if="isNotRoot">
          <v-btn @click.stop="refresh(parentPrefix)">
            <span v-if="isParentRootFolder">{{ messages.button_back_to_root_folder }}</span>
            <span v-else>{{ messages.button_back_to.parseMessage({ prefix: parentPrefix }) }}</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!filteredObjectList || filteredObjectList.length === 0">
      <v-col>
        <h2>
          {{ messages.info_search_no_results }}
        </h2>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="(obj, index) in filteredObjectList" :key="index">
        <!-- directory card -->
        <v-card
          v-if="isDir(obj)"
          :min-height="minCardHeight"
          :min-width="minCardWidth"
          :max-height="maxCardHeight"
          :max-width="maxCardWidth"
          @click.stop="refresh(obj.name)"
        >
          <v-card-title>{{ filterDirName(obj.name) }}</v-card-title>
          <v-card-text>
            <v-icon x-large>
              mdi-folder
            </v-icon>
          </v-card-text>
        </v-card>
        <!-- media card, show thumbnail -->
        <v-card
          v-else-if="hasMedia(obj) && canView(obj)"
          :min-height="minCardHeight"
          :min-width="minCardWidth"
          :max-height="maxCardHeight"
          :max-width="maxCardWidth"
        >
          <v-card-title>
            <NuxtLink :to="{path: '/media/'+obj.mediaType, query: {n: obj.path}}">
              {{ mediaTitle(obj) }}
            </NuxtLink>
          </v-card-title>
          <v-card-text>
            <NuxtLink :to="{path: '/media/'+obj.mediaType, query: {n: obj.path}}">
              <img
                v-if="thumbnail(obj)"
                :src="proxyUrl(thumbnail(obj))"
                width="200"
                height="200"
                :alt="messages.thumbnail_alt_text.parseMessage({name: obj.name})"
              >
            </NuxtLink>
          </v-card-text>

          <div v-if="mediaInfo(obj)">
            <v-btn @click.stop="toggleMediaInfo(obj)">
              {{ mediaInfoToggleButtonLabel(obj) }}
            </v-btn>
            <div v-if="isSelectedMedia(obj)">
              <MediaInfo :object="obj" />
            </div>
          </div>
        </v-card>
        <!-- media file, but of unknown type or not yet processed -->
        <v-card
          v-else-if="hasMedia(obj)"
          :min-height="minCardHeight"
          :min-width="minCardWidth"
          :max-height="maxCardHeight"
          :max-width="maxCardWidth"
        >
          <v-card-title>{{ filterName(obj.name) }}</v-card-title>
          <div>
            {{ messages.label_media_unprocessed }}
          </div>
          <div>
            {{ JSON.stringify(obj.meta) }}
          </div>
        </v-card>
        <!-- some other unknown file -->
        <v-card
          v-else
          :min-height="minCardHeight"
          :min-width="minCardWidth"
          :max-height="maxCardHeight"
          :max-width="maxCardWidth"
        >
          <v-card-title>{{ filterName(obj.name) }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import MediaInfo from '../components/MediaInfo'

import { proxyMediaUrl } from '@/shared'
import { hasMediaType, isDirectory, isViewable, hasMediaInfo } from '@/shared/media'
import { findThumbnail } from '@/shared/mediainfo'
import { localeMessagesForUser } from '@/shared/locale'

// noinspection JSUnusedGlobalSymbols
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
    ...mapState('user', ['user', 'userStatus']),
    ...mapState('source', ['prefix', 'objectList', 'metadata']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    minCardHeight () { return 200 },
    minCardWidth () { return 200 },
    maxCardHeight () { return 400 },
    maxCardWidth () { return 500 },
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
    mediaTitle (obj) {
      return obj.mediainfo && obj.mediainfo.title
        ? obj.mediainfo.title
        : this.filterName(obj.name)
    },
    mediaInfo (obj) { return hasMediaInfo(obj) },
    thumbnail (obj) { return findThumbnail(obj) },
    toggleMediaInfo (obj) {
      this.mediaInfoObjectPath = this.isSelectedMedia(obj) ? this.mediaInfoObjectPath = null : obj.name
    },
    mediaInfoToggleButtonLabel (obj) {
      return this.isSelectedMedia(obj) ? this.messages.button_hide_media_info : this.messages.button_show_media_info
    },
    isSelectedMedia (obj) {
      return this.mediaInfo(obj) && this.mediaInfoObjectPath === obj.name
    },
    proxyUrl (obj) { return proxyMediaUrl(obj, this.user, this.userStatus) }
  }
}
</script>
