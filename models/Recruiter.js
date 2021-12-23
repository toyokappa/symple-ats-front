import { Model } from '@vuex-orm/core'

export default class Recruiter extends Model {
  static entity = 'recruiters'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      nickname: this.string(''),
      email: this.string(''),
      role: this.string(''),
      level: this.number(null),
    }
  }

  get roleJa() {
    return roleList.find((locale) => locale.en === this.role).ja
  }
}

export const roleList = [
  { en: 'admin', ja: '管理者' },
  { en: 'interviewer', ja: '面接官' },
  { en: 'viewer', ja: '閲覧者' },
]

export const levelList = [1, 2, 3]
