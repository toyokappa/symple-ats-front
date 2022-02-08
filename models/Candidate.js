import { Model } from '@vuex-orm/core'
import Channel from './Channel'
import Position from './Position'
import Recruiter from './Recruiter'
import RecruitmentHistory from './RecruitmentHistory'

export default class Candidate extends Model {
  static entity = 'candidates'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(null),
      name: this.string(''),
      listPosition: this.number(null),
      recruitmentSelectionId: this.number(null),
      recruiterId: this.attr(null),
      channelId: this.attr(null),
      positionId: this.attr(null),
      resumeFiles: this.attr([]),
      recruiter: this.belongsTo(Recruiter, 'recruiterId'),
      channel: this.belongsTo(Channel, 'channelId'),
      position: this.belongsTo(Position, 'positionId'),
      recruitmentHistories: this.hasMany(RecruitmentHistory, 'candidateId'),
    }
  }
}
