import { Model } from '@vuex-orm/core'

export default class RecruitmentHistory extends Model {
  static entity = 'recruitmentHistories'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      selectedAt: this.attr(null),
      result: this.string(''),
      recruitmentSelectionId: this.number(null),
      candidateId: this.number(null),
    }
  }
}
