import axios from 'axios'

axios.defaults.baseURL = 'http://141.19.142.7:3000/'

export default {

  getmarketplaceBots (cb) {
    setTimeout(function () {
      axios.get('/bot/public')
            .then(function (response) {
              cb(response.data.extra)
            })
            .catch(function (error) {
              console.log(error)
            })
    }, 100)
  },
  addNewMarketplace (cb, bot) {
    setTimeout(function () {
      axios.put('/bot/' + bot.id + '/privacy', {
        'name': bot.name,
        'description': bot.description,
        'intents': [],
        'test': 'true',
        'botType': 'faq',
        'privacy': 'public'
      },
        {
          headers: {
            Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4'
          }
        })
      .then(function (response) {
        bot.id = response.data.extra.botId
        cb(bot)
      })
      .catch(function (error) {
        console.log(error)
      })
    }, 100)
  },
  deleteBot (cb, bot) {
    setTimeout(function () {
      console.log(bot)
      axios.delete('/bot/' + bot.id, {
        headers: {
          Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4'
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
    }, 100)
  }
}
