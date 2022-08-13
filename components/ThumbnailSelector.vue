<template>
  <div>
    <button @click="toggleThumbnailSelection()">
      <span v-if="showThumbnailSelector">{{ messages.button_hide_thumbnails }}</span>
      <span v-else>{{ messages.button_show_thumbnails }}</span>
    </button>
    <div v-if="thumbnails && showThumbnailSelector">
      <div v-if="thumbnailIndex !== null">
        <table>
          <thead>
            <tr>
              <td colspan="3">
                <h4>
                  {{ thumbnails[thumbnailIndex] }}
                </h4>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <button v-if="thumbnailIndex > 0" @click="prevThumbnail()">
                  {{ messages.button_previous_thumbnail }}
                </button>
              </td>
              <td>
                <div>
                  <div>
                    <img :src="proxyUrl(thumbnails[thumbnailIndex])" :width="width" />
                  </div>
                  <div>{{ thumbnailIndex + 1 }} of {{ thumbnails.length }}</div>
                  <div v-if="isSelectedThumbnail">
                    <b>
                      <br/>{{ messages.label_selected_thumbnail }}
                    </b>
                  </div>
                  <div v-else>
                    <button v-if="canSetThumbnail" @click="selectThumbnail()">
                      {{ messages.button_select_thumbnail }}
                    </button>
                  </div>
                </div>
              </td>
              <td>
                <button v-if="thumbnailIndex < thumbnails.length - 1" @click="nextThumbnail()">
                  {{ messages.button_next_thumbnail }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else-if="showThumbnailSelector">
      {{ messages.info_no_thumbnails_found }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { findThumbnail, findThumbnails } from '@/shared/mediainfo'
import { proxyMediaUrl } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'ThumbnailSelector',
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
      thumbnailIndex: null,
      showThumbnailSelector: false,
      width: Math.floor(document.documentElement.clientWidth * 0.6)
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    thumbnail () { return this.options.object ? findThumbnail(this.options.object) : null },
    thumbnails () { return this.options.object ? findThumbnails(this.options.object) : null },
    isSelectedThumbnail () {
      return this.options.object && this.options.object.meta && this.options.object.meta.selectedThumbnail
        ? this.thumbnails.indexOf(this.options.object.meta.selectedThumbnail) === this.thumbnailIndex
        : false
    },
    canSetThumbnail () { return this.user && this.userStatus && this.userStatus.loggedIn }
  },
  created () {
    const thumb = this.thumbnail
    if (thumb) {
      const index = this.thumbnails.indexOf(thumb)
      console.log(`ThumbnailSelector.created: index=${index} for thumb=${thumb}`)
      this.thumbnailIndex = index === -1 ? null : index
      this.showThumbnailSelector = false
    }
  },
  methods: {
    ...mapActions('s3', ['updateSelectedThumbnail']),
    toggleThumbnailSelection () { this.showThumbnailSelector = !this.showThumbnailSelector },
    proxyUrl (obj) { return proxyMediaUrl(obj, this.user, this.userStatus) },
    prevThumbnail () { this.thumbnailIndex-- },
    nextThumbnail () { this.thumbnailIndex++ },
    selectThumbnail () {
      const path = this.options.object.name
      const thumbnailAsset = this.thumbnails[this.thumbnailIndex]
      this.updateSelectedThumbnail({ path, thumbnailAsset })
    }
  }
}
</script>
