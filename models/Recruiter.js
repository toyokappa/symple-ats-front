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

// Validations

export const nameRules = [(v) => !!v || '名前は入力が必須です']

const EMAIL_REGEXP =
  /^[a-zA-Z0-9.!\#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
export const emailRules = [
  (v) => !!v || 'メールアドレスは入力が必須です',
  (v) => EMAIL_REGEXP.test(v) || '正しいメールアドレスを入力してください',
]

export const roleRules = [(v) => !!v || '権限は入力が必須です']
