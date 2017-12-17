import axios from 'axios'

axios.defaults.baseURL = process.env.API_URL

export default {

  getmarketplaceBots (cb) {
    axios.get('/bot/public')
          .then(function (response) {
            cb(response.data.extra)
          })
          .catch(function (error) {
            console.log(error)
          })
  },
  addNewMarketplace (cb, bot) {
    axios.put('/bot/' + bot.id + '/privacy', {
      'privacy': 'public'
    },
      {
        headers: {
          Authorization: '23625217'
        }
      })
    .then(function (response) {
      bot.id = response.data.extra.botId
      cb(bot)
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  deleteBot (cb, bot) {
    axios.delete('/bot/' + bot.id, {
      headers: {
        Authorization: '23625217'
      },
      data: {
        test: ''
      }
    })
    .then(function (response) {
      cb(bot)
    })
    .catch(function (error) {
      console.log(error)
    })
  }
}
