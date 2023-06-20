<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>
          {{ messages.title_profile }}
          <div>
            <a href="https://gravatar.com/">
              <v-avatar size="48px">
                <v-img :src="gravatarUrl" contain :alt="`avatar image for ${user.firstName}`" />
              </v-avatar>
            </a>
          </div>
        </h2>
      </v-col>
    </v-row>
    <v-row v-if="showSuccessSnackbar">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>{{ messages.info_profile_update }}</h4>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ValidationObserver ref="form">
          <v-form @submit.prevent="handleSubmit">
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="username" :rules="formRules.username" immediate>
                <v-text-field
                  v-model="user.username"
                  :label="messages.label_username"
                  readonly
                  type="text"
                  name="username"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('username', errors) : null"
                />
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="firstName" :rules="formRules.firstName" immediate>
                <v-text-field
                  v-model="user.firstName"
                  :label="messages.label_firstName"
                  type="text"
                  name="firstName"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('firstName', errors) : null"
                />
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="lastName" :rules="formRules.lastName" immediate>
                <v-text-field
                  v-model="user.lastName"
                  :label="messages.label_lastName"
                  type="text"
                  name="lastName"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('lastName', errors) : null"
                />
              </ValidationProvider>
            </div>
            <div v-if="supportedLocales.length > 1" class="form-group">
              <ValidationProvider v-slot="{ errors }" name="locale" rules="required" immediate>
                <v-select
                  v-model="user.locale"
                  :label="messages.label_locale"
                  :items="supportedLocales"
                  item-text="value"
                  item-value="name"
                  :value="userLocale"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('locale', errors) : null"
                />
              </ValidationProvider>
            </div>
          </v-form>
        </ValidationObserver>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="form-group">
          <v-btn class="btn btn-primary" :disabled="userStatus.updating" @click.stop="handleSubmit">
            {{ messages.button_update }}
          </v-btn>
        </div>
      </v-col>
      <v-col align-self="center">
        <NuxtLink to="/reset">
          {{ messages.button_reset_password }}
        </NuxtLink>
      </v-col>
      <v-col align-self="end">
        <v-btn @click.stop="deleteSelf">
          {{ messages.button_delete_my_account }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { DEFAULT_LOCALE, localesList, localeMessagesForUser, fieldErrorMessage } from '@/shared/locale'
import { currentUser, UI_CONFIG } from '@/services/util'
import { condensedRules } from '@/shared/type/validation'
import { gravatarEmailUrl } from '@/shared/type/userType'

export default {
  name: 'UserProfile',
  data () {
    return {
      user: currentUser(),
      submitted: false,
      showSuccessSnackbar: false,
      successSnackTimeout: -1
    }
  },
  computed: {
    ...mapState('user', ['userStatus', 'updateResults']),
    ...mapState(['browserLocale']),
    supportedLocales () { return localesList(this.user, this.browserLocale) },
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    userLocale () { return this.user && this.user.locale ? this.user.locale : DEFAULT_LOCALE },
    formRules () { return condensedRules() },
    gravatarUrl () { return this.user && this.user.email ? gravatarEmailUrl(this.user.email) : null }
  },
  watch: {
    updateResults (newResults) {
      if (newResults && newResults.email === this.user.email) {
        this.successSnackTimeout = UI_CONFIG.snackbarSuccessTimeout
        this.showSuccessSnackbar = true
      } else {
        this.successSnackTimeout = null
        this.showSuccessSnackbar = false
      }
    }
  },
  methods: {
    ...mapActions('user', ['updateUser', 'deleteUser']),
    async handleSubmit () {
      this.submitted = true
      await this.$refs.form.validate().then((success) => {
        if (success) {
          this.updateUser({ update: this.user })
          return
        }
        // Wait until the models are updated in the UI
        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
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
