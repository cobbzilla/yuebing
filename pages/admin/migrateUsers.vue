<template>
  <div>
    <h2>
      {{ messages.admin_title_migrate_users }}
    </h2>
    <div v-if="userMigrationResults">
      {{ messages.admin_label_migration_results }}
      <pre>{{ JSON.stringify(userMigrationResults, null, 2) }}</pre>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="oldKey">{{ messages.admin_label_migration_oldKey }}</label>
        <input v-model="oldKey" type="text" name="oldKey" class="form-control" />
      </div>
      <div class="form-group">
        <label for="oldIV">{{ messages.admin_label_migration_oldIV }}</label>
        <input v-model="oldIV" type="text" name="oldIV" class="form-control" />
      </div>
      <div class="form-group">
        <button class="btn btn-primary">
          {{ messages.admin_button_migrate_users }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'

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
    handleSubmit (e) {
      const oldKey = this.oldKey
      const oldIV = this.oldIV
      this.migrateUsers({ oldKey, oldIV })
    }
  }
}
</script>
