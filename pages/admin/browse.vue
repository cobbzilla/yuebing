<template>
  <v-container>
    <v-overlay
      v-if="scanConfigOverlayObject"
      :opacity="0.9"
      :absolute="true"
      :value="scanConfigOverlayObject"
    >
      <v-container id="scanConfigOverlayContainer">
        <v-row>
          <v-col>
            <v-btn icon @click="setScanConfigOverlay(null)">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>
              {{ messages.admin_label_scan_config.parseMessage({ volume: scanConfigOverlayObject.name }) }}
            </h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox v-model="scanConfig.ignoreErrors" :label="messages.label_scan_ignoreErrors" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox v-model="scanConfig.overwrite" :label="messages.label_scan_overwrite" />
          </v-col>
        </v-row>
        <v-row v-if="mediaProfilesFor(scanConfigOverlayObject)">
          <v-col>
            <v-select
              v-model="scanConfig.reprocess"
              :label="messages.label_scan_reprocess"
              :items="mediaProfilesFor(scanConfigOverlayObject)"
              :hint="messages.label_scan_reprocess_profiles"
              persistent-hint
              multiple
            >
              <template v-if="mediaProfilesFor(scanConfigOverlayObject).length > 1" v-slot:prepend-item>
                <v-list-item
                  ripple
                  @mousedown.prevent
                  @click="toggleAllProfiles"
                >
                  <v-list-item-action>
                    <v-icon :color="scanConfig.reprocess.length > 0 ? 'indigo darken-4' : ''">
                      {{ scanConfigSelectionIcon }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ messages.label_select_all }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click.stop="doRescan(scanConfigOverlayObject)">
              {{ messages.admin_button_scan_volume }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-overlay>

    <v-overlay
      v-if="metaOverlayObject"
      :opacity="0.9"
      :absolute="true"
      :value="metaOverlayObject"
    >
      <v-container id="metaOverlayContainer">
        <v-row>
          <v-col>
            <v-btn icon @click="setMetaOverlay(null)">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <h4>
              {{ messages.label_metadata }}
            </h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <small>
              <vue-json-pretty
                :data="metaOverlayObject"
                :virtual="true"
                :height="400"
                :item-height="10"
                :show-line="false"
                :show-double-quotes="false"
                :select-on-click-node="false"
                :highlight-selected-node="false"
                :collapsed-on-click-brackets="true"
              />
            </small>
          </v-col>
        </v-row>
      </v-container>
    </v-overlay>

    <v-overlay
      v-if="tagOverlayObject"
      :opacity="0.9"
      :absolute="true"
      :value="tagOverlayObject">
      <v-container id="tagOverlayContainer" fluid>
        <v-row>
          <v-col>
            <v-btn icon @click="setTagOverlay(null)">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <h4>
              {{ messages.label_mediainfo_tags }}
            </h4>
          </v-col>
        </v-row>
        <v-row>
          <div v-for="(tag, index) in tags[tagOverlayObject.sourcePath]" :key="index">
            <v-col>
              <span style="text-wrap: none">
                {{ tag }}
                <v-btn icon :disabled="removingTags[tagOverlayObject.sourcePath]" @click.stop="doRemoveTags(tag)">
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </span>
            </v-col>
          </div>
        </v-row>
        <v-row v-if="removingTags[tagOverlayObject.sourcePath]">
          <v-col>{{ messages.label_removing_tag }}</v-col>
        </v-row>
        <v-row v-if="addingTags[tagOverlayObject.sourcePath]">
          <v-col>{{ messages.label_adding_tag }}</v-col>
        </v-row>
        <v-row v-if="removeTagsError[tagOverlayObject.sourcePath]">
          <v-col class="error">{{ removeTagsError[tagOverlayObject.sourcePath] }}</v-col>
        </v-row>
        <v-row v-if="addTagsError[tagOverlayObject.sourcePath]">
          <v-col class="error">{{ addTagsError[tagOverlayObject.sourcePath] }}</v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="tagToAdd"
              :label="messages.label_add_tag"
              type="text"
              name="tagToAdd"
              class="form-control"
              @keyup.enter="doAddTags"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-overlay>

    <v-row>
      <v-col>
        <v-select
          v-model="volume"
          :label="messages.admin_label_volume_name"
          :items="sourceList"
          item-text="name"
          item-value="name"
          class="form-control"
          @change="setVolume"
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
        <v-simple-checkbox v-model="selectedObjects[obj.sourcePath]" />
      </v-col>
      <v-col cols="4">
        <div v-if="metaReady(obj.meta)">
          <!-- object name -->
          <NuxtLink :to="{ path: '/media/' + mType(obj.sourcePath), query: { n: encPath(obj.sourcePath) } }">
            <span v-if="obj.title">{{ obj.title }} ( {{ objName(obj) }} )</span>
            <span v-else>{{ objName(obj) }}</span>
            <!-- object status -->
            <v-icon v-if="metaFinished(obj.meta)" dense>
              mdi-check
            </v-icon>
          </NuxtLink>
          <v-btn @click.stop="setMetaOverlay(obj)">
            <v-icon>
              mdi-information
            </v-icon>
          </v-btn>
        </div>
        <div v-else-if="isMedia(obj)">
          <span v-if="obj.title">{{ obj.title }} ( {{ objName(obj) }} )</span>
          <span v-else>{{ objName(obj) }}</span>
          <v-btn v-if="!obj.meta" icon :disabled="loadingMetadata[obj.sourcePath] || fetchingUserMediaInfo[obj.sourcePath]" @click.stop="doMeta(obj)">
            <v-icon>
              mdi-information-outline
            </v-icon>
          </v-btn>
          <v-btn v-else-if="obj.meta" @click.stop="setMetaOverlay(obj)">
            <v-icon>
              mdi-information
            </v-icon>
          </v-btn>
          <span class="error" v-if="loadingMetadataError[obj.sourcePath]">{{ loadingMetadataError[obj.sourcePath] }}</span>
          <span class="error" v-if="fetchingUserMediaInfoError[obj.sourcePath]">{{ fetchingUserMediaInfoError[obj.sourcePath] }}</span>
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
      <v-col v-if="isMedia(obj)">
        <v-btn v-if="tags && tags[obj.sourcePath]" icon @click.stop="setTagOverlay(obj)">
          <v-icon>
            mdi-tag
          </v-icon>
        </v-btn>
        <v-btn v-if="!tags || typeof tags[obj.sourcePath] === 'undefined'" icon :disabled="fetchingTags[obj.sourcePath] || fetchTagsError[obj.sourcePath]" @click.stop="doTags(obj)">
          <v-icon>
            mdi-tag-outline
          </v-icon>
        </v-btn>
        <span class="error" v-if="fetchTagsError[obj.sourcePath]">{{ fetchTagsError[obj.sourcePath] }}</span>
      </v-col>
      <v-col>
        <v-btn v-if="isMedia(obj) && !isPathBusy(obj)" @click.stop="doReindex(obj)">
          {{ messages.admin_button_reindex_volume }}
        </v-btn>
        <span v-if="indexPathError && indexPathError[obj.sourcePath]" class="error">
          {{ indexPathError[obj.sourcePath] }}
        </span>
        <span v-if="indexingPaths && indexingPaths[obj.sourcePath]">
          {{ messages.admin_info_reindex_indexing }}
        </span>
      </v-col>
      <v-col>
        <v-btn v-if="isMedia(obj) && !isPathBusy(obj)" @click.stop="setScanConfigOverlay(obj)">
          {{ messages.admin_button_scan_volume }}
        </v-btn>
        <span v-if="scanPathError && scanPathError[obj.sourcePath]" class="error">
          {{ scanPathError[obj.sourcePath] }}
        </span>
        <span v-if="scanningPaths && scanningPaths[obj.sourcePath]">
          {{ messages.admin_info_scan_scanning }}
        </span>
      </v-col>
      <v-col>
        <v-btn v-if="isMedia(obj) && !isPathBusy(obj)" @click.stop="doDelete(obj)">
          {{ messages.admin_button_delete_path }}
        </v-btn>
        <span v-if="deletePathError && deletePathError[obj]" class="error">
          {{ deletePathError[obj.sourcePath] }}
        </span>
        <span v-if="deletingPaths && deletingPaths[obj.sourcePath]">
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
import { mapActions, mapState } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'
import { filterSources } from '@/shared/model/volume'
import { DIRECTORY_TYPE, mediaType, hasProfiles, objectEncodePath, mediaProfilesForSource } from '@/shared/media'

export default {
  name: 'BrowseSources',
  data () {
    return {
      volume: null,
      path: '',
      selectedObjects: {},
      viewMediaOnly: true,
      metaOverlayObject: null,
      tagOverlayObject: null,
      tagToAdd: null,
      scanConfigOverlayObject: null,
      scanConfig: {
        reprocess: [],
        ignoreErrors: false,
        overwrite: false
      }
    }
  },
  computed: {
    ...mapState('admin', ['volumeList',
      'scanningPaths', 'scanPathSuccess', 'scanPathError',
      'indexingPaths', 'indexPathSuccess', 'indexPathError',
      'deletingPaths', 'deletePathSuccess', 'deletePathError'
    ]),
    ...mapState('source', [
      'objectList', 'loadingObjects',
      'metadata', 'loadingMetadata', 'loadingMetadataError',
      'userMediaInfo', 'fetchingUserMediaInfo', 'fetchingUserMediaInfoError']),
    ...mapState('tags', [
      'tags', 'fetchingTags', 'fetchTagsError',
      'addingTags', 'addTagsSuccess', 'addTagsError',
      'removingTags', 'removeTagsSuccess', 'removeTagsError']),
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    sourceList () { return filterSources(this.volumeList) },
    viewingAllObjects () { return this.viewMediaOnly === false },
    allProfilesSelected () {
      return this.scanConfig.reprocess.length === this.mediaProfilesFor(this.scanConfigOverlayObject).length
    },
    someProfilesSelected () {
      return this.scanConfig.reprocess.length > 0 && !this.allProfilesSelected
    },
    scanConfigSelectionIcon () {
      return this.allProfilesSelected
        ? 'mdi-close-box'
        : this.someProfilesSelected
          ? 'mdi-minus-box'
          : 'mdi-checkbox-blank-outline'
    }
  },
  watch: {
    sourceList (newList) {
      if (this.volume === null && newList && newList.length > 0) {
        this.volume = newList[0].name
      }
      this.reloadObjects()
    },
    objectList (newObjects) {
      if (newObjects) {
        for (const obj of newObjects) {
          if (!obj.title && obj.userMediaInfo && obj.userMediaInfo.title) {
            obj.title = obj.userMediaInfo.title
          }
        }
      }
    },
    addTagsSuccess (newSuccess) {
      if (this.tagOverlayObject && newSuccess && newSuccess[this.tagOverlayObject.sourcePath]) {
        this.fetchTags({ sourceAndPath: this.tagOverlayObject.sourcePath })
      }
    },
    removeTagsSuccess (newSuccess) {
      if (this.tagOverlayObject && newSuccess && newSuccess[this.tagOverlayObject.sourcePath]) {
        this.fetchTags({ sourceAndPath: this.tagOverlayObject.sourcePath })
      }
    }
  },
  created () {
    this.volume = this.$route.query.volume || null
    const query = { includeSelf: false }
    this.findVolumes({ query })
  },
  methods: {
    ...mapActions('admin', ['findVolumes', 'indexPath', 'scanPath', 'deletePath']),
    ...mapActions('source', ['fetchObjects', 'fetchMetadata', 'fetchUserMediaInfo']),
    ...mapActions('tags', ['fetchTags', 'addTags', 'removeTags']),
    setVolume (vol) { this.volume = vol },
    mType (path) { return mediaType(path) },
    toggleMediaView () { this.viewMediaOnly = !this.viewMediaOnly },
    setMetaOverlay (obj) { this.metaOverlayObject = obj || null },
    setTagOverlay (obj) { this.tagOverlayObject = obj || null },
    setScanConfigOverlay (obj) { this.scanConfigOverlayObject = obj || null },
    reloadObjects () {
      this._reload(false)
    },
    hardReloadObjects () {
      this._reload(true)
    },
    _reload (noCache) {
      if (this.volume) {
        const prefix = `${this.volume}/${this.path || ''}`
        console.log(`reloadObjects: reloading with prefix=${prefix} with noCache=${noCache}`)
        this.fetchObjects({ prefix, noCache })
      } else {
        console.log(`reloadObjects: not reloading, volume=${this.volume}, path=${this.path}`)
      }
    },
    updatePath (name) {
      this.path += basename(name) + '/'
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
    objName (obj) { return basename(obj.name).replaceAll('_', ' ') },
    isMedia (obj) { return obj && hasProfiles(obj.name) },
    isFolder (obj) { return obj.type === DIRECTORY_TYPE },
    doMeta (obj) {
      if (typeof obj.meta === 'undefined') {
        this.fetchMetadata({ path: obj.sourcePath })
      }
      if (typeof obj.userMediaInfo === 'undefined') {
        this.fetchUserMediaInfo({ path: obj.sourcePath })
      }
    },
    doTags (obj) {
      if (typeof obj.tags === 'undefined') {
        this.fetchTags({ sourceAndPath: obj.sourcePath })
      }
    },
    doAddTags () {
      this.addTags({ sourceAndPath: this.tagOverlayObject.sourcePath, tags: this.tagToAdd })
      this.tagToAdd = ''
    },
    doRemoveTags (tags) {
      this.removeTags({ sourceAndPath: this.tagOverlayObject.sourcePath, tags })
    },
    doReindex (obj) { this.indexPath({ sourceAndPath: obj.sourcePath }) },
    doRescan (obj) {
      const scanConfig = Object.assign({}, this.scanConfig, { sourceAndPath: obj.sourcePath })
      this.scanPath({ scanConfig })
      this.setScanConfigOverlay(null)
    },
    doDelete (obj) { this.deletePath({ sourceAndPath: obj.sourcePath }) },
    isPathBusy (obj) {
      return this.indexingPaths[obj.name] || this.scanningPaths[obj.name] || this.deletingPaths[obj.name]
    },
    mediaProfilesFor (obj) {
      const profiles = mediaProfilesForSource(obj.name)
      return profiles ? Object.keys(profiles) : null
    },
    toggleAllProfiles () {
      this.$nextTick(() => {
        if (this.allProfilesSelected) {
          this.scanConfig.reprocess = []
        } else {
          this.scanConfig.reprocess = this.mediaProfilesFor(this.scanConfigOverlayObject).slice()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.vjs-key {
  font-size: 8px;
  line-height: 10px;
}
.vjs-value {
  font-size: 8px;
  line-height: 10px;
}
.vjs-indent {
  font-size: 8px;
  line-height: 10px;
}
.vjs-tree-node {
  font-size: 8px;
  line-height: 10px;
}
.vjs-tree-brackets {
  font-size: 8px;
  line-height: 10px;
}
#metaOverlayContainer {
  max-width: 90%;
  width: 90%;
  max-height: 70%;
  height: 70%;
  overflow: scroll;
  padding: 10px;
}
#scanConfigOverlayContainer {
  width: 550px;
  max-height: 70%;
  height: 70%;
  overflow: scroll;
  padding: 10px;
  position: relative;
  left: 20px;
  top: 20px;
}
#tagOverlayContainer {
  max-width: 70%;
  width: 70%;
  max-height: 70%;
  height: 70%;
  overflow: scroll;
  padding: 10px;
}
</style>
