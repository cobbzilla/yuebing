<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="!showEditor">
          <h4 v-if="object && object.name">{{ object.name }}</h4>
          <v-container>
            <div v-for="(field, index) in infoFields" :key="index">
              <v-row v-if="infoField(field)">
                <v-col>
                  {{ messages[`label_mediainfo_${field}`] }}
                </v-col>
                <v-col>
                  {{ infoField(field) }}
                </v-col>
              </v-row>
            </div>
          </v-container>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn v-if="canEditMediainfo" class="btn btn-primary" @click.stop="toggleEditButton()">
          {{ editButtonLabel }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-if="showEditor">
          <form>
            <div v-for="(field, index) in editableInfoFields" :key="index">
              <div class="form-group">
                <v-text-field
                  v-model="infoFieldValues[field]"
                  :label="messages[`label_mediainfo_${field}`]"
                  type="text"
                  :name="infoFieldValues[field]"
                  class="form-control"
                />
              </div>
            </div>
            <v-btn class="btn btn-primary" @click.stop="updateMediaInfoValues">
              {{ messages.button_update }}
            </v-btn>
          </form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'

import { mediaProfileByName, isMediaInfoJsonProfile } from '@/shared/media'
import {
  mediaInfoFields, editableMediaInfoFields, mediaInfoField,
  hasAssets, findAsset
} from '@/shared/mediainfo'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'MediaInfo',
  props: {
    object: { type: Object, default: null }
  },
  data () {
    return {
      mediaInfoJsonPath: null,
      mediaInfo: null,
      origInfoFieldValues: {},
      infoFieldValues: {},
      showEditor: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    ...mapState('source', ['assetData', 'userMediaInfo']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    infoFields () { return mediaInfoFields() },
    canEditMediainfo () { return this.user && this.userStatus && this.userStatus.loggedIn },
    editableInfoFields () { return editableMediaInfoFields() },
    hasMediaInfoJsonPath () { return this.object && this.mediaInfoJsonPath },
    editButtonLabel () { return this.showEditor ? 'Close Metadata Editor' : 'Edit Metadata' },
    getUserMediaInfo () {
      return this.object && this.object.name &&
      this.userMediaInfo && this.userMediaInfo[this.object.name]
        ? this.userMediaInfo[this.object.name]
        : {}
    }
  },
  watch: {
    assetData (newAssetData) {
      if (this.hasMediaInfoJsonPath && newAssetData[this.mediaInfoJsonPath]) {
        this.mediaInfo = newAssetData[this.mediaInfoJsonPath]
      }
    },
    userMediaInfo (newInfo) {
      if (this.object && this.object.name && newInfo[this.object.name]) {
        const newMediaInfo = newInfo[this.object.name]
        Object.keys(newMediaInfo).forEach((prop) => {
          this.infoFieldValues[prop] = newMediaInfo[prop]
        })
      }
    }
  },
  created () {
    this.refreshMediaInfo()
  },
  methods: {
    ...mapActions('source', ['fetchAsset', 'fetchUserMediaInfo', 'updateUserMediaInfo']),
    infoField (field) {
      return this.mediaInfo ? mediaInfoField(field, this.mediaInfo, this.getUserMediaInfo) : null
    },
    infoFieldValue (field) {
      return this.mediaInfo ? mediaInfoField(field, this.mediaInfo, this.getUserMediaInfo) : ''
    },
    refreshMediaInfo () {
      const obj = this.object
      if (obj && obj.name) {
        // get user media info
        // console.log(`refreshMediaInfo: fetching user media info for path: ${obj.name}`)
        const path = obj.name
        this.fetchUserMediaInfo({ path })
      }
      if (hasAssets(obj) && !this.mediaInfoJsonPath) {
        // console.log(`MediaInfo.refreshMediaInfo started, this.mediaInfoJsonPath=${this.mediaInfoJsonPath}, obj=${JSON.stringify(obj)}`)
        this.mediaInfoJsonPath = findAsset(obj, (assets, profile) => {
          const mediaProfile = mediaProfileByName(obj.mediaType, profile)
          return isMediaInfoJsonProfile(mediaProfile)
        })
        if (this.mediaInfoJsonPath) {
          const path = this.mediaInfoJsonPath
          // console.log(`MediaInfo.refreshMediaInfo fetching asset from: ${path}`)
          this.fetchAsset({ path })
        }
      } else {
        // console.log('refreshMediaInfo: mediaInfo already loaded for media, not replacing')
      }
    },
    toggleEditButton () {
      this.showEditor = !this.showEditor
      if (this.showEditor) {
        this.editableInfoFields.forEach((field) => {
          this.origInfoFieldValues[field] = this.infoFieldValues[field] = this.infoFieldValue(field)
        })
      } else {
        this.editableInfoFields.forEach((field) => {
          this.infoFieldValues[field] = this.origInfoFieldValues[field]
        })
      }
    },
    updateMediaInfoValues () {
      const path = this.object.name
      const values = this.infoFieldValues
      this.updateUserMediaInfo({ path, values })
      this.showEditor = false
    }
  }
}
</script>
