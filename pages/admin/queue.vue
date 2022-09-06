<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>
          {{ messages.admin_title_transform_queue }}
        </h3>
      </v-col>
    </v-row>
    <v-row v-if="!queue || queue.length === 0">
      <v-col>
        {{ messages.admin_label_xformQueueEmpty }}
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <!-- TOC -->
        <div v-for="(j, jobIndex) in queue" :key="jobIndex">
          <v-btn @click.stop="displayJobDetails(j)" :color="jobColor(j)">
            {{ j.sourcePath }}: {{ new Date(j.firstEvent).toLocaleString('en-US') }} to {{ new Date(j.lastEvent).toLocaleString('en-US') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- data -->
        <div v-if="job && job !== -1">
          <table>
            <thead>
              <tr>
                <th colspan="2">
                  <h2>{{ job.sourcePath }}</h2>
                </th>
              </tr>
              <tr>
                <th><h3>{{ messages.admin_label_firstEvent }}</h3></th>
                <th><h3>{{ messages.admin_label_lastEvent }}</h3></th>
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
                        <th>{{ messages.admin_label_eventTime }}</th>
                        <th>{{ messages.admin_label_eventName }}</th>
                        <th>{{ messages.admin_label_eventDescription }}</th>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'

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
    ...mapState('admin', ['queue']),
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) }
  },
  watch: {
    queue (newQueue) {
      if (newQueue && newQueue.length > 0 && this.job === null) {
        this.displayJobDetails(newQueue[0])
      }
    }
  },
  created () {
    if (!this.interval) {
      this.interval = setInterval(() => this.fetchQueue(), UPDATE_INTERVAL)
    }
    this.fetchQueue()
  },
  destroyed () {
    if (this.interval) { clearInterval(this.interval) }
  },
  beforeUnmount () {
    if (this.interval) { clearInterval(this.interval) }
  },
  methods: {
    ...mapActions('admin', ['fetchQueue']),
    shasum (val) {
      return require('shasum')(val)
    },
    displayJobDetails (j) {
      if (this.queue) {
        this.job = this.job && this.job.sourcePath === j.sourcePath ? -1 : j
      }
    },
    jobColor (j) {
      if (j.jobStatus) {
        if (j.jobStatus.completed) { return 'success' }
        if (j.jobStatus.failed) { return 'error' }
        if (j.jobStatus.running) { return 'warning' }
        return 'info'
      }
    }
  }
}
</script>
