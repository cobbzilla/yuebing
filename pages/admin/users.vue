<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.admin_title_user_administration }}</h2>
        <h3 v-if="deleteUserError">
          {{ deleteUserErrorMessage }}
        </h3>
      </v-col>
    </v-row>
    <v-row v-if="userList && totalUserCount > 0">
      <v-col>
        <div>
          <ValidationObserver ref="form">
            <v-form @submit.prevent="handleSubmit">
              <ValidationProvider v-slot="{ errors }" name="searchTerms" rules="max:200" immediate>
                <div class="form-group">
                  <v-text-field
                    v-model="searchTerms"
                    :label="messages.label_search"
                    type="text"
                    name="searchTerms"
                    class="form-control"
                    :error="errors.length>0"
                    :error-messages="fieldError('searchTerms', errors)"
                    @keyup.enter="handleSubmit"
                  />
                  <v-select
                    v-model="sortField"
                    :label="messages.label_sort"
                    :items="localizedSortFields"
                    item-text="message"
                    item-value="name"
                    value="email"
                    class="form-control"
                  />
                  <v-select
                    v-model="sortOrder"
                    :label="messages.label_sort_order"
                    :items="sortOrders"
                    item-text="message"
                    item-value="name"
                    value="ascending"
                    class="form-control"
                  />
                  <v-btn class="btn btn-primary" :disabled="findingUsers" @click.stop="handleSubmit">
                    {{ messages.button_search }}
                  </v-btn>
                </div>
              </ValidationProvider>
            </v-form>
          </ValidationObserver>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="userList && totalUserCount > 0">
      <v-col>
        <table>
          <thead>
            <tr>
              <th colspan="6">
                {{ messages.admin_label_total_user_count.parseMessage({ totalUserCount }) }}
              </th>
            </tr>
            <tr>
              <th>{{ messages.label_email }}</th>
              <th>{{ messages.label_username }}</th>
              <th>{{ messages.label_firstName }}</th>
              <th>{{ messages.label_lastName }}</th>
              <th>{{ messages.label_locale }}</th>
              <th>{{ messages.label_ctime }}</th>
              <th>{{ messages.label_mtime }}</th>
              <th>{{ messages.label_editor }}</th>
              <th>{{ messages.admin_button_delete_user }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(u, userIndex) in userList" :key="userIndex">
              <td>{{ u.email }}</td>
              <td>{{ u.username }}</td>
              <td>{{ u.firstName }}</td>
              <td>{{ u.lastName }}</td>
              <td>{{ u.locale }}</td>
              <td>{{ messages.label_date_and_time.parseDateMessage(u.ctime, messages) }}</td>
              <td>{{ messages.label_date_and_time.parseDateMessage(u.mtime, messages) }}</td>
              <td>
                <v-checkbox v-if="u.email !== user.email" v-model="editorFlags[u.email]" @change="editorCheckbox(u)" />
              </td>
              <td>
                <v-btn v-if="u.email !== user.email" @click.stop="delUser(u)">
                  {{ messages.admin_button_delete_user }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-container>
          <v-row>
            <v-col>
              <h3>{{ messages.admin_button_add_user }}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <OrmForm
                form-name="userCreateForm"
                :thing="newUser"
                save-button-message="admin_button_add_user"
                :fields="userFields"
                :create="true"
                :submitted="newUserSubmitted"
                :server-errors="createUserError"
                @update="onOrmUpdate"
                @submitted="onOrmSubmit"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import OrmForm from '@/components/OrmForm'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import { USER_TYPEDEF, userSortFields, localizedUserSortFields } from '@/shared/model/user'

const JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION = 5

export default {
  name: 'ManageUsers',
  components: { OrmForm },
  data () {
    return {
      pageNumber: 1,
      pageSize: 20,
      sortField: 'email',
      sortOrder: 'ascending',
      searchTerms: '',
      deleteConfirmCount: 0,
      sortOrders: null,
      editorFlags: {},
      newUser: {},
      newUserSubmitted: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    ...mapState('admin', ['userList', 'findingUsers', 'totalUserCount', 'createUserError', 'deleteUserError']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    sortFields () { return userSortFields() },
    localizedSortFields () { return localizedUserSortFields(this.messages) },
    userFields () { return USER_TYPEDEF.tabIndexedFields() },
    searchQuery () {
      return {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchTerms: this.searchTerms,
        sort: {
          field: this.sortField,
          order: this.sortOrder
        }
      }
    },
    deleteUserErrorMessage () {
      let msg = ''
      if (this.deleteUserError) {
        Object.keys(this.deleteUserError).forEach((field) => {
          if (msg.length > 1) {
            msg += ', '
          }
          msg += this.fieldError(field, this.deleteUserError[field][0])
        })
      }
      return msg
    }
  },
  watch: {
    userList (newUserList) {
      if (newUserList && newUserList.length > 0) {
        for (const u of newUserList) {
          this.editorFlags[u.email] = u.editor
        }
      }
    }
  },
  created () {
    const query = this.searchQuery
    this.sortOrders = [
      { name: 'ascending', message: this.messages.label_sort_ascending },
      { name: 'descending', message: this.messages.label_sort_descending }
    ]
    this.findUsers({ query })
  },
  methods: {
    ...mapActions('admin', ['findUsers', 'createUser', 'deleteUser', 'setEditor']),
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    },
    handleSubmit () {
      const query = this.searchQuery
      this.findUsers({ query })
    },
    delUser (u) {
      const email = u.email
      if (this.deleteConfirmCount > JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION ||
        confirm(this.messages.admin_label_confirm_user_delete.parseMessage({ email }))) {
        this.deleteConfirmCount++
        this.deleteUser({ email })
      } else {
        this.deleteConfirmCount = 0
      }
    },
    editorCheckbox (u) {
      this.setEditor({ email: u.email, editor: this.editorFlags[u.email] })
    },
    onOrmUpdate (update) {
      // console.log(`onOrmUpdate received: ${JSON.stringify(update)}`)
      if (update.field && update.value) {
        this.newUser[update.field] = update.value
      }
    },
    onOrmSubmit (submitted) {
      this.newUserSubmitted = true
      if (submitted) {
        const user = this.newUser
        console.log(`onOrmSubmit sending user??: ${JSON.stringify(user)}`)
        this.createUser({ user })
      }
    }
  }
}
</script>
