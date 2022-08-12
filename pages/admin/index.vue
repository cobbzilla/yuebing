<template>
  <div>
    <h2>{{ messages.admin_title_site_administration.parseMessage({ title }) }}</h2>
    <div>
      <h3>
        <NuxtLink to="/admin/users">
          {{ messages.admin_title_user_administration }}
        </NuxtLink>
      </h3>
    </div>
    <div>
      <h3>
        <NuxtLink to="/admin/queue">
          {{ messages.admin_title_transform_queue }}
        </NuxtLink>
      </h3>
    </div>
    <div>
      <h3>
        <NuxtLink to="/admin/migrateUsers">
          {{ messages.admin_title_migrate_users }}
        </NuxtLink>
      </h3>
    </div>
    <div>
      <h3>
        <NuxtLink to="/">
          {{ messages.admin_title_main_site.parseMessage({ title }) }}
        </NuxtLink>
      </h3>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import config from '../../nuxt.config'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'AdminIndex',
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    messages () { return localeMessagesForUser(this.user) },
    title () { return config.publicRuntimeConfig.title }
  }
}
</script>
