<template>
  <div>
    <h2>{{ messages.admin_title_user_administration }}</h2>
    <table border="1">
      <thead>
        <tr>
          <th>{{ messages.label_email }}</th>
          <th>{{ messages.label_firstName }}</th>
          <th>{{ messages.label_lastName }}</th>
          <th>{{ messages.label_locale }}</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'UserAdministration',
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    messages () { return localeMessagesForUser(this.user) }
  }
}
</script>
