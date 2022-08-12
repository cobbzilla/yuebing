<template>
  <div>
    <h2>{{ messages.title_profile }}</h2>
    <ValidationObserver ref="form">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="firstName">{{ messages.label_firstName }}</label>
          <ValidationProvider v-slot="{ errors }" name="firstName" rules="required|min:2" immediate>
            <input
              v-model="user.firstName"
              type="text"
              name="firstName"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors.length>0 }"
            >
            <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('firstName', errors[0]) }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group">
          <ValidationProvider v-slot="{ errors }" name="lastName" rules="required|min:3" immediate>
            <label for="lastName">{{ messages.label_lastName }}</label>
            <input
              v-model="user.lastName"
              type="text"
              name="lastName"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors.length>0 }"
            >
            <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('lastName', errors[0]) }}</span>
          </ValidationProvider>
        </div>

        <div v-if="supportedLocales.length > 1" class="form-group">
          <ValidationProvider v-slot="{ errors }" name="locale" rules="required" immediate>
            <label htmlFor="locale">{{ messages.label_locale }}</label>
            <select v-model="user.locale" class="form-control">
              <option v-for="loc in supportedLocales" :key="loc.name" :value="loc.name" :selected="localeSelected(loc.name)">
                {{ loc.value }}
              </option>
            </select>
            <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('locale', errors[0]) }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group">
          <button class="btn btn-primary" :disabled="userStatus.updating">
            {{ messages.button_update }}
          </button>
          <img v-show="userStatus.updating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==">
        </div>
      </form>
    </ValidationObserver>
    <div>
      <button @click="deleteSelf()">
        {{ messages.button_delete_my_account }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { DEFAULT_LOCALE, localesList, localeMessagesForUser, fieldErrorMessage } from '@/shared/locale'
import { currentUser } from '@/services/util'

export default {
  name: 'UserProfile',
  data () {
    return {
      user: currentUser(),
      submitted: false
    }
  },
  computed: {
    ...mapState('user', ['userStatus']),
    supportedLocales () { return localesList() },
    messages () { return localeMessagesForUser(this.user) }
  },
  methods: {
    ...mapActions('user', ['updateUser', 'deleteUser']),
    async handleSubmit (e) {
      this.submitted = true
      const errors = await this.$refs.form.validate().then((success) => {
        if (success) {
          this.updateUser({ update: this.user })
          return
        }
        // Wait until the models are updated in the UI
        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
      console.log(`handleSubmit: received errors: ${JSON.stringify(errors)}`)
    },
    localeSelected (loc) {
      return this.user && this.user.locale ? loc === this.user.locale : loc === DEFAULT_LOCALE
    },
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    },
    deleteSelf () {
      if (confirm(this.messages.label_confirm_user_delete)) {
        this.deleteUser()
      }
    }
  }
}
</script>
