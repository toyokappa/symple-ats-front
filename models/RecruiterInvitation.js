import { Model } from '@vuex-orm/core'

export default class RecruiterInvitation extends Model {
  static entity = 'recruiterInvitations'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      email: this.string(''),
      role: this.string(''),
    }
  }

  get nickname() {
    return '招待中...'
  }

  get roleJa() {
    return roleList.find((locale) => locale.en === this.role).ja
  }

  get level() {
    return '-'
  }
}

export const roleList = [
  { en: 'admin', ja: '管理者' },
  { en: 'interviewer', ja: '面接官' },
  { en: 'viewer', ja: '閲覧者' },
]

export const levelList = [1, 2, 3]
