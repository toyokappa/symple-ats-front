import { Model } from '@vuex-orm/core'
import RecruitmentSelection from './RecruitmentSelection'

export default class RecruitmentHistory extends Model {
  static entity = 'recruitmentHistories'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      selectedAt: this.attr(null),
      result: this.attr(null),
      recruitmentSelectionId: this.number(null),
      candidateId: this.number(null),
      recruitmentSelection: this.belongsTo(
        RecruitmentSelection,
        'recruitmentSelectionId'
      ),
      editing: this.boolean(false),
    }
  }
}

export const resultList = [
  { en: 'pass', ja: '合格' },
  { en: 'failure', ja: '不合格' },
]
