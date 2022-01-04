import { Model } from '@vuex-orm/core'

export default class Recruiter extends Model {
  static entity = 'recruiters'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      name: this.string(''),
      nickname: this.string(''),
      email: this.string(''),
      role: this.string(''),
      googleAuthenticated: this.boolean(false),
    }
  }

  get roleJa() {
    return roleList.find((locale) => locale.en === this.role).ja
  }

  get googleAuthenticatedText() {
    return this.googleAuthenticated ? '連携済み' : '未連携'
  }
}

export const roleList = [
  { en: 'admin', ja: '管理者' },
  { en: 'interviewer', ja: '面接官' },
  { en: 'viewer', ja: '閲覧者' },
]

// Validations

const EMAIL_REGEXP =
  /^[a-zA-Z0-9.!\#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
export const emailRules = [
  (v) => !!v || 'メールアドレスは入力が必須です',
  (v) => EMAIL_REGEXP.test(v) || '正しいメールアドレスを入力してください',
]

export const roleRules = [(v) => !!v || '権限は入力が必須です']

export const lastNameRules = [(v) => !!v || '名前（姓）は入力が必須です']
export const firstNameRules = [(v) => !!v || '名前（名）は入力が必須です']
export const nicknameRules = [(v) => !!v || '表示名は入力が必須です']
export const passwordRules = [(v) => !!v || 'パスワードは入力が必須です']
export const concentRules = [(v) => !!v || '利用規約への同意が必須です']
