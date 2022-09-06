<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click.stop="toggleThumbnailSelection()">
          <span v-if="showThumbnailSelector">{{ messages.button_hide_thumbnails }}</span>
          <span v-else>{{ messages.button_show_thumbnails }}</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="thumbnails && showThumbnailSelector">
      <v-col>
        <div>
          <div v-if="thumbnailIndex !== null">
            <table>
              <thead>
                <tr>
                  <td colspan="3">
                    <h4>
                      {{ thumbName(thumbnails[thumbnailIndex]) }}
                    </h4>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <v-btn v-if="thumbnailIndex > 0" @click.stop="prevThumbnail()">
                      {{ messages.button_previous_thumbnail }}
                    </v-btn>
                  </td>
                  <td>
                    <div>
                      <div>
                        <img :src="proxyUrl(thumbnails[thumbnailIndex])" :width="width" :alt="messages.thumbnail_alt_text.parseMessage({name: object.name})">
                      </div>
                      <div>{{ thumbnailIndex + 1 }} of {{ thumbnails.length }}</div>
                      <div v-if="isSelectedThumbnail">
                        <b>
                          <br>{{ messages.label_selected_thumbnail }}
                        </b>
                      </div>
                      <div v-else>
                        <v-btn v-if="canSetThumbnail" @click.stop="selectThumbnail()">
                          {{ messages.button_select_thumbnail }}
                        </v-btn>
                      </div>
                    </div>
                  </td>
                  <td>
                    <v-btn v-if="thumbnailIndex < thumbnails.length - 1" @click.stop="nextThumbnail()">
                      {{ messages.button_next_thumbnail }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-else-if="showThumbnailSelector">
      <v-col>
        <div>
          {{ messages.info_no_thumbnails_found }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { basename } from 'path'

// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { findThumbnail, findThumbnails } from '@/shared/mediainfo'
import { proxyMediaUrl } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'ThumbnailSelector',
  props: {
    object: { type: Object, default: null }
  },
  data () {
    return {
      thumbnailIndex: null,
      showThumbnailSelector: false,
      width: Math.floor(document.documentElement.clientWidth * 0.6)
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    thumbnail () { return this.object ? findThumbnail(this.object) : null },
    thumbnails () { return this.object ? findThumbnails(this.object) : null },
    isSelectedThumbnail () {
      return this.object && this.object.meta && this.object.meta.selectedThumbnail
        ? this.thumbnails[this.thumbnailIndex] === this.object.meta.selectedThumbnail
        : false
    },
    canSetThumbnail () { return this.user && this.userStatus && this.userStatus.loggedIn }
  },
  created () {
    const thumb = this.thumbnail
    if (thumb) {
      const index = this.thumbnails.indexOf(thumb)
      this.thumbnailIndex = index === -1 ? null : index
      this.showThumbnailSelector = false
    }
  },
  methods: {
    ...mapActions('source', ['updateSelectedThumbnail']),
    toggleThumbnailSelection () { this.showThumbnailSelector = !this.showThumbnailSelector },
    proxyUrl (obj) { return proxyMediaUrl(obj, this.user, this.userStatus) },
    prevThumbnail () { this.thumbnailIndex-- },
    nextThumbnail () { this.thumbnailIndex++ },
    selectThumbnail () {
      const path = this.object.name
      const thumbnailAsset = this.thumbnails[this.thumbnailIndex]
      this.updateSelectedThumbnail({ path, thumbnailAsset })
    },
    thumbName (path) {
      console.log(`thumbName received path=${path}`)
      return path ? basename(path) : ''
    }
  }
}
</script>
