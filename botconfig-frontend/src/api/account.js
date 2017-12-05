import axios from 'axios'

axios.defaults.baseURL = 'http://141.19.142.7:3000'

export default {
  logIn (account, cb) {
    if (account !== null) {
      setTimeout(() => {
        axios.post('/auth', {
          'username': account.username,
          'password': account.password
        })
        .then(function (response) {
          cb(account)
        })
      .catch(function (error) {
        console.log(error.message)
      })
      }, 100)
    }
  }
}
