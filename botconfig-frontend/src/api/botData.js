import axios from 'axios'

axios.defaults.baseURL = process.env.API_URL

export default {
  uploadBot (bot) {
    return new Promise((resolve, reject) => {
      axios.put('/bot/' + bot.id + '/privacy', {
        privacy: 'public'
      },
        {
          headers: {
            Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4'
          }
        }
      )
      .then(function (response) {
        resolve(response.data.extra)
      })
      .catch(function (error) {
        reject(error)
      })
    })
  },
  getBots (cb) {
    axios.get('/bot', { headers: { Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4' } })
          .then(function (response) {
            cb(response.data.extra)
          })
          .catch(function (error) {
            console.log(error)
          })
  },
  addNewBot (bot) {
    return new Promise((resolve, reject) => {
      axios.post('/bot', {
        'name': bot.name,
        'description': bot.description,
        'intents': [],
        'test': 'true',
        'botType': bot.botType,
        'privacy': 'private',
        'config': bot.config || null
      },
        {
          headers: {
            Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4'
          }
        })
      .then(function (response) {
        resolve(response.data.extra)
        console.log('here')
      })
      .catch(function (error) {
        console.log(error)
        reject(error)
      })
    })
  },
  changeBotState (bot, start, stop) {
    if (bot.status === 'running') {
      axios.put('/bot/' + bot.id + '/stop', {
        'status': 'stopped'
      },
        {
          headers: {
            Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4'
          }
        })
      .then(function (response) {
        stop(bot)
      })
      .catch(function (error) {
        console.log(error)
      })
    } else {
      axios.put('/bot/' + bot.id + '/start', {
        'status': 'running'
      },
        {
          headers: {
            Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4'
          }
        })
      .then(function (response) {
        start(bot)
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  },
  deleteBot (cb, bot) {
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
  },
  renameBot (cb, bot) {
    bot[0].name = bot[1].name
    axios.put('/bot/' + bot[0].id, bot[0], { headers: { Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4' } })
          .then(function (response) {
            cb(bot)
          })
          .catch(function (error) {
            console.log(error)
          })
  },
  getBot (id) {
    return new Promise((resolve, reject) => {
      axios.get('/bot/' + id, { headers: { Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4' } })
        .then((res) => {
          resolve(res.data.extra)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
