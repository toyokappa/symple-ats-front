export default [
  {
    id: 1,
    name: 'Wantedly',
    categoryId: 1,
    automation: '未設定',
    applicationPath: '',
    color: 'green',
  },
  {
    id: 2,
    name: 'Green',
    categoryId: 1,
    automation: '設定不可',
    applicationPath: '',
    color: 'green',
  },
  {
    id: 3,
    name: 'JAC',
    categoryId: 2,
    automation: '設定済み',
    applicationPath: '/abcdefg',
    color: 'red',
  },
  {
    id: 4,
    name: 'ワークポート',
    categoryId: 2,
    automation: '設定済み',
    applicationPath: '/hijklmn',
    color: 'red',
  },
]

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
    color: 'yellow',
  },
  {
    en: 'sns',
    ja: 'SNS',
    color: 'blue',
  },
  {
    en: 'referral',
    ja: 'リファーラル',
    color: 'purple',
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
