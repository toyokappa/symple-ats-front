import { Model } from '@vuex-orm/core'

export default class Position extends Model {
  static entity = 'positions'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.attr(null),
      internalName: this.string(''),
      externalName: this.string(''),
      status: this.string(''),
    }
  }

  get statusJa() {
    return statusList.find((locale) => locale.en === this.status).ja
  }
}

export const statusList = [
  { en: 'open', ja: '公開中' },
  { en: 'close', ja: '非公開' },
]

// Validations

export const internalNameRules = [(v) => !!v || '内部管理名は入力が必須です']

export const externalNameRules = [(v) => !!v || '外部公開名は入力が必須です']
