import { gql } from '../gql';

export const assignedToMeQuery = gql(/* GraphQL */`
query AssignedToMe {
  assignedToMe {
    activity{
      id
      name
      plannedStartDate
      plannedEndDate
      actualStartDate
      actualEndDate
      plannedBudget
      actualBudget
      description
      taskId
      dependencyId
      state {
        id
        name
      }
      assignees {
        id
        activityId
        user {
          id
          username
          avatar
        }
      }
      task {
        project {
          id
          name
        }
      }
    }
  }
}
`)