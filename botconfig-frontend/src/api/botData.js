import axios from 'axios'

axios.defaults.baseURL = 'http://141.19.142.7:3000'

export default {
  getBots (cb) {
    setTimeout(function () {
      axios.get('/bot', { headers: { Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4' } })
            .then(function (response) {
              cb(response.data.extra)
            })
            .catch(function (error) {
              console.log(error)
            })
    }, 100)
  },
  addNewBot (cb, bot) {
    setTimeout(function () {
      axios.post('/bot', {
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
        bot._id = response.data.extra.botId
        cb(bot)
      })
      .catch(function (error) {
        console.log(error)
      })
    }, 100)
  },
  changeBotState (bot, start, stop) {
    setTimeout(function () {
      if (bot.status === 'running') {
        axios.put('/bot/' + bot._id + '/stop', {
          'status': bot.status
        })
        .then(function (response) {
          stop(bot)
        })
        .catch(function (error) {
          console.log(error)
        })
      } else {
        axios.put('/bot/' + bot._id + '/start', {
          'status': bot.status
        })
        .then(function (response) {
          start(bot)
        })
        .catch(function (error) {
          console.log(error)
        })
      }
    }, 100)
  },
  deleteBot (cb, bot) {
    setTimeout(function () {
      axios.delete('/bot/' + bot._id, {
        headers: {
          Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4'
        }
      })
      .then(function (response) {
        cb(bot)
      })
      .catch(function (error) {
        console.log(error)
      })
    }, 100)
  },
  renameBot (cb, bot) {
    setTimeout(function () {
      bot[0].name = bot[1].name
      axios.put('/bot/' + bot[0]._id, bot[0], { headers: { Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4' } })
            .then(function (response) {
              cb(bot)
            })
            .catch(function (error) {
              console.log(error)
            })
    }, 100)
  },
  getBot (cb, bot) {
    setTimeout(() => {
      axios.get('/bot/' + bot._id, {
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
