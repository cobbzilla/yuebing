<template>
  <div>
    <div v-for="(field, index) in infoFields" :key="index">
      info field: {{ field }}: {{ infoField(field) }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { mediaProfileByName, isMediaInfoJsonProfile } from '@/shared/media'
import { mediaInfoFields, mediaInfoField, hasAssets, findAsset } from '@/shared/mediainfo'

export default {
  name: 'MediaInfo',
  props: {
    options: {
      type: Object,
      default () {
        return { object: null }
      }
    }
  },
  data () {
    return {
      mediaInfoJsonPath: null,
      mediaInfo: null
    }
  },
  computed: {
    ...mapState('user', ['user', 'status']),
    infoFields () {
      return mediaInfoFields
    }
  },
  watch: {
    assetData (newAssetData, oldAssetData) {
      if (this.hasMediaInfoJsonPath && newAssetData[this.mediaInfoJsonPath]) {
        this.mediaInfoJson = newAssetData[this.mediaInfoJsonPath]
      } else {
        console.log(`watch:assets: ${this.mediaInfoJsonPath} was not found in ${JSON.stringify(Object.keys(newAssetData))}`)
      }
    }
  },
  created () {
    this.refreshMediaInfo()
  },
  methods: {
    ...mapActions('s3', ['fetchAsset']),
    infoField (field) {
      return this.mediaInfo ? mediaInfoField(field, this.mediaInfo) : null
    },
    refreshMediaInfo () {
      if (hasAssets(this.object) && !this.mediaInfoJsonPath) {
        this.mediaInfoJsonPath = findAsset(this.object, (assets, profile) => {
          const mediaProfile = mediaProfileByName(this.object.mediaType, profile)
          return isMediaInfoJsonProfile(mediaProfile)
        })
        if (this.mediaInfoJsonPath) {
          const path = this.mediaInfoJsonPath
          this.fetchAsset({ path })
        }
      } else {
        console.log('refreshMediaInfo: mediaInfo already loaded for media, not replacing')
      }
    }
  }
}
</script>
