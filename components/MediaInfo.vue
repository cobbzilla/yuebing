<template>
  <div>
    <div v-if="!showEditor">
      {{ options.object.name }}:
      <div v-for="(field, index) in infoFields" :key="index">
        <div v-if="infoField(field)">
          {{ field }}: {{ infoField(field) }}
        </div>
      </div>
    </div>

    <button v-if="canEditMediainfo" class="btn btn-primary" @click="toggleEditButton()">
      {{ editButtonLabel }}
    </button>

    <div v-if="showEditor">
      <form @submit.prevent="updateMediaInfoValues">
        <div v-for="(field, index) in editableInfoFields" :key="index">

          <div class="form-group">
            <label :for="field">{{ messages[`label_mediainfo_${field}`] }}</label>
            <input v-model="infoFieldValues[field]" type="text" :name="field" class="form-control" />
          </div>

        </div>
        <button class="btn btn-primary">
          {{ messages.button_update }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
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
    options: {
      type: Object,
      default () {
        return {}
      }
    }
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
    hasMediaInfoJsonPath () { return this.options.object && this.mediaInfoJsonPath },
    editButtonLabel () { return this.showEditor ? 'Close Metadata Editor' : 'Edit Metadata' },
    getUserMediaInfo () {
      return this.options.object && this.options.object.name &&
      this.userMediaInfo && this.userMediaInfo[this.options.object.name]
        ? this.userMediaInfo[this.options.object.name]
        : {}
    }
  },
  watch: {
    assetData (newAssetData, oldAssetData) {
      // console.log(`MediaInfo.watch.assetData starting with newAssetData=${JSON.stringify(newAssetData)}`)
      if (this.hasMediaInfoJsonPath && newAssetData[this.mediaInfoJsonPath]) {
        this.mediaInfo = newAssetData[this.mediaInfoJsonPath]
      } else {
        console.log(`watch:assets: ${this.mediaInfoJsonPath} was not found in ${JSON.stringify(Object.keys(newAssetData))}`)
      }
    },
    userMediaInfo (newInfo, oldInfo) {
      console.log(`--------------- MediaInfo.watch.userMediaInfo: got new info: ${JSON.stringify(newInfo)}`)
      if (this.options.object && this.options.object.name && newInfo[this.options.object.name]) {
        const newMediaInfo = newInfo[this.options.object.name]
        Object.keys(newMediaInfo).forEach((prop) => {
          this.infoFieldValues[prop] = newMediaInfo[prop]
        })
      }
    }
  },
  created () {
    console.log('MediaInfo component created')
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
      const obj = this.options.object
      if (obj && obj.name) {
        // get user media info
        console.log(`refreshMediaInfo: fetching user media info for path: ${obj.name}`)
        const path = obj.name
        this.fetchUserMediaInfo({ path })
      }
      if (hasAssets(obj) && !this.mediaInfoJsonPath) {
        console.log(`MediaInfo.refreshMediaInfo started, this.mediaInfoJsonPath=${this.mediaInfoJsonPath}, obj=${JSON.stringify(obj)}`)
        this.mediaInfoJsonPath = findAsset(obj, (assets, profile) => {
          const mediaProfile = mediaProfileByName(obj.mediaType, profile)
          return isMediaInfoJsonProfile(mediaProfile)
        })
        if (this.mediaInfoJsonPath) {
          const path = this.mediaInfoJsonPath
          console.log(`MediaInfo.refreshMediaInfo fetching asset from: ${path}`)
          this.fetchAsset({ path })
        }
      } else {
        console.log('refreshMediaInfo: mediaInfo already loaded for media, not replacing')
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
    updateMediaInfoValues (e) {
      const path = this.options.object.name
      const values = this.infoFieldValues
      this.updateUserMediaInfo({ path, values })
      this.showEditor = false
    }
  }
}
</script>
