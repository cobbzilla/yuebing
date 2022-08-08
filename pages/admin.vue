<template>
  <div>
    <h3>Transform Processing Queue:</h3>

    <!-- TOC -->
    <div v-for="(job, jobIndex) in queue" :key="jobIndex">
      <a :href="`#${job.sourcePath}`"><h4>{{ job.sourcePath }}</h4></a>
    </div>

    <!-- data -->
    <div v-if="queue">
      <table v-for="(job, jobIndex) in queue" :key="jobIndex">
        <thead>
          <tr>
            <th colspan="2">
              <a :id="`#${job.sourcePath}`"><h2>{{ job.sourcePath }}</h2></a>
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
      interval: null
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
    ...mapActions('asset', ['fetchQueue'])
  }
}
</script>
