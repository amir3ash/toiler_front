import type { Translation } from '../i18n-types'

const fa: Translation = {
	// this is an example Translation, just rename or delete this folder if you want
	SETTINGS: 'تنظیمات',
	LOGOUT: 'خروج',

	EDIT: 'اصلاح',
	DELETE: 'حذف',
	PLAN: 'برنامه',
	TO: 'تا',
	DESCRIPTION: 'توضیح',
	TITLE: 'عنوان',
	ACTUAL: 'حقیقی',
	PLANNED: 'برنامه‌ریزی شده',
	SAVE: 'ذخیره',
	ADD: 'افزودن',
	ERROR: 'خطا',
	DELETED: 'حذف شد',
	UPDATED: 'اصلاح شد',
	CLOSE: 'بستن',

	settings:{
		MyAccount: 'اکانت من',
		SETTINGS: 'تنظیمات',
		YOUR_AVATAR: 'آواتار شما',
		UPLOAD: 'آپلود',
		USER_INFORMATION: 'اطلاعات کاربری',
		USERNAME: 'نام کاربری',
		EMAIL_ADDRESS: 'آدرس ایمیل',
		EMAIL_PLACEHOLDER: 'ایمیل',
		FIRSTNAME: 'نام',
		FIRSTNAME_PLACEHOLDER: 'نام',
		LASTNAME: 'نام خانوادگی',
		LASTNAME_PLACEHOLDER: 'نام خانوادگی',
		UPDATE: 'بروزرسانی',
		SECURITY: 'امنیت',
		CURRENT_PASSWORD: 'گذرواژه',
		NEW_PASSWORD: 'گذرواژه جدید',
		CONFIRM_PASSWORD: 'تایید گذرواژه جدید',
		CHANGE: 'تغییر',
		PROJECTS_IN_SETTINGS: 'پروژه‌هایی که در آن کار می‌کنید',
		TEAMMATES_IN_SETTINGS: 'هم‌تیمی هایی که با آن‌ها کار می‌کنید',
	},

	// Project
	project:{
		ADD_PROJECT: 'ساخت پروژه جدید',
		DATE: '{d|dateFormatter}' as `${string}{d|dateFormatter}${string}`,
		STARTED: 'شروع',
		NOT_STARTED: 'شروع نشده',
		FINISHED: 'پایان',
		NOT_FINISHED: 'پایان نیافته',
	},

	// Edit Project
	editProject: {
		ERR_EMPTY_ERR: 'تاریخ شروع نمیتواند خالی باشد',
		PROJECT_UPDATED: 'پروژه اصلاح شد',
		ERR_ADDING_ROLE: 'خطا در ایجاد نقش',
		ERR_ADDING_TEAM: 'خطا در ایجاد تیم',
		ERR_GETTING_PROJECT: 'خطا هنگام دریافت پروژه',
		START_DATE: 'تاریخ شروع',
		ACTUAL_START_DATE: 'زمان شروع حقیقی',
		END_DATE: 'تاریخ پایان',
		ACTUAL_END_DATE: 'زمان پایان حقیقی',
		PLANNED_START_DATE: 'زمان شروع برنامه‌ریزی شده',
		PLANNED_END_DATE: 'زمان پایان برنامه‌ریزی شده',
		TEAMS: 'تیم‌ها',
		ROLES: 'نقش‌ها',
		NEW_TEAM: 'تیم جدید',
		NEW_ROLE: 'نقش جدید',
		EDIT_NAME: 'اصلاح نام',
	},

	addTeamMembers: {
		TEAM_MEMBER_ADDED: 'عضو تیم اضافه شد',
		TEAM_MEMBERS: 'اعضای تیم',
		TEAM_TEAMMEMBERS: 'اعضای تیم "{name}"',
		TEAM: 'تیم',
		ROLE: 'نقش',
		TEAM_NAME: 'نام تیم',
		ROLE_NAME: 'نام نقش',
		EMPLOYEE: 'کارمند',
		EMPLOYEE_USERNAME: "نام کاربری کارمند",
		
	},

	ganttView: {
		TASKS: 'تکالیف',
		GANTT: 'گانت',
		KANBAN: 'کانبان',
		EMPLOYEES: 'کارمندان',
		BUDGET: 'بودجه',
		FETCHING: 'در حال دریافت',
	},

	taskView: {
		CREATED: 'ساخته شد',
		CREATE_OBJ: 'ساختن {type}',
		EDIT_OBJ: 'اصلاح {type}',
		UPDATED: 'اصلاح شد',
		TASK_DELETED: 'تکلیف حذف شد',
		ADD_NEW_ACTIVITY: 'ایجاد فعالیت جدید',
		ADD_NEW_TASK: 'ایجاد تکلیف جدید',
		DELETE_TASK: 'حذف تکلیف',
		TASK: 'تکلیف',
		ACTIVITY: 'فعالیت',
	},

	kanban: {
		DELETE_STATE: 'حذف وضعیت "{name}"',
		STATE_NAME: 'نام وضعیت',
	},


	sidebar: {
		ENTER_TO_EDIT: 'برای تغییر نام فشار دهید',
		STATE: 'وضعیت',
		ACTUAL_START_DATE: 'زمان شروع حقیقی',
		ACTUAL_END_DATE: 'زمان پایان حقیقی',
		PLANNED_START_DATE: 'زمان شروع برنامه‌ریزی شده',
		PLANNED_END_DATE: 'زمان پایان برنامه‌ریزی شده',
		START_DATE: 'تاریخ شروع',
		END_DATE: 'تاریخ پایان',
		PLANNED_BUDGET: 'بودجه پیشنهادی',
		BUDGET: 'بودجه',
		ASSIGNEE: 'مامور',
		EMPLOYEE_NAME: 'نام کارمند',
		NOT_ASSIGNED: 'اختصتصاص داده نشده',
		COMMENTS: 'نظر‌ها',
		WRITE_YOUR_MESSAGE: 'پیامتان را بنویسید!',
		SEND: 'ارسال'
	},

	assignedToMe: {
		DATE: '{d|shortDate}'
	},
	
	navigationSidebar: {
		SIDEBAR: 'فهرست کناری',
		PROJECTS: 'پروژه‌ها',
		ASSIGNED: 'فعالیت‌های اختصاص‌یافته',
		LOG_OUT: 'خروج',
	},

	mainTopbar: {
		SEARCH_HERE: 'جست‌و‌جو کنید...',
	},

	gantt: {
		NAME: 'نام',
		FROM: 'از',
		TO: 'تا',
		EARLYSTART: 'شروع زودهنگام',
		EARLYFINAL: 'پایان زودهنگام',
		LATELYSTART: 'شروع دیرهنگام',
		LATELYFINAL: 'پایان دیرهنگام',
		DATE: '{d|tooltipDate}'
	}
}

export default fa
