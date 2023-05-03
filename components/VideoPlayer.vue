<template>
  <div>
    <video id="video-player" ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js'

window.HELP_IMPROVE_VIDEOJS = false // just in case video.js is included via CDN

export default {
  name: 'VideoPlayer',
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
      player: null
    }
  },
  mounted () {
    this.player = videojs(this.$refs.videoPlayer, this.options, () => {
      // this.player.width(300)
      // this.player.height(300)
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
