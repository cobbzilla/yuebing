<template>
  <div>
    <button @click="toggleThumbnailSelection()">
      {{ thumbnailToggleLabel }} thumbnails
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
                  Previous
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
                      <br/>~ currently selected ~
                    </b>
                  </div>
                  <div v-else>
                    <button v-if="canSetThumbnail" @click="selectThumbnail()">
                      select this thumbnail
                    </button>
                  </div>
                </div>
              </td>
              <td>
                <button v-if="thumbnailIndex < thumbnails.length - 1" @click="nextThumbnail()">
                  Next
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else-if="showThumbnailSelector">
      No thumbnails found!
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { findThumbnail, findThumbnails } from '@/shared/mediainfo'
import { proxyMediaUrl } from '@/shared'

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
    ...mapState('user', ['user', 'status']),
    thumbnailToggleLabel () { return this.showThumbnailSelector ? 'hide' : 'show' },
    thumbnail () { return this.options.object ? findThumbnail(this.options.object) : null },
    thumbnails () { return this.options.object ? findThumbnails(this.options.object) : null },
    isSelectedThumbnail () {
      return this.options.object && this.options.object.meta && this.options.object.meta.selectedThumbnail
        ? this.thumbnails.indexOf(this.options.object.meta.selectedThumbnail) === this.thumbnailIndex
        : false
    },
    canSetThumbnail () { return this.user && this.status && this.status.loggedIn }
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
    proxyUrl (obj) { return proxyMediaUrl(obj, this.user, this.status) },
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
