<template>
  <div id="login">
    <md-layout md-tag="form" novalidate md-align="center">
      <md-layout md-tag="md-card" md-column md-flex="30" md-flex-medium="55" md-flex-small="60" md-flex-xsmall="80" md-large="30">
        <md-card-header>
          <div class="md-title"><img class="logo" src="../assets/ROQY.png" alt="ROQY"></div>
        </md-card-header>

        <md-card-content>
          <md-input-container>
            <md-icon>person</md-icon>
            <label>{{$lang.translate.login.username}}</label>
            <md-input  required v-model="form.username"/>
          </md-input-container>

          <md-input-container md-has-password>
            <md-icon>lock</md-icon>
            <label>{{$lang.translate.login.password}}</label>
            <md-input type="password" required v-model="form.password"/>
          </md-input-container>
        </md-card-content>

        <md-card-actions>
          <md-button  @click="sendUser()">{{$lang.translate.login.title}}</md-button>
        </md-card-actions>
      </md-layout>
    </md-layout>
  </div>
</template>
<script>

export default {
  name: 'login',
  data: () => ({
    form: {
      username: '',
      password: ''
    }
  }),
  methods: {
    sendUser () {
      if (this.form.username !== '' && this.form.password !== '') {
        this.$store.dispatch('logIn', {
          username: this.form.username,
          password: this.form.password
        })
        this.$router.push('/bots')
        this.saveUserLocalStorage()
      }
    },
    clearForm () {
      this.form.username = ''
      this.form.password = ''
    },
    saveUserLocalStorage () {
      setTimeout(() => {
        let user = {username: this.form.username, password: this.form.password}
        console.log(user)
        this.$localStorage.set('user', JSON.stringify(user))
        this.clearForm()
      }, 100)
    }
  }
}
</script>

<style scoped>
#login {
    text-align: center;
}
.logo {
  height: 35px;
}
form {
  margin-top: 100px;
}
body {
  max-height: 100%;
}
</style>