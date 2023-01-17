import type { BaseTranslation } from '../i18n-types'

const en: BaseTranslation = {
	// TODO: your translations go here
	SETTINGS: 'Settings',
	LOGOUT: 'Logout',

	EDIT: 'Edit',
	DELETE: 'Delete',
	TITLE: 'Title',
	PLAN: 'Plan',
	PLANNED: 'Planned',
	TO: 'to',
	DESCRIPTION: 'Description',
	ACTUAL: 'Actual',
	SAVE: 'Save',
	ADD: 'Add',
	ERROR: 'Error',
	DELETED: 'Deleted',
	UPDATED: 'Updated',
	CLOSE: 'Close',

	settings:{
		MyAccount: 'My Account',
		SETTINGS: 'Settings',
		YOUR_AVATAR: 'Your Avatar',
		UPLOAD: 'Upload',
		USER_INFORMATION: 'User Information',
		USERNAME: 'Username',
		EMAIL_ADDRESS: 'Email address',
		EMAIL_PLACEHOLDER: 'Email',
		FIRSTNAME: 'First Name',
		FIRSTNAME_PLACEHOLDER: 'First name',
		LASTNAME: 'Last Name',
		LASTNAME_PLACEHOLDER: 'Last name',
		UPDATE: 'Update',
		SECURITY: 'Security',
		CURRENT_PASSWORD: 'Current Password',
		NEW_PASSWORD: 'New Password',
		CONFIRM_PASSWORD: 'Confirm Password',
		CHANGE: 'Change',
		PROJECTS_IN_SETTINGS: 'Projects you work on',
		TEAMMATES_IN_SETTINGS: 'Teammates you work with',
	},

	project:{
		ADD_PROJECT: 'Add New Project',
		DATE: '{d:string | dateFormatter}',
		STARTED: 'Started',
		NOT_STARTED: 'Not Started yet',
		FINISHED: 'Finished',
		NOT_FINISHED: 'Not finished yet',
		
	},

	editProject: {
		ERR_EMPTY_ERR: 'Start date can not be empty',
		PROJECT_UPDATED: 'Project updated',
		ERR_ADDING_ROLE: 'Error in adding role',
		ERR_ADDING_TEAM: 'Error in adding team',
		ERR_GETTING_PROJECT: 'Error while getting the project',
		START_DATE: 'Start date',
		ACTUAL_START_DATE: 'Actual Start date',
		END_DATE: 'End date',
		ACTUAL_END_DATE: 'Actual end date',
		PLANNED_START_DATE: 'Planned Start date',
		PLANNED_END_DATE: 'Planned end date',
		TEAMS: 'Teams',
		ROLES: 'Roles',
		NEW_TEAM: 'New team',
		NEW_ROLE: 'New role',
		EDIT_NAME: 'Edit name',
	},

	addTeamMembers: {
		TEAM_MEMBER_ADDED: 'Team member added',
		TEAM_MEMBERS: 'Team Members',
		TEAM_TEAMMEMBERS: '"{name:string}" Team Members',
		TEAM: 'Team',
		ROLE: 'Role',
		TEAM_NAME: 'Team name',
		ROLE_NAME: 'Role name',
		EMPLOYEE: 'Employee',
		EMPLOYEE_USERNAME: "Employee's username",
			
	},

	ganttView: {
		TASKS: 'Tasks',
		GANTT: 'Gantt',
		KANBAN: 'Kanban',
		EMPLOYEES: 'Employees',
		FETCHING: 'fetching',
	},

	taskView: {
		CREATED: 'Created',
		CREATE_OBJ: 'Create {type:string}',
		EDIT_OBJ: 'Edit {type: string}',
		UPDATED: 'Updated',
		TASK_DELETED: 'Task deleted',
		ADD_NEW_ACTIVITY: 'Add New Activity',
		ADD_NEW_TASK: 'Add New Task',
		DELETE_TASK: 'Delete task',
		TASK: 'Task',
		ACTIVITY: 'Activity',
	},

	kanban: {
		DELETE_STATE: 'Delete state "{name: string}"',
		STATE_NAME: 'State name',
	},

	sidebar: {
		ENTER_TO_EDIT: 'Enter to edit name',
		STATE: 'State',
		ACTUAL_START_DATE: 'Actual Start date',
		ACTUAL_END_DATE: 'Actual end date',
		PLANNED_START_DATE: 'Planned Start Date',
		PLANNED_END_DATE: 'Planned End Date',
		START_DATE: 'Start Date',
		END_DATE: 'End Date',
		PLANNED_BUDGET: 'Planned Budget',
		BUDGET: 'Budget',
		ASSIGNEE: 'Assignee',
		EMPLOYEE_NAME: 'Employee name',
		NOT_ASSIGNED: 'Not assigned',
		COMMENTS: 'Comments',
		WRITE_YOUR_MESSAGE: 'Write your message!',
		SEND: 'Send',
	},

	assignedToMe: {
		DATE: '{d|shortDate}'
	},

	navigationSidebar: {
		SIDEBAR: 'Sidebar',
		PROJECTS: 'Projects',
		ASSIGNED: 'Assigned',
		LOG_OUT: 'Log out',
	},

	mainTopbar: {
		SEARCH_HERE: 'Search here...',
	},

}

export default en
