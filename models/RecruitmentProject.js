import { Model } from '@vuex-orm/core'
import RecruitmentSelection from './RecruitmentSelection'

export default class RecruitmentProject extends Model {
  static entity = 'recruitmentProjects'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      name: this.string(''),
      recruitmentSelections: this.hasMany(
        RecruitmentSelection,
        'recruitmentProjectId'
      ),
    }
  }
}
