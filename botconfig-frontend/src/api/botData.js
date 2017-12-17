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
            Authorization: '23625217'
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
    axios.get('/bot', { headers: { Authorization: '23625217' } })
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
            Authorization: '23625217'
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
            Authorization: '23625217'
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
            Authorization: '23625217'
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
  },
  renameBot (cb, bot) {
    bot[0].name = bot[1].name
    axios.put('/bot/' + bot[0].id, bot[0], { headers: { Authorization: '23625217' } })
          .then(function (response) {
            cb(bot)
          })
          .catch(function (error) {
            console.log(error)
          })
  },
  getBot (id) {
    return new Promise((resolve, reject) => {
      axios.get('/bot/' + id, { headers: { Authorization: '23625217' } })
        .then((res) => {
          resolve(res.data.extra)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
