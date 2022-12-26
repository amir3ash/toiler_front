import { gql } from '../gql';

export const commentsQuery = gql(/* GraphQL */`
  query getComments($id: Int!) {
    activityComments(activityPk: $id) {
      id
      createdAt
      text
      author {
        id
        username
        avatar
      }
    }
  }
`)