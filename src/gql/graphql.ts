/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type GanttActivity = {
  __typename?: 'GanttActivity';
  actualBudget?: Maybe<Scalars['String']>;
  actualEndDate?: Maybe<Scalars['DateTime']>;
  actualStartDate?: Maybe<Scalars['DateTime']>;
  assignees: Array<GanttAssigned>;
  dependencyId?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  plannedBudget?: Maybe<Scalars['String']>;
  plannedEndDate: Scalars['DateTime'];
  plannedStartDate: Scalars['DateTime'];
  state?: Maybe<GanttState>;
  stateId?: Maybe<Scalars['Int']>;
  task: GanttTask;
  taskId: Scalars['Int'];
};

export type GanttAssigned = {
  __typename?: 'GanttAssigned';
  activity: GanttActivity;
  activityId: Scalars['Int'];
  id?: Maybe<Scalars['Int']>;
  user: UserUser;
};

export type GanttComment = {
  __typename?: 'GanttComment';
  activityId?: Maybe<Scalars['Int']>;
  author: UserUser;
  authorId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['Int']>;
  text?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type GanttProject = {
  __typename?: 'GanttProject';
  actualEndDate?: Maybe<Scalars['DateTime']>;
  actualStartDate?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  plannedEndDate: Scalars['DateTime'];
  plannedStartDate: Scalars['DateTime'];
  projectManager: UserUser;
  projectManagerId?: Maybe<Scalars['Int']>;
  roles: Array<GanttRole>;
  states: Array<GanttState>;
  tasks: Array<GanttTask>;
  teams: Array<GanttTeam>;
};

export type GanttRole = {
  __typename?: 'GanttRole';
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  projectId: Scalars['Int'];
};

export type GanttState = {
  __typename?: 'GanttState';
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  projectId: Scalars['Int'];
};

export type GanttTask = {
  __typename?: 'GanttTask';
  activities: Array<GanttActivity>;
  actualBudget?: Maybe<Scalars['String']>;
  actualEndDate?: Maybe<Scalars['DateTime']>;
  actualStartDate?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  plannedBudget?: Maybe<Scalars['String']>;
  plannedEndDate: Scalars['DateTime'];
  plannedStartDate: Scalars['DateTime'];
  project: GanttProject;
  projectId: Scalars['Int'];
};

export type GanttTeam = {
  __typename?: 'GanttTeam';
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  project: GanttProject;
  projectId: Scalars['Int'];
};

export type GanttTeammember = {
  __typename?: 'GanttTeammember';
  id?: Maybe<Scalars['Int']>;
  role: GanttRole;
  roleId: Scalars['Int'];
  team: GanttTeam;
  teamId: Scalars['Int'];
  user: UserUser;
  userId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  activity?: Maybe<GanttActivity>;
  activityComments: Array<GanttComment>;
  assigned?: Maybe<GanttAssigned>;
  assignedToMe: Array<GanttAssigned>;
  me?: Maybe<UserUser>;
  project?: Maybe<GanttProject>;
  projectActivities: Array<GanttActivity>;
  projectAssigned: Array<GanttAssigned>;
  projectEmployees: Array<UserUser>;
  projectRoles: Array<GanttRole>;
  projectStates: Array<GanttState>;
  projectTasks: Array<GanttTask>;
  projectTeamMembers: Array<GanttTeammember>;
  projectTeams: Array<GanttTeam>;
  projects: Array<GanttProject>;
  role?: Maybe<GanttRole>;
  state?: Maybe<GanttState>;
  task?: Maybe<GanttTask>;
  team?: Maybe<GanttTeam>;
  userSearchUsers: Array<UserUser>;
};


export type QueryActivityArgs = {
  id: Scalars['Int'];
};


export type QueryActivityCommentsArgs = {
  activityPk: Scalars['Int'];
};


export type QueryAssignedArgs = {
  id: Scalars['Int'];
};


export type QueryProjectArgs = {
  id: Scalars['Int'];
};


export type QueryProjectActivitiesArgs = {
  projPk: Scalars['Int'];
};


export type QueryProjectAssignedArgs = {
  projPk: Scalars['Int'];
};


export type QueryProjectEmployeesArgs = {
  projPk: Scalars['Int'];
};


export type QueryProjectRolesArgs = {
  project: Scalars['Int'];
};


export type QueryProjectStatesArgs = {
  projPk: Scalars['Int'];
};


export type QueryProjectTasksArgs = {
  projPk: Scalars['Int'];
};


export type QueryProjectTeamMembersArgs = {
  project: Scalars['Int'];
};


export type QueryProjectTeamsArgs = {
  project: Scalars['Int'];
};


export type QueryRoleArgs = {
  id: Scalars['Int'];
};


export type QueryStateArgs = {
  id: Scalars['Int'];
};


export type QueryTaskArgs = {
  id: Scalars['Int'];
};


export type QueryTeamArgs = {
  id: Scalars['Int'];
};


export type QueryUserSearchUsersArgs = {
  search?: InputMaybe<Scalars['String']>;
};

export type UserUser = {
  __typename?: 'UserUser';
  avatar?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type AssignedToMeQueryVariables = Exact<{ [key: string]: never; }>;


export type AssignedToMeQuery = { __typename?: 'Query', assignedToMe: Array<{ __typename?: 'GanttAssigned', activity: { __typename?: 'GanttActivity', id?: number | null, name: string, plannedStartDate: any, plannedEndDate: any, actualStartDate?: any | null, actualEndDate?: any | null, plannedBudget?: string | null, actualBudget?: string | null, description?: string | null, taskId: number, dependencyId?: number | null, state?: { __typename?: 'GanttState', id?: number | null, name: string } | null, assignees: Array<{ __typename?: 'GanttAssigned', id?: number | null, activityId: number, user: { __typename?: 'UserUser', id?: number | null, username?: string | null, avatar?: string | null } }>, task: { __typename?: 'GanttTask', project: { __typename?: 'GanttProject', id?: number | null, name: string } } } }> };

export type GetCommentsQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetCommentsQuery = { __typename?: 'Query', activityComments: Array<{ __typename?: 'GanttComment', id?: number | null, createdAt?: any | null, text?: string | null, author: { __typename?: 'UserUser', id?: number | null, username?: string | null, avatar?: string | null } }> };

export type GetProjectForEditQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetProjectForEditQuery = { __typename?: 'Query', project?: { __typename?: 'GanttProject', id?: number | null, name: string, plannedStartDate: any, plannedEndDate: any, actualStartDate?: any | null, actualEndDate?: any | null, description?: string | null, roles: Array<{ __typename?: 'GanttRole', id?: number | null, name: string }>, teams: Array<{ __typename?: 'GanttTeam', id?: number | null, name: string }> } | null, teammembers: Array<{ __typename?: 'GanttTeammember', id?: number | null, role: { __typename?: 'GanttRole', id?: number | null, name: string }, team: { __typename?: 'GanttTeam', id?: number | null, name: string }, user: { __typename?: 'UserUser', id?: number | null, firstName?: string | null, lastName?: string | null, username?: string | null, avatar?: string | null } }> };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'GanttProject', id?: number | null, name: string, plannedStartDate: any, plannedEndDate: any, actualStartDate?: any | null, actualEndDate?: any | null, description?: string | null, projectManagerId?: number | null, states: Array<{ __typename?: 'GanttState', id?: number | null, name: string }>, tasks: Array<{ __typename?: 'GanttTask', id?: number | null, name: string, plannedStartDate: any, plannedEndDate: any, actualStartDate?: any | null, actualEndDate?: any | null, plannedBudget?: string | null, actualBudget?: string | null, description?: string | null, activities: Array<{ __typename?: 'GanttActivity', id?: number | null, name: string, plannedStartDate: any, plannedEndDate: any, actualStartDate?: any | null, actualEndDate?: any | null, plannedBudget?: string | null, actualBudget?: string | null, description?: string | null, taskId: number, dependencyId?: number | null, state?: { __typename?: 'GanttState', id?: number | null, name: string } | null, assignees: Array<{ __typename?: 'GanttAssigned', id?: number | null, activityId: number, user: { __typename?: 'UserUser', id?: number | null, username?: string | null, firstName?: string | null, lastName?: string | null, avatar?: string | null } }> }> }> } | null };


export const AssignedToMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AssignedToMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignedToMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"plannedStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"plannedEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"actualStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"actualEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"plannedBudget"}},{"kind":"Field","name":{"kind":"Name","value":"actualBudget"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"dependencyId"}},{"kind":"Field","name":{"kind":"Name","value":"state"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AssignedToMeQuery, AssignedToMeQueryVariables>;
export const GetCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"activityPk"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<GetCommentsQuery, GetCommentsQueryVariables>;
export const GetProjectForEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getProjectForEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"plannedStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"plannedEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"actualStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"actualEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"teammembers"},"name":{"kind":"Name","value":"projectTeamMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"project"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectForEditQuery, GetProjectForEditQueryVariables>;
export const GetProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"plannedStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"plannedEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"actualStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"actualEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"projectManagerId"}},{"kind":"Field","name":{"kind":"Name","value":"states"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"plannedStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"plannedEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"actualStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"actualEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"plannedBudget"}},{"kind":"Field","name":{"kind":"Name","value":"actualBudget"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"plannedStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"plannedEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"actualStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"actualEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"plannedBudget"}},{"kind":"Field","name":{"kind":"Name","value":"actualBudget"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"dependencyId"}},{"kind":"Field","name":{"kind":"Name","value":"state"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectQuery, GetProjectQueryVariables>;

export type ObjectFieldTypes = {
    [key: string]: { [key: string]: string | string[] }
};

export type OpTypes = {
    [key: string]: string | string[]
};

export type ScalarLocations = {
 scalars: string[],
 inputObjectFieldTypes: ObjectFieldTypes;
 outputObjectFieldTypes: ObjectFieldTypes;
 operationMap: OpTypes;
};

export const scalarLocations : ScalarLocations = {
  "inputObjectFieldTypes": {},
  "outputObjectFieldTypes": {
    "GanttActivity": {
      "actualEndDate": "DateTime",
      "actualStartDate": "DateTime",
      "assignees": "GanttAssigned",
      "plannedEndDate": "DateTime",
      "plannedStartDate": "DateTime",
      "state": "GanttState",
      "task": "GanttTask"
    },
    "GanttAssigned": {
      "activity": "GanttActivity",
      "user": "UserUser"
    },
    "GanttComment": {
      "author": "UserUser",
      "createdAt": "DateTime",
      "updatedAt": "DateTime"
    },
    "GanttProject": {
      "actualEndDate": "DateTime",
      "actualStartDate": "DateTime",
      "plannedEndDate": "DateTime",
      "plannedStartDate": "DateTime",
      "projectManager": "UserUser",
      "roles": "GanttRole",
      "states": "GanttState",
      "tasks": "GanttTask",
      "teams": "GanttTeam"
    },
    "GanttTask": {
      "activities": "GanttActivity",
      "actualEndDate": "DateTime",
      "actualStartDate": "DateTime",
      "plannedEndDate": "DateTime",
      "plannedStartDate": "DateTime",
      "project": "GanttProject"
    },
    "GanttTeam": {
      "project": "GanttProject"
    },
    "GanttTeammember": {
      "role": "GanttRole",
      "team": "GanttTeam",
      "user": "UserUser"
    },
    "Query": {
      "activity": "GanttActivity",
      "activityComments": "GanttComment",
      "assigned": "GanttAssigned",
      "assignedToMe": "GanttAssigned",
      "me": "UserUser",
      "project": "GanttProject",
      "projectActivities": "GanttActivity",
      "projectAssigned": "GanttAssigned",
      "projectEmployees": "UserUser",
      "projectRoles": "GanttRole",
      "projectStates": "GanttState",
      "projectTasks": "GanttTask",
      "projectTeamMembers": "GanttTeammember",
      "projectTeams": "GanttTeam",
      "projects": "GanttProject",
      "role": "GanttRole",
      "state": "GanttState",
      "task": "GanttTask",
      "team": "GanttTeam",
      "userSearchUsers": "UserUser"
    }
  },
  "operationMap": {},
  "scalars": [
    "DateTime"
  ]
};
