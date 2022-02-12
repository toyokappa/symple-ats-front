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
      applyToken: this.attr(null),
      organizationUniqueId: this.attr(''),
    }
  }

  get categoryJa() {
    return categoryList.find((locale) => locale.en === this.category).ja
  }

  get categoryColor() {
    return categoryList.find((locale) => locale.en === this.category).color
  }

  get automationJa() {
    return automationList.find((locale) => locale.en === this.automation).ja
  }

  get applyUrl() {
    return this.applyToken
      ? `http://localhost:3000/${this.organizationUniqueId}/applies/${this.applyToken}`
      : '-'
  }
}

export const categoryList = [
  {
    en: 'agent',
    ja: 'エージェント',
    color: 'red',
  },
  {
    en: 'ad',
    ja: '求人媒体',
    color: 'green',
  },
  {
    en: 'scout',
    ja: 'スカウト',
    color: 'amber',
  },
  {
    en: 'sns',
    ja: 'SNS',
    color: 'blue',
  },
  {
    en: 'referral',
    ja: 'リファーラル',
    color: 'deep-purple',
  },
  {
    en: 'other',
    ja: 'その他',
    color: 'gray',
  },
]

export const automationList = [
  { en: 'disable', ja: '未連携' },
  { en: 'enable', ja: '連携済み' },
  { en: 'impossible', ja: '連携不可' },
]

// Validations

export const nameRules = [(v) => !!v || 'チャネル名は入力が必須です']

export const categoryRules = [(v) => !!v || 'チャネル種別は入力が必須です']
