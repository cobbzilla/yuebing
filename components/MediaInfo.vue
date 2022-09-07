<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="!showEditor">
          <v-container>
            <v-row v-for="(field, index) in majorFields" :key="index" class="mediaInfoDisplay">
              <v-col v-if="mediaInfo && mediaInfo[field]" >
                {{ messages[`label_mediainfo_${field}`] }}
              </v-col>
              <v-col v-if="mediaInfo && mediaInfo[field]" >
                {{ mediaInfo[field] }}
              </v-col>
            </v-row>
            <v-row v-for="(field, index) in minorFields" :key="index" class="mediaInfoMinorField">
              <v-col v-if="mediaInfo && mediaInfo[field]" >
                <small>{{ messages[`label_mediainfo_${field}`] }}</small>
              </v-col>
              <v-col v-if="mediaInfo && mediaInfo[field]" >
                <small>{{ mediaInfo[field] }}</small>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>
    </v-row>
    <v-row class="minorFieldToggle">
      <v-col>
        <v-btn @click.stop="toggleMinorFields">
          <v-icon v-if="showMinorFields" dense>
            mdi-chevron-up
          </v-icon>
          <v-icon v-else dense>
            mdi-chevron-down
          </v-icon>
        </v-btn>
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
  mediaInfoFields, majorMediaInfoFields, minorMediaInfoFields, editableMediaInfoFields
} from '@/shared/mediainfo'
import { localeMessagesForUser } from '@/shared/locale'

const opath = obj => obj.path || obj.name || null

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
      showEditor: false,
      showMinorFields: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState('source', ['userMediaInfo']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    infoFields () { return mediaInfoFields() },
    majorFields () { return majorMediaInfoFields() },
    hasAnyMinorFieldValues () {
      return minorMediaInfoFields()
        .map(f => this.mediaInfo && this.mediaInfo[f])
        .find(f => f !== null)
    },
    minorFields () {
      return this.showMinorFields && this.hasAnyMinorFieldValues ? minorMediaInfoFields() : []
    },
    canEditMediainfo () { return this.user && this.userStatus && this.userStatus.loggedIn && this.user.admin },
    editableInfoFields () { return editableMediaInfoFields() }
  },
  watch: {
    object (newObject) {
      if (newObject) { this.refreshMediaInfo() }
    },
    userMediaInfo (newInfo) {
      if (this.object && opath(this.object) && newInfo[opath(this.object)]) {
        this.mediaInfo = Object.assign({}, newInfo[opath(this.object)])
        this.$emit('update', this.mediaInfo)
        Object.keys(this.mediaInfo).forEach((prop) => {
          this.infoFieldValues[prop] = this.mediaInfo[prop]
        })
      }
    }
  },
  created () { this.refreshMediaInfo() },
  methods: {
    ...mapActions('source', ['fetchUserMediaInfo', 'updateUserMediaInfo']),
    refreshMediaInfo () {
      const obj = this.object
      if (obj && opath(this.object)) {
        this.fetchUserMediaInfo({ path: opath(this.object) })
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
    toggleMinorFields () { this.showMinorFields = !this.showMinorFields },
    updateMediaInfoValues () {
      const path = opath(this.object)
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
.mediaInfoMinorField {
  height: 20px;
}
.minorFieldToggle {
  text-align: right;
}
</style>
