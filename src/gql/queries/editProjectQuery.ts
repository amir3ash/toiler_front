import { gql } from "../gql";

export const getProjectQuery = gql(/* GraphQL */`
query getProjectForEdit($id: Int!){
    project(id: $id) {
        id
        name
        plannedStartDate
        plannedEndDate
        actualStartDate
        actualEndDate
        description
        roles {
            id
            name
        }
        teams {
            id
            name
        }
    }
    teammembers: projectTeamMembers(project: $id) {
        id
        role {
            id
            name
        }
        team {
            id
            name
        }
        user {
            id
            firstName
            lastName
            username
            avatar
        }
    }
}
`)