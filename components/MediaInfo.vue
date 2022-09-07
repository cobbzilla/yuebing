<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="!showEditor">
          <v-container>
            <div v-for="(field, index) in infoFields" :key="index">
              <v-row v-if="mediaInfo && mediaInfo[field]" class="mediaInfoDisplay">
                <v-col>
                  {{ messages[`label_mediainfo_${field}`] }}
                </v-col>
                <v-col>
                  {{ mediaInfo[field] }}
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
          <v-icon v-if="showEditor">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-pencil
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-if="showEditor">
          <v-form @submit.prevent="updateMediaInfoValues">
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
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'

import {
  mediaInfoFields, editableMediaInfoFields
} from '@/shared/mediainfo'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'MediaInfo',
  props: {
    object: { type: Object, default: null }
  },
  data () {
    return {
      mediaInfo: null,
      origInfoFieldValues: {},
      infoFieldValues: {},
      showEditor: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState('source', ['assetData', 'userMediaInfo']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    infoFields () { return mediaInfoFields() },
    canEditMediainfo () { return this.user && this.userStatus && this.userStatus.loggedIn && this.user.admin },
    editableInfoFields () { return editableMediaInfoFields() }
  },
  watch: {
    object (newObject) {
      if (newObject) {
        this.refreshMediaInfo()
      }
    },
    userMediaInfo (newInfo) {
      if (this.object && this.object.path && newInfo[this.object.path]) {
        this.mediaInfo = newInfo[this.object.path]
        Object.keys(this.mediaInfo).forEach((prop) => {
          this.infoFieldValues[prop] = this.mediaInfo[prop]
        })
      }
    }
  },
  created () {
    this.refreshMediaInfo()
  },
  methods: {
    ...mapActions('source', ['fetchAsset', 'fetchUserMediaInfo', 'updateUserMediaInfo']),
    refreshMediaInfo () {
      const obj = this.object
      if (obj && obj.path) {
        this.fetchUserMediaInfo({ path: obj.path })
      } else {
        // console.log('refreshMediaInfo: object has no path, cannot load')
      }
    },
    toggleEditButton () {
      this.showEditor = !this.showEditor
      if (this.showEditor) {
        this.editableInfoFields.forEach((field) => {
          this.origInfoFieldValues[field] = this.mediaInfo[field]
        })
      } else {
        this.editableInfoFields.forEach((field) => {
          this.mediaInfo[field] = this.origInfoFieldValues[field]
        })
      }
    },
    updateMediaInfoValues () {
      const path = this.object.path
      const values = this.infoFieldValues
      this.updateUserMediaInfo({ path, values })
      this.showEditor = false
    }
  }
}
</script>

<style lang="scss" scoped>
.mediaInfoDisplay {
  white-space: nowrap;
}
</style>
