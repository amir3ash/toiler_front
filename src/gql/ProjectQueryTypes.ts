import type { GetProjectQuery } from "./graphql"

export type ProjectType = GetProjectQuery['project']
export type TaskType = ProjectType['tasks'][0]
export type ActivityType = TaskType['activities'][0]
export type State = ProjectType['states'][0]
