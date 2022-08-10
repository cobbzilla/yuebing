<template>
  <div>
    <div v-if="!showEditor">
      media info for {{ options.object.name }}:
      <div v-for="(field, index) in infoFields" :key="index">
        <div v-if="infoField(field)">
          {{ field }}: {{ infoField(field) }}
        </div>
      </div>
    </div>

    <button class="btn btn-primary" @click="toggleEditButton()">
      {{ editButtonLabel }}
    </button>

    <div v-if="showEditor && canEdit(options.object)">
      <form @submit.prevent="updateMediaInfo">
        <div v-for="(field, index) in editableInfoFields" :key="index">

          <div class="form-group">
            <label :for="field">{{ field }}</label>
            <input v-model="infoFieldValues[field]" type="text" :name="field" class="form-control" />
          </div>

        </div>
        <button class="btn btn-primary">
          Save
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
      infoFieldValues: {},
      showEditor: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'status']),
    ...mapState('s3', ['assetData']),
    infoFields () {
      return mediaInfoFields()
    },
    editableInfoFields () {
      return editableMediaInfoFields()
    },
    hasMediaInfoJsonPath () {
      return this.options.object && this.mediaInfoJsonPath
    },
    editButtonLabel () {
      return this.showEditor ? 'Close Metadata Editor' : 'Edit Metadata'
    }
  },
  watch: {
    assetData (newAssetData, oldAssetData) {
      console.log(`MediaInfo.watch.assetData starting with newAssetData=${JSON.stringify(newAssetData)}`)
      if (this.hasMediaInfoJsonPath && newAssetData[this.mediaInfoJsonPath]) {
        this.mediaInfo = newAssetData[this.mediaInfoJsonPath]
      } else {
        console.log(`watch:assets: ${this.mediaInfoJsonPath} was not found in ${JSON.stringify(Object.keys(newAssetData))}`)
      }
    }
  },
  created () {
    console.log('MediaInfo component created')
    this.refreshMediaInfo()
  },
  methods: {
    ...mapActions('s3', ['fetchAsset']),
    infoField (field) {
      return this.mediaInfo ? mediaInfoField(field, this.mediaInfo) : null
    },
    infoFieldValue (field) {
      return this.mediaInfo ? mediaInfoField(field, this.mediaInfo) : ''
    },
    refreshMediaInfo () {
      const obj = this.options.object
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
    canEdit (obj) {
      // for now any logged-in user can edit metadata
      return this.user && this.status && this.status.loggedIn
    },
    toggleEditButton () {
      this.showEditor = !this.showEditor
      if (this.showEditor) {
        console.log(`MediaInfo.toggleEditButton: filtering this.editableInfoFields ${JSON.stringify(this.editableInfoFields)}`)
        this.editableInfoFields.forEach((field) => {
          console.log(`MediaInfo.toggleEditButton: setting field ${field} = ${this.infoFieldValue(field)}`)
          this.infoFieldValues[field] = this.infoFieldValue(field)
        })
      } else {
        console.log('MediaInfo.toggleEditButton: showEditor was false, clearing editedFields')
        this.infoFieldValues = {}
      }
    },
    updateMediaInfo (e) {
      console.log(`updateMediaInfo: submitting edits to metadata yo: ${JSON.stringify(this.infoFieldValues)}`)
    }
  }
}
</script>
