import config from '@/components/BotConfig'
import sinon from 'sinon'
import { shallow } from 'vue-test-utils'

describe('Block manipulation', () => {
  let cmp

  beforeEach(() => {
    sinon.stub(config.computed, 'defaultTitle').value(() => 'new')
    cmp = shallow(config)
  })

  it('Blocks start empty', () => {
    expect(cmp.vm.blocks.length)
      .to.equal(0)
  })

  it('Add a new block', () => {
    cmp.vm.addNewBlock(0)
    expect(cmp.vm.blocks.length)
      .to.equal(1)
  })

  it('get a block that was just created', () => {
    let id = cmp.vm.addNewBlock(0)
    let block = cmp.vm.getBlock(id)
    expect(block)
      .to.be.an('object')
    expect(block.id)
      .to.equal(0)
    expect(block.title)
      .to.equal('new')
  })

  it('can change a block from get', () => {
    let id = cmp.vm.addNewBlock(0)
    let block = cmp.vm.getBlock(id)
    expect(block.title)
      .to.equal('new')
    block.title = 'Test'
    expect(cmp.vm.getBlock(id).title)
    .to.equal('Test')
  })
})

describe('Favorites', () => {
  let cmp

  beforeEach(() => {
    sinon.stub(config.computed, 'defaultTitle').value(() => 'new')
    cmp = shallow(config)
  })

  it('Favorites start empty', () => {
    expect(cmp.vm.favorites.length)
      .to.equal(0)
  })

  it('Add a new block without favoriting it', () => {
    cmp.vm.addNewBlock(0)
    expect(cmp.vm.favorites.length)
      .to.equal(0)
  })

  it('Add a new block and favorite it', () => {
    let id = cmp.vm.addNewBlock(0)
    let block = cmp.vm.getBlock(id)
    expect(block)
      .to.have.property('isFavorite', false)
    expect(cmp.vm.favorites.length)
      .to.equal(0)
    cmp.vm.favoriteBlock(id)
    expect(cmp.vm.favorites.length)
      .to.equal(1)
    expect(cmp.vm.favorites[0])
      .to.equal(block)
  })
})
