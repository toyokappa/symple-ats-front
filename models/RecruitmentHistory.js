import { Model } from '@vuex-orm/core'
import RecruitmentEvaluation from './RecruitmentEvaluation'
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
      recruitmentEvaluations: this.hasMany(
        RecruitmentEvaluation,
        'recruitmentHistoryId'
      ),
      recruitmentSelection: this.belongsTo(
        RecruitmentSelection,
        'recruitmentSelectionId'
      ),
      selectedAtEditing: this.boolean(false),
      resultEditing: this.boolean(false),
    }
  }

  get selectedAtToDate() {
    return this.selectedAt ? new Date(this.selectedAt) : null
  }
}

export const resultList = [
  { en: 'pass', ja: '合格' },
  { en: 'failure', ja: '不合格' },
]
