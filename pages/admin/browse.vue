<template>
  <v-container>
    <v-row>
      <v-col>
        <v-select
          v-model="source"
          :label="messages.admin_label_source_name"
          :items="sourceList"
          item-text="name"
          item-value="name"
          class="form-control"
          @change="setSource"
        />
        <v-text-field
          v-model="path"
          :label="messages.title_browsing_folder.parseMessage({ folder: path || '/' })"
          type="text"
          name="path"
          class="form-control"
          @keyup.enter="reloadObjects"
        />
        <v-btn v-if="path !== ''" icon @click.stop="goBackPath()">
          <v-icon>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn icon @click.stop="hardReloadObjects">
          <v-icon>
            mdi-cached
          </v-icon>
        </v-btn>
        <v-btn icon @click.stop="toggleMediaView">
          <v-icon v-if="viewingAllObjects">
            mdi-folder-multiple-image
          </v-icon>
          <v-icon v-else>
            mdi-folder-outline
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="loadingObjects">
      <v-col>
        <h2>
          {{ messages.info_search_searching }}
        </h2>
      </v-col>
    </v-row>
    <div v-for="(obj ,index) in objectList" :key="index">
      <v-row v-if="isMedia(obj) || isFolder(obj) || viewingAllObjects">
      <v-col>
        <v-simple-checkbox v-model="selectedObjects[obj.name]" />
      </v-col>
      <v-col cols="4">
        <div v-if="metaReady(obj.meta)">
          <!-- object name -->
          <NuxtLink  :to="{path: '/media/'+obj.mediaType, query: {n: encPath(obj.path)}}">
            <span v-if="obj.title">{{ obj.title }} ( {{ objName(obj) }} )</span>
            <span v-else>{{ objName(obj) }}</span>
            <!-- object status -->
            <v-icon v-if="metaFinished(obj.meta)" dense>
              mdi-check
            </v-icon>
          </NuxtLink>
        </div>
        <div v-else-if="isFolder(obj)" @click.stop="updatePath(obj.name)">
          <v-icon>
            mdi-folder
          </v-icon>
          {{ objName(obj) }}
        </div>
        <div v-else>
          {{ objName(obj) }}
        </div>
      </v-col>
      <v-col>
        {{ obj.tags ? obj.tags.join(' ') : '' }}
      </v-col>
      <v-col>
        <v-btn v-if="isMedia(obj) && !isPathBusy(obj)" @click.stop="doReindex(obj)">
          {{ messages.admin_button_reindex_source }}
        </v-btn>
        <span v-if="indexPathError && indexPathError[obj.name]" class="error">
          {{ indexPathError[obj.name] }}
        </span>
        <span v-if="indexingPaths && indexingPaths[obj.name]">
          {{ messages.admin_info_reindex_indexing }}
        </span>
      </v-col>
      <v-col>
        <v-btn v-if="isMedia(obj) && !isPathBusy(obj)" @click.stop="doRescan(obj)">
          {{ messages.admin_button_scan_source }}
        </v-btn>
        <span v-if="scanPathError && scanPathError[obj.name]" class="error">
          {{ scanPathError[obj.name] }}
        </span>
        <span v-if="scanningPaths && scanningPaths[obj.name]">
          {{ messages.admin_info_scan_scanning }}
        </span>
      </v-col>
      <v-col>
        <v-btn v-if="isMedia(obj) && !isPathBusy(obj)" @click.stop="doDelete(obj)">
          {{ messages.admin_button_delete_path }}
        </v-btn>
        <span v-if="deletePathError && deletePathError[obj]" class="error">
          {{ deletePathError[obj.name] }}
        </span>
        <span v-if="deletingPaths && deletingPaths[obj.name]">
          {{ messages.admin_info_path_delete }}
        </span>
      </v-col>
    </v-row>
    </div>
  </v-container>
</template>

<script>
import { basename, dirname } from 'path'

// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'
import { DIRECTORY_TYPE, hasProfiles, objectEncodePath } from '@/shared/media'

export default {
  name: 'BrowseSources',
  data () {
    return {
      source: null,
      path: '',
      selectedObjects: {},
      viewMediaOnly: true
    }
  },
  computed: {
    ...mapState('admin', ['sourceList',
      'scanningPaths', 'scanPathSuccess', 'scanPathError',
      'indexingPaths', 'indexPathSuccess', 'indexPathError',
      'deletingPaths', 'deletePathSuccess', 'deletePathError'
    ]),
    ...mapState('source', ['objectList', 'loadingObjects']),
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    viewingAllObjects () { return this.viewMediaOnly === false }
  },
  watch: {
    sourceList (newList) {
      if (this.source === null && newList && newList.length > 0) {
        this.source = newList[0].name
      }
      this.reloadObjects()
    },
    objectList (newObjects) {
      if (newObjects) {
        for (const obj of newObjects) {
          if (!obj.title && obj.mediainfo && obj.mediainfo.title) {
            obj.title = obj.mediainfo.title
          }
        }
      }
    }
  },
  created () {
    this.source = this.$route.query.source || null
    const query = { includeSelf: false }
    this.findSources({ query })
  },
  methods: {
    ...mapActions('admin', ['findSources', 'indexPath', 'scanPath', 'deletePath']),
    ...mapActions('source', ['fetchObjects', 'fetchMetadata', 'fetchUserMediaInfo']),
    setSource (src) {
      this.source = src
    },
    toggleMediaView () {
      this.viewMediaOnly = !this.viewMediaOnly
    },
    reloadObjects () {
      this._reload(false)
    },
    hardReloadObjects () {
      this._reload(true)
    },
    _reload (noCache) {
      if (this.source) {
        const prefix = `${this.source}/${this.path || ''}`
        console.log(`reloadObjects: reloading with prefix=${prefix} with noCache=${noCache}`)
        this.fetchObjects({ prefix, noCache })
      } else {
        console.log(`reloadObjects: not reloading, source=${this.source}, path=${this.path}`)
      }
    },
    updatePath (path) {
      this.path = path
      this.reloadObjects()
    },
    goBackPath () {
      const newPath = dirname(this.path)
      this.path = newPath === '/' || newPath === '.' ? '' : newPath
      this.reloadObjects()
    },
    encPath (path) { return objectEncodePath(path) },
    metaReady (meta) {
      return meta && meta.status && meta.status.ready
    },
    metaFinished (meta) {
      return meta && (meta.finished || (meta.status && meta.status.completed))
    },
    objName (obj) { return basename(obj.name) },
    isMedia (obj) { return obj && hasProfiles(obj.name) },
    isFolder (obj) { return obj.type === DIRECTORY_TYPE },
    doReindex (obj) { this.indexPath({ sourceAndPath: this.source + '/' + obj.name }) },
    doRescan (obj) { this.scanPath({ sourceAndPath: this.source + '/' + obj.name }) },
    doDelete (obj) { this.deletePath({ sourceAndPath: this.source + '/' + obj.name }) },
    isPathBusy (obj) {
      return this.indexingPaths[obj.name] || this.scanningPaths[obj.name] || this.deletingPaths[obj.name]
    }
  }
}
</script>
<!--<style lang="scss" scoped>-->
<!--.objectName {-->
<!--  width: 400px;-->
<!--}-->
<!--</style>-->
