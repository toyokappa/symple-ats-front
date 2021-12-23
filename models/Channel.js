import { Model } from '@vuex-orm/core'

export default class Channel extends Model {
  static entity = 'channels'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      name: this.string(''),
      category: this.string(''),
      automation: this.string(''),
      applyToken: this.string(''),
    }
  }
}
