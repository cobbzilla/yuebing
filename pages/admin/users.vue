<template>
  <div>
    <h2>{{ messages.admin_title_user_administration }}</h2>

    <h3 v-if="deleteUserError">
      {{ deleteUserErrorMessage }}
    </h3>

    <div>
      <ValidationObserver ref="form">
        <form @submit.prevent="handleSubmit">
          <ValidationProvider v-slot="{ errors }" name="searchTerms" rules="max:200" immediate>
            <div class="form-group">
              <label htmlFor="searchTerms">{{ messages.label_search }}</label>
              <input
                v-model="searchTerms"
                type="text"
                name="searchTerms"
                class="form-control"
                :class="{ 'is-invalid': errors.length>0 }"
              >
              <span v-show="errors.length>0" class="is-invalid">{{ fieldError('searchTerms', errors[0]) }}</span>
              <label htmlFor="searchTerms">{{ messages.label_sort }}</label>
              <select v-model="sortField" class="form-control">
                <option v-for="f in sortFields" :key="f" :value="f" :selected="f === sortField">
                  {{ messages['label_'+f] }}
                </option>
              </select>
              <label htmlFor="searchTerms">{{ messages.label_sort_order }}</label>
              <select v-model="sortOrder" class="form-control">
                <option value="ascending">{{ messages.label_sort_ascending }}</option>
                <option value="descending">{{ messages.label_sort_descending }}</option>
              </select>
              <button class="btn btn-primary" :disabled="findingUsers">
                {{ messages.button_search }}
              </button>
              <img v-show="findingUsers" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
            </div>
          </ValidationProvider>
        </form>
      </ValidationObserver>
    </div>

    <table v-if="userList" border="1">
      <thead>
        <tr><th colspan="6">{{ messages.admin_label_total_user_count.parseMessage({ totalUserCount }) }}</th></tr>
        <tr>
          <th>{{ messages.label_email }}</th>
          <th>{{ messages.label_firstName }}</th>
          <th>{{ messages.label_lastName }}</th>
          <th>{{ messages.label_locale }}</th>
          <th>{{ messages.label_ctime }}</th>
          <th>{{ messages.label_mtime }}</th>
          <th>{{ messages.admin_button_delete_user }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, userIndex) in userList" :key="userIndex">
          <td>{{ u.email }}</td>
          <td>{{ u.firstName }}</td>
          <td>{{ u.lastName }}</td>
          <td>{{ u.locale }}</td>
          <td>{{ messages.label_date_and_time.parseDateMessage(u.ctime, messages) }}</td>
          <td>{{ messages.label_date_and_time.parseDateMessage(u.mtime, messages) }}</td>
          <td>
            <button v-if="u.email !== user.email" @click="delUser(u)">
              {{ messages.admin_button_delete_user }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import { userSortFields } from '@/shared/user'

const JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION = 5

export default {
  name: 'UserAdministration',
  data () {
    return {
      pageNumber: 1,
      pageSize: 20,
      sortField: 'email',
      sortOrder: 'ascending',
      searchTerms: '',
      deleteConfirmCount: 0
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'userList']),
    ...mapState('admin', ['userList', 'findingUsers', 'totalUserCount', 'deleteUserError']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    sortFields () { return userSortFields() },
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
  created () {
    const query = this.searchQuery
    this.findUsers({ query })
  },
  methods: {
    ...mapActions('admin', ['findUsers', 'deleteUser']),
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    },
    handleSubmit (e) {
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
    }
  }
}
</script>
