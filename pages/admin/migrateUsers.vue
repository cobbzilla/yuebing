<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>
          {{ messages.admin_title_migrate_users }}
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-if="userMigrationResults">
          {{ messages.admin_label_migration_results }}
          <pre>{{ JSON.stringify(userMigrationResults, null, 2) }}</pre>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form>
          <div class="form-group">
            <v-text-field
              v-model="oldKey"
              :label="messages.admin_label_migration_oldKey"
              type="text"
              name="oldKey"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <v-text-field
              v-model="oldIV"
              :label="messages.admin_label_migration_oldIV"
              type="text"
              name="oldIV"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <v-btn class="btn btn-primary" @click.stop="handleSubmit">
              {{ messages.admin_button_migrate_users }}
            </v-btn>
          </div>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MigrateUsers',
  data () {
    return {
      oldKey: null,
      oldIV: null
    }
  },
  computed: {
    ...mapState('admin', ['userMigrationResults']),
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) }
  },
  methods: {
    ...mapActions('admin', ['migrateUsers']),
    handleSubmit () {
      const oldKey = this.oldKey
      const oldIV = this.oldIV
      this.migrateUsers({ oldKey, oldIV })
    }
  }
}
</script>
