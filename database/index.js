import { Database } from '@vuex-orm/core'
import Candidate from '../models/Candidate'
import Channel from '../models/Channel'
import Position from '../models/Position'
import Recruiter from '../models/Recruiter'
import RecruiterInvitation from '../models/RecruiterInvitation'
import RecruitmentHistory from '../models/RecruitmentHistory'
import RecruitmentProject from '../models/RecruitmentProject'
import RecruitmentSelection from '../models/RecruitmentSelection'

const database = new Database()

database.register(RecruitmentProject)
database.register(RecruitmentSelection)
database.register(Candidate)
database.register(Recruiter)
database.register(RecruiterInvitation)
database.register(Channel)
database.register(Position)
database.register(RecruitmentHistory)

export default database
