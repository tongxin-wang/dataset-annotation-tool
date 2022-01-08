<template>
  <div class="home">
    <v-container class="my-5 d-flex flex-column justify-center">
      <div>
        <v-row justify="center">
          <v-col cols="6">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Name"
                required
                @keyup="keyUp"
              ></v-text-field>

              <v-text-field
                v-model="pwd"
                :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="pwdRules"
                :type="showPwd ? 'text' : 'password'"
                name="input-10-2"
                label="Password"
                class="input-group--focused"
                @click:append="showPwd = !showPwd"
                @keyup="keyUp"
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="login"
              >
                Login
              </v-btn>
            </v-form>
          </v-col>
        </v-row>

        <v-snackbar
          v-model="snackbar"
          top
          color="red"
          text
        >
          {{ errorMsg }}

          <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-container>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  data: () => ({
    showPwd: false,
    valid: true,
    name: '',
    nameRules: [(v) => !!v || 'Name is required'],
    pwd: '',
    pwdRules: [(v) => !!v || 'Password is required'],
    snackbar: false,
    errorMsg: ''
  }),

  methods: {
    login() {
      if (this.$refs.form.validate()) {
        let formData = new FormData()
        formData.append('name', this.name)
        formData.append('pwd', this.pwd)
        Axios.post(this.$api.BASE_URL + 'auth', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((response) => {
          if (response.data['success']) {
            localStorage.setItem('name', response.data['name'])
            // login successfully, get redirect path
            const redirect = this.$route.query.redirect
            if (redirect) {
              this.$router.push(redirect)
            } else {
              this.$router.push('/')
            }
          } else {
            this.errorMsg = response.data['error_msg']
            this.snackbar = true
          }
        })
      }
    },
    keyUp: function (event) {
      // enter for login
      if (event.keyCode === 13) {
        this.login()
      }
    }
  }
}
</script>
