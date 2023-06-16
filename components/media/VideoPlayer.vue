<template>
  <div :style="`display: ${visible === true ? 'block' : 'none'}`">
    <video :id="videoId" ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js'

window.HELP_IMPROVE_VIDEOJS = false // just in case video.js is included via CDN

export default {
  name: 'VideoPlayer',
  props: {
    options: { type: Object, default () { return {} } },
    visible: { type: Boolean, default: null },
    videoId: { type: String, default: 'videoPlayer' }
  },
  data () {
    return {
      player: null
    }
  },
  mounted () {
    this.player = videojs(this.$refs.videoPlayer, this.options, () => {
      this.player.width(this.options.width || 640)
      if (this.options.height) {
        this.player.height(this.options.height)
      }
      if (this.options.poster) {
        this.player.poster(this.options.poster)
      }
      this.player.log('onPlayerReady', this)
    })
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
