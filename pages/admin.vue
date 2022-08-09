<template>
  <div>
    <h3>Transform Processing Queue</h3>

    <!-- TOC -->
    <div v-for="(j, jobIndex) in queue" :key="jobIndex" @click="displayJobDetails(j)">
      <h5>
        {{ j.sourcePath }}: {{ new Date(j.firstEvent).toLocaleString('en-US') }} to {{ new Date(j.lastEvent).toLocaleString('en-US') }}
      </h5>
    </div>

    <!-- data -->
    <div v-if="job">
      <table>
        <thead>
          <tr>
            <th colspan="2">
              <h2>{{ job.sourcePath }}</h2>
            </th>
          </tr>
          <tr>
            <th><h3>first event</h3></th>
            <th><h3>last event</h3></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td align="center">{{ new Date(job.firstEvent).toLocaleString('en-US') }}</td>
            <td align="center">{{ new Date(job.lastEvent).toLocaleString('en-US') }}</td>
          </tr>
          <tr>
            <td colspan="2">
              <table border="1">
                <thead>
                  <tr>
                    <th>time</th>
                    <th>event</th>
                    <th>description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(event, eventIndex) in job.events" :key="eventIndex">
                    <td nowrap="nowrap">{{ new Date(event.time).toLocaleString('en-US') }}</td>
                    <td>{{ event.name }}</td>
                    <td>{{ event.description }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const UPDATE_INTERVAL = 1000 * 15

export default {
  name: 'AdminPage',
  data () {
    return {
      interval: null,
      job: null
    }
  },
  computed: {
    ...mapState('asset', ['queue'])
  },
  created () {
    this.interval = setInterval(() => this.fetchQueue(), UPDATE_INTERVAL)
    this.fetchQueue()
  },
  beforeUnmount () {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    ...mapActions('asset', ['fetchQueue']),
    shasum (val) {
      return require('shasum')(val)
    },
    displayJobDetails (j) {
      if (this.queue) {
        this.job = this.job && this.job.sourcePath === j.sourcePath ? null : j
      }
    }
  }
}
</script>
