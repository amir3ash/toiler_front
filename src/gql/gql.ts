/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\nquery AssignedToMe {\n  assignedToMe {\n    activity{\n      id\n      name\n      plannedStartDate\n      plannedEndDate\n      actualStartDate\n      actualEndDate\n      plannedBudget\n      actualBudget\n      description\n      taskId\n      dependencyId\n      state {\n        id\n        name\n      }\n      assignees {\n        id\n        activityId\n        user {\n          id\n          username\n          avatar\n        }\n      }\n      task {\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n": types.AssignedToMeDocument,
    "\n  query getComments($id: Int!) {\n    activityComments(activityPk: $id) {\n      id\n      createdAt\n      text\n      author {\n        id\n        username\n        avatar\n      }\n    }\n  }\n": types.GetCommentsDocument,
    "\nquery getProjectForEdit($id: Int!){\n    project(id: $id) {\n        id\n        name\n        plannedStartDate\n        plannedEndDate\n        actualStartDate\n        actualEndDate\n        description\n        roles {\n            id\n            name\n        }\n        teams {\n            id\n            name\n        }\n    }\n    teammembers: projectTeamMembers(project: $id) {\n        id\n        role {\n            id\n            name\n        }\n        team {\n            id\n            name\n        }\n        user {\n            id\n            firstName\n            lastName\n            username\n            avatar\n        }\n    }\n}\n": types.GetProjectForEditDocument,
    "\nquery GetProject($id: Int!) {\n  project(id: $id) {\n    id\n    name\n    plannedStartDate\n    plannedEndDate\n    actualStartDate\n    actualEndDate\n    description\n    projectManagerId\n    states {\n      id\n      name\n    }\n    tasks {\n      id\n      name\n      plannedStartDate\n      plannedEndDate\n      actualStartDate\n      actualEndDate\n      plannedBudget\n      actualBudget\n      description\n      activities {\n        id\n        name\n        plannedStartDate\n        plannedEndDate\n        actualStartDate\n        actualEndDate\n        plannedBudget\n        actualBudget\n        description\n        taskId\n        dependencyId\n        state {\n          id\n          name\n        }\n        assignees {\n          id\n          activityId\n          user {\n            id\n            username\n            firstName\n            lastName\n            avatar\n          }\n        }\n      }\n    }\n  }\n}\n": types.GetProjectDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery AssignedToMe {\n  assignedToMe {\n    activity{\n      id\n      name\n      plannedStartDate\n      plannedEndDate\n      actualStartDate\n      actualEndDate\n      plannedBudget\n      actualBudget\n      description\n      taskId\n      dependencyId\n      state {\n        id\n        name\n      }\n      assignees {\n        id\n        activityId\n        user {\n          id\n          username\n          avatar\n        }\n      }\n      task {\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery AssignedToMe {\n  assignedToMe {\n    activity{\n      id\n      name\n      plannedStartDate\n      plannedEndDate\n      actualStartDate\n      actualEndDate\n      plannedBudget\n      actualBudget\n      description\n      taskId\n      dependencyId\n      state {\n        id\n        name\n      }\n      assignees {\n        id\n        activityId\n        user {\n          id\n          username\n          avatar\n        }\n      }\n      task {\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getComments($id: Int!) {\n    activityComments(activityPk: $id) {\n      id\n      createdAt\n      text\n      author {\n        id\n        username\n        avatar\n      }\n    }\n  }\n"): (typeof documents)["\n  query getComments($id: Int!) {\n    activityComments(activityPk: $id) {\n      id\n      createdAt\n      text\n      author {\n        id\n        username\n        avatar\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery getProjectForEdit($id: Int!){\n    project(id: $id) {\n        id\n        name\n        plannedStartDate\n        plannedEndDate\n        actualStartDate\n        actualEndDate\n        description\n        roles {\n            id\n            name\n        }\n        teams {\n            id\n            name\n        }\n    }\n    teammembers: projectTeamMembers(project: $id) {\n        id\n        role {\n            id\n            name\n        }\n        team {\n            id\n            name\n        }\n        user {\n            id\n            firstName\n            lastName\n            username\n            avatar\n        }\n    }\n}\n"): (typeof documents)["\nquery getProjectForEdit($id: Int!){\n    project(id: $id) {\n        id\n        name\n        plannedStartDate\n        plannedEndDate\n        actualStartDate\n        actualEndDate\n        description\n        roles {\n            id\n            name\n        }\n        teams {\n            id\n            name\n        }\n    }\n    teammembers: projectTeamMembers(project: $id) {\n        id\n        role {\n            id\n            name\n        }\n        team {\n            id\n            name\n        }\n        user {\n            id\n            firstName\n            lastName\n            username\n            avatar\n        }\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetProject($id: Int!) {\n  project(id: $id) {\n    id\n    name\n    plannedStartDate\n    plannedEndDate\n    actualStartDate\n    actualEndDate\n    description\n    projectManagerId\n    states {\n      id\n      name\n    }\n    tasks {\n      id\n      name\n      plannedStartDate\n      plannedEndDate\n      actualStartDate\n      actualEndDate\n      plannedBudget\n      actualBudget\n      description\n      activities {\n        id\n        name\n        plannedStartDate\n        plannedEndDate\n        actualStartDate\n        actualEndDate\n        plannedBudget\n        actualBudget\n        description\n        taskId\n        dependencyId\n        state {\n          id\n          name\n        }\n        assignees {\n          id\n          activityId\n          user {\n            id\n            username\n            firstName\n            lastName\n            avatar\n          }\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetProject($id: Int!) {\n  project(id: $id) {\n    id\n    name\n    plannedStartDate\n    plannedEndDate\n    actualStartDate\n    actualEndDate\n    description\n    projectManagerId\n    states {\n      id\n      name\n    }\n    tasks {\n      id\n      name\n      plannedStartDate\n      plannedEndDate\n      actualStartDate\n      actualEndDate\n      plannedBudget\n      actualBudget\n      description\n      activities {\n        id\n        name\n        plannedStartDate\n        plannedEndDate\n        actualStartDate\n        actualEndDate\n        plannedBudget\n        actualBudget\n        description\n        taskId\n        dependencyId\n        state {\n          id\n          name\n        }\n        assignees {\n          id\n          activityId\n          user {\n            id\n            username\n            firstName\n            lastName\n            avatar\n          }\n        }\n      }\n    }\n  }\n}\n"];

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function gql(source: string): unknown;

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;