<template>
  <div>
    <div>Dir is {{ displayPrefix }}</div>
    <div v-if="isNotRoot">
      Go back (prefix = {{ prefix }})
      <button @click="refresh(parentPrefix)">{{ parentPrefixDisplay }}</button>
    </div>
    <div v-for="(obj, index) in filteredObjectList" v-bind:key="index">
      <div v-if="obj.type && obj.type === 'dir'">
        Directory: <button @click="refresh(obj.name)">{{ filterName(obj.name) }}</button>
      </div>
      <div v-else>
        Regular file: {{ filterName(obj.name) }} JSON = {{ JSON.stringify(obj) }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ListVideos',
  data () {
    return {
      prefix: ''
    }
  },
  computed: {
    ...mapState('s3', ['objectList']),
    displayPrefix () {
      return this.prefix === '' ? '/' : this.prefix.endsWith('/') ? this.prefix.substring(0, this.prefix.length - 1) : this.prefix
    },
    isNotRoot () {
      return this.prefix !== ''
    },
    parentPrefix () {
      const base = this.prefix.endsWith('/') ? this.prefix.substring(0, this.prefix.length - 1) : this.prefix
      const pos = base.lastIndexOf('/')
      return pos === -1 ? '' : base.substring(0, pos - 1)
    },
    parentPrefixDisplay () {
      const base = this.prefix.endsWith('/') ? this.prefix.substring(0, this.prefix.length - 1) : this.prefix
      const pos = base.lastIndexOf('/')
      return pos === -1 ? '(back to top level)' : '(back to ' + base.substring(0, pos - 1) + ')'
    },
    filteredObjectList () {
      const filtered = []
      if (this.objectList && this.objectList.length && this.objectList.length > 0) {
        this.objectList.forEach((obj) => {
          if (obj.name && obj.name !== this.prefix) {
            filtered.push(obj)
          }
        })
      }
      return filtered
    }
  },
  created () {
    const prefix = this.prefix
    this.fetchObjects({ prefix })
  },
  methods: {
    ...mapActions('s3', ['fetchObjects']),
    refresh (prefix) {
      this.prefix = prefix
      // console.log('refreshing ListVideos, prefix: ' + prefix)
      this.fetchObjects({ prefix })
    },
    filterName (name) {
      return name.startsWith(this.prefix) ? name.substring(this.prefix.length) : name
    }
  }
}
</script>
