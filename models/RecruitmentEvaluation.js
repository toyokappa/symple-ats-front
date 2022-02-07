import { Model } from '@vuex-orm/core'
import Recruiter from './Recruiter'

export default class RecruitmentEvaluation extends Model {
  static entity = 'recruitmentEvaluations'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      result: this.attr(null),
      inputAt: this.attr(null),
      description: this.attr(null),
      recruitmentHistoryId: this.number(null),
      recruiterId: this.number(null),
      recruiterIdEditing: this.boolean(false),
      resultEditing: this.boolean(false),
      inputAtEditing: this.boolean(false),
      recruiter: this.belongsTo(Recruiter, 'recruiterId'),
    }
  }

  get inputAtToDate() {
    return this.inputAt ? new Date(this.inputAt) : null
  }
}

export const resultList = [
  { en: 'pass', ja: '合格' },
  { en: 'failure', ja: '不合格' },
]
