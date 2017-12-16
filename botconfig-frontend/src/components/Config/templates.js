export default {
  faq: {
    blocks: [
      {
        answer: 'Yes!',
        id: 0,
        isFavorite: false,
        questions: [
          'Is ROQY the best tool for bot creation?'
        ],
        title: 'Example Question'
      }
    ],
    groups: [
      {
        block: 0,
        children: [],
        selection: -1
      }
    ],
    rootSelect: 0,
    rowSelect: 0
  },
  welcome: {
    blocks: [
      {
        answer: 'Welcome to ROQY.',
        id: 0,
        isFavorite: false,
        questions: [],
        title: 'Welcome Message'
      },
      {
        answer: 'Ok what can I do for you?',
        id: 1,
        isFavorite: false,
        questions: [
          'I have a problem',
          'I need help'
        ],
        title: 'User has a problem'
      }
    ],
    groups: [
      {
        block: 0,
        children: [],
        selection: -1
      },
      {
        block: 1,
        children: [],
        selection: -1
      }
    ],
    rootSelect: 1,
    rowSelect: 0
  }
}
