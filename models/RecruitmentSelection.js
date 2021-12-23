import { Model } from '@vuex-orm/core'
import Candidate from './Candidate'

export default class RecruitmentSelection extends Model {
  static entity = 'recruitmentSelections'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      name: this.string(''),
      selectionType: this.string(''),
      position: this.number(null),
      recruitmentProjectId: this.number(null),
      candidates: this.hasMany(Candidate, 'recruitmentSelectionId'),
    }
  }
}
