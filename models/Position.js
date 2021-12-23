import { Model } from '@vuex-orm/core'

export default class Position extends Model {
  static entity = 'positions'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      internalName: this.string(''),
      externalName: this.string(''),
      status: this.string(''),
    }
  }
}
