<template>
  <div>
    <h2>
      {{ messages.admin_title_site_administration.parseMessage({ title }) }}
    </h2>
    <div>
      <h3>
        <NuxtLink to="/admin/config">
          {{ messages.admin_title_manage_configuration }}
        </NuxtLink>
      </h3>
    </div>
    <div>
      <h3>
        <NuxtLink to="/admin/sources">
          {{ messages.admin_title_source_administration }}
        </NuxtLink>
      </h3>
    </div>
    <div>
      <h3>
        <NuxtLink to="/admin/browse">
          {{ messages.admin_title_source_browser }}
        </NuxtLink>
      </h3>
    </div>
    <div>
      <h3>
        <NuxtLink to="/admin/indexes">
          {{ messages.admin_title_index_administration }}
        </NuxtLink>
      </h3>
    </div>
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
        <NuxtLink to="/admin/migrate">
          {{ messages.admin_title_migrate_data }}
        </NuxtLink>
      </h3>
    </div>
  </div>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import { publicConfigField } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'AdminIndex',
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    title () { return publicConfigField(this, 'title') }
  }
}
</script>
