import { gql } from '../gql';


export const getProjectQuery = gql(/* GraphQL */`
query GetProject($id: Int!) {
  project(id: $id) {
    id
    name
    plannedStartDate
    plannedEndDate
    actualStartDate
    actualEndDate
    description
    projectManagerId
    states {
      id
      name
    }
    tasks {
      id
      name
      plannedStartDate
      plannedEndDate
      actualStartDate
      actualEndDate
      plannedBudget
      actualBudget
      description
      activities {
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
            firstName
            lastName
            avatar
          }
        }
      }
    }
  }
}
`
)

