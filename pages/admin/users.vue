<template>
  <v-container>
    <OrmAdmin
      :type-def="typeDef"
      :type-name-message="'admin_label_user'"
      :type-admin-message="`admin_title_${typeDef.typeName}_administration`"
      :object-list="userList"
      :total-object-count="totalUserCount"
      :add-object-object="newUser"
      :add-object-success="createUserSuccess || {}"
      :add-object-error="createUserError || {}"
      :edit-object-success="editUserSuccess || {}"
      :edit-object-error="editUserError || {}"
      :object-submitted="newUserSubmitted"
      :can-delete="() => true"
      :read-only-object="() => false"
      :can-edit="() => true"
      :delete-object-message="'admin_button_delete_user'"
      :delete-object-success="deleteUserSuccess || {}"
      :delete-object-error="deleteUserError || {}"
      :delete-confirmation-message="'admin_label_confirm_user_delete'"
      :object-operation-in-progress="userOperationRunning"
      :action-configs="{
        browse: {
          when: v => v.readOnly,
          path: '/admin/browse',
          message: 'admin_button_browse_user'
        }
      }"
      @query="onQuery"
      @newObjectUpdate="onNewObjectUpdate"
      @newObjectSubmit="onNewObjectSubmit"
      @editObjectSubmit="onEditObjectSubmit"
      @deleteObject="onDeleteObject"
    />
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import OrmAdmin from '@/components/orm/OrmAdmin'
import { publicConfigField, deepUpdate } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'
import { USER_TYPEDEF } from '@/shared/type/userType'

export default {
  name: 'ManageUsers',
  components: { OrmAdmin },
  data () {
    return {
      typeDef: USER_TYPEDEF,
      userOperationRunning: false,
      newUser: USER_TYPEDEF.newFullInstance(),
      newUserSubmitted: false
    }
  },
  computed: {
    ...mapState(['publicConfig', 'browserLocale']),
    ...mapState('user', ['user']),
    ...mapState('admin', [
      'userList', 'totalUserCount', 'findingUsers',
      'createUserSuccess', 'createUserError',
      'editUserSuccess', 'editUserError',
      'deleteUserSuccess', 'deleteUserError'
    ]),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    title () { return publicConfigField(this, 'title') }
  },
  watch: {
    createUserSuccess (success) {
      console.log(`users: createUserSuccess received: ${JSON.stringify(success)}`)
      if (success) {
        Object.assign(this.newUser, USER_TYPEDEF.newFullInstance())
      }
    }
  },
  created () {
    this.loadPublicConfig()
  },
  methods: {
    ...mapActions(['loadPublicConfig']),
    ...mapActions('admin', ['findUsers', 'createUser', 'editUser', 'deleteUser']),
    onQuery (query) {
      if (query) {
        this.findUsers({ query })
      }
    },
    onNewObjectUpdate (update) {
      console.log(`onNewObjectUpdate received: ${JSON.stringify(update)}`)
      if (update.field && typeof (update.value) !== 'undefined') {
        console.log(`onNewObjectUpdate APPLYING: ${JSON.stringify(update)}`)
        deepUpdate(this.newUser, update.field, update.value)
      }
    },
    onNewObjectSubmit () {
      const user = this.newUser
      this.createUser({ user })
    },
    onEditObjectSubmit (user) {
      this.editUser({ user })
    },
    onDeleteObject (obj) {
      console.log(`onDeleteObject ${JSON.stringify(obj)} `)
      const username = obj.username
      if (!username) {
        return
      }
      this.deleteUser({ username })
    }
  }
}
</script>
