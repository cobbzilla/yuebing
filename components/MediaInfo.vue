<template>
  <div>
    this is the media info for {{ options.object.name }}
    <div v-for="(field, index) in infoFields" :key="index">
      <div v-if="infoField(field)">
        meta: {{ field }}: {{ infoField(field) }}
      </div>
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
        return {}
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
    ...mapState('s3', ['assetData']),
    infoFields () {
      return mediaInfoFields()
    },
    hasMediaInfoJsonPath () {
      return this.options.object && this.mediaInfoJsonPath
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
    }
  }
}
</script>
