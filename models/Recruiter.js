import { Model } from '@vuex-orm/core'

export default class Recruiter extends Model {
  static entity = 'recruiters'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      nickname: this.string(''),
      role: this.string(''),
      level: this.number(null),
    }
  }
}
