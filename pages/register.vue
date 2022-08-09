<template>
  <div>
    <h2>Register</h2>
    <ValidationObserver ref="form">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <ValidationProvider v-slot="{ errors }" name="firstName" rules="required|min:2" immediate>
            <input
              v-model="user.firstName"
              type="text"
              name="firstName"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors.length>0 }"
            >
            <span v-show="errors.length>0" class="is-invalid">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group">
          <ValidationProvider v-slot="{ errors }" name="lastName" rules="required|min:3" immediate>
            <label for="lastName">Last Name</label>
            <input
              v-model="user.lastName"
              type="text"
              name="lastName"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors.length>0 }"
            >
            <span v-show="errors.length>0" class="is-invalid">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group">
          <ValidationProvider v-slot="{ errors }" name="username" rules="required|min:2" immediate>
            <label for="username">Username</label>
            <input
              v-model="user.username"
              type="text"
              name="username"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors.length>0 }"
            >
            <span v-show="errors.length>0" class="is-invalid">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group">
          <ValidationProvider v-slot="{ errors }" name="password" rules="required|min:8" immediate>
            <label htmlFor="password">Password</label>
            <input
              v-model="user.password"
              type="password"
              name="password"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors.length>0 }"
            >
            <span v-show="errors.length>0" class="is-invalid">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group">
          <button class="btn btn-primary" :disabled="status.registering">
            Register
          </button>
          <img v-show="status.registering" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==">
          <router-link to="/login" class="btn btn-link">
            Cancel
          </router-link>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'UserRegistration',
  data () {
    return {
      user: {
        firstName: '',
        lastName: '',
        username: '',
        password: ''
      },
      submitted: false
    }
  },
  computed: {
    ...mapState('user.js', ['status'])
  },
  methods: {
    ...mapActions('user.js', ['register']),
    handleSubmit (e) {
      this.submitted = true
      this.$refs.form.validate().then((success) => {
        if (success) {
          this.register(this.user)
          return
        }
        // Wait until the models are updated in the UI
        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    }
  }
}
</script>
