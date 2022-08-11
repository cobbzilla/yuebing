<template>
  <div>
    <h2>Rotate Key</h2>
    <div v-if="userMigrationResults">
      userMigrationResults = {{ JSON.stringify(userMigrationResults) }}
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="oldKey">Old Key</label>
        <input v-model="oldKey" type="text" name="oldKey" class="form-control" />
      </div>
      <div class="form-group">
        <label for="oldIV">Old IV (if one was set)</label>
        <input v-model="oldIV" type="text" name="oldIV" class="form-control" />
      </div>
      <div class="form-group">
        <button class="btn btn-primary">
          Migrate
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MigrateUsers',
  data () {
    return {
      oldKey: null,
      oldIV: null
    }
  },
  computed: {
    ...mapState('admin', ['userMigrationResults'])
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
