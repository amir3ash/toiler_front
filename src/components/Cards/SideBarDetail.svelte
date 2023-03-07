<script lang="ts">
    import VariableSizedInput from '../../utils/VariableSizedInput.svelte'
    import {send_json_data} from '../../utils/get_cookie'
    import FlatPickr from './FlatPickr.svelte';
    import UserItem from '../../components/Cards/UserItem.svelte';
    import UserIcon from '../../components/Cards/UserIcon.svelte';
    import { escape ,createEventDispatcher } from 'svelte/internal';
    import Select from 'svelte-select'
    import Comment from '../../components/Cards/Comment.svelte';
    import { showAlert } from '../../utils/errors'
    import { formatedDateTime } from '../../utils/date_util'
    import AssignedSelectionItem from './AssignedSelectionItem.svelte'
    import type { UserUser, GanttAssigned, GetProjectQuery } from '../../gql/graphql'
    import { queryStore, gql, getContextClient } from '@urql/svelte';
    import LL, { locale } from '../../i18n/i18n-svelte';
    import fa from '../../../node_modules/flatpickr/dist/esm/l10n/fa'
    import type { BaseOptions } from 'flatpickr/dist/types/options';
    import {darkTheme, dir} from '../../stores'
    import { hijriCalendarPlugin } from '../../utils/persian_cal';

    type ProjectType = GetProjectQuery['project']
    type TaskType = ProjectType['tasks'][0]
    type ActivityType = TaskType['activities'][0]
    type State = ProjectType['states'][0]
    
    const TR = $LL.sidebar;

    const dispatch = createEventDispatcher()
    const close = () => dispatch('close', {id: object.id});
    
    export let object: ActivityType | TaskType;
    export let mode: 'activity' | 'task';
    export let modal = false;
    export let project_id: number;

    function deleteObj(){
        send_json_data(`/gantt/${mode}/${object.id}/`, 'DELETE', '', true)
        .then(res => {
            if (res.ok){
                dispatch('delete', {id: object.id});
                showAlert($LL.DELETED())
            }
        }) 
    }

    let dataGql = queryStore<{employees: UserUser[], states: State[]}>({
      client:getContextClient(),
      query: gql(`
      query getStatesAndEmployees($id: Int!) {
        employees: projectEmployees(projPk: $id) {
            id
            firstName
            lastName
            username
            avatar
        }
        states: projectStates(projPk: $id) {
            id
            name
        }
      }
      `),
      variables: {id: project_id},
      pause: true
    });

    function loadGqlInto(data: {employees: UserUser[], states: State[]}){
        const obj = object as ActivityType

        states = data.states;
        employees = data.employees;

        state = states.find(s => s.id === (obj.state && obj.state.id || obj.state));
        assignees = employees.filter(em => obj.assignees.find(o => (o.user && o.user.id || o.user)=== em.id));
    }

    function patchObject(e?, field: keyof (ActivityType&TaskType)=null){
        if (modal){
            editable = null
            return;
        }

        if (!isDatesValidOrShowError())
            return

        field = field || editable;
        let data = {[field]: object[field]};

        if (field.endsWith('Date') && e){
            const [ selectedDates ] = e.detail;
            data = {[field]: formatedDateTime(selectedDates)}
        }
        else if(field == "assignees")
            data[field] = (data[field] as GanttAssigned[]).map(o => ({user: o.user.id}))

        else if (data[field] && data[field].id)
            data[field] = data[field].id

        
        send_json_data(`/gantt/${mode}/${object.id}/`, 'PATCH', data, true).then(res => res.json())
        .then(data => {
            updateObjectFromRestData(data)

            dispatch('update', {mode: mode, field: field, object: object}) 
            showAlert($LL.UPDATED(), 'success')
        })
        .catch(async res => {
            if (res !== 400){
                showAlert('Error!');
                return;
            }
            
            const data: {string: [string]} = await res.json().catch(() => showAlert('Error'));
            Object.entries(data)
            .map(([field, [error]]) => 
                showAlert(`${field}: ${error}`, 'error', 5000)
            );  
        })
    }

    function updateObjectFromRestData(data){
        Object.entries(data)
        .map(([field, value]) => {
            if ((typeof value) === 'string')
                object[field] = value;
        })
    }

    

    if (!object.name && object.id){
        const url = `/gantt/${mode}/${object['id']}/`;
        const load = async () => {
            object = await fetch(url).then(res => res.json())
        }; 
        load()
    };
    

    
    let state: State = null;
    let states: State[] = [];
    let employees: UserUser[] = [];
    let assignees: UserUser[] = null;

    if (mode === 'activity' && object.__typename == "GanttActivity"){
        dataGql.resume()
    }


    let editable: keyof (ActivityType & TaskType) = null

    const flatpickr_options: Partial<BaseOptions> = {
        time_24hr: true,
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        altInput: true,
        altFormat: "M j, Y at H:i",
        locale: $locale === 'fa' ? fa.fa : null,
        plugins:  [
            hijriCalendarPlugin({}),
        ]
    }

    $: if (state!==null && mode==='activity'){
        updateState()
    }

    $: if (assignees!==null && mode==='activity'){
        updateAssignees()
    }

    $: if ($dataGql.data) loadGqlInto($dataGql.data)
    
    function updateState(){
        if (object.__typename !== "GanttActivity")
            return

        if (state === undefined && object.state !== null){
            object.state = null;
            patchObject(null, 'state')
        }
        else if(state && state.id !== (object.state && object.state.id || object.state)){
            object.state = state;
            patchObject(null, 'state');
        }
    }

    function updateAssignees(){
        if (object.__typename != "GanttActivity")
            return
        
        if (assignees === undefined && object.assignees.length > 0){
            object.assignees = [];
            patchObject(null, 'assignees');
            return;
        }

        if (assignees === undefined || !assignees.length){
            return;
        }

        // if (!object.assignees){
        //     object.assignees = assignees.map(user_id => ({user: user_id}));
        //     patchObject(null, 'assignees');
        //     return;
        // }

        const oldUsers = object.assignees.map(o => o.user).sort((a,b) => b.id - a.id);
        const newUsers = assignees.sort((a, b) => b.id - a.id);

        const updateObjectAssignees = function(){
            (object as ActivityType).assignees = newUsers.map(user_id => ({
                user: user_id,
                activityId: object.id,
                activity: object as ActivityType
            }));
        }

        if (oldUsers.length !== newUsers.length){
            updateObjectAssignees()
            patchObject(null, 'assignees');
            return;
        }

        let is_equal = true;
        for (let i = 0; i < oldUsers.length; ++i) {
            if (oldUsers[i].id !== newUsers[i].id){
                is_equal = false;
                break;
            }
        }

        if(!is_equal){
            updateAssignees();
            patchObject(null, 'assignees');
            return;
        }
    }

    let detail_mode: "comment" | "history";

    function isDatesValidOrShowError(): boolean {
        let errors: string[] = []

        const o = Object.entries(object)
        .map(([field, value]) => { // convert string dates to Date
            if (field.endsWith("Date")){
                return {[field]: strDateToOption(value)}
            }
        })
        .reduce((a, b) => ({...a, ...b}))
        
        const now = strDateToOption('now')

        if (o.plannedStartDate > o.plannedEndDate)
            errors.push('Planned start date should be before Planned end date.')
        
        if (o.actualStartDate && o.actualEndDate && o.actualStartDate > o.actualEndDate)
            errors.push('Actual start date should be before Actual end date.')
        
        if (o.actualStartDate && (o.actualStartDate > now))
            errors.push('Actual start date should be before now.')
        
        if (o.actualEndDate){
            if (o.actualEndDate > now)
                errors.push('Actual start date should be before now.')
            
            if (!o.actualStartDate)
                errors.push('If you specified ActualEndDate, you should specify ActualStartDate.')
        }

        errors.map(error => showAlert(error))

        return errors.length == 0
    }

    /**
     * @returns date in milliseconds or `null`.
     * 
     * if `date` is `"now"` then returns now in milliseconds.
     * if `date` is `null`, returns `null`.
     * if date2 is not null, returns min of them
     */
    function strDateToOption(date?: string | "now", date2?: string){
        if (date === null)
            return null

        let res: number = null;
        if (date !== 'now')
            res =  new Date(date).getTime()
        else
            res = new Date().getTime()
        
        if (date2){
            let d2 = new Date(date2).getTime()
            res = d2 >= res ? res : d2;
        }
        
        return res
    }
    
</script>

<div class="p-2 bg-white dark:bg-black" dir="{$dir}">

    {#if !modal}
    <div class="flex justify-end">
        <button 
            class="bg-transparent text-slate-700 dark:text-slate-400 text-md mr-4 px-2 rounded-lg outline-none focus:outline-none hover:bg-red-100 dark:hover:bg-red-800"
            on:click="{deleteObj}"
            aria-label="{$LL.DELETE()}"
        >
            <i class="fas fa-trash"></i>
        </button>
        <button 
            class="bg-transparent text-slate-700 dark:text-slate-400 text-2xl mr-4 px-2 rounded-lg outline-none focus:outline-none hover:bg-blue-100 dark:hover:bg-blue-800"
            on:click="{close}"
            aria-label="{$LL.CLOSE()}"
        >
            <i class="fas fa-times"></i>
        </button>
        
    </div>
    {/if}
   
    
    
        <h6 class="text-blueGray-700 dark:text-blueGray-300 mb-1 px-1 text-xl font-medium">
            <input class="border-none h-7 rounded-xl dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                type="text"
                placeholder="Name"
                bind:value="{object.name}"
                on:change="{e => patchObject(null, 'name')}"
            >
        </h6>
        {#if mode === 'activity'}
            <div class="w-1/3">
                <Select
                    inputStyles="--tw-ring-color: transparent"
                    containerClasses="flex pl-1 p-1 pr-2 mr-2  text-xs dark:bg-slate-800"
                    containerStyles='{$darkTheme? 'background: #121212; border-color: #454545; --listBackground: #343434; --itemHoverBG: #505050; ': ''}; --height: 24px; --borderRadius: 12px; --selectedItemPadding: 0 0 0 4px; --padding: 0px 4px 0px 4px; --clearSelectBottom: 0px; --clearSelectTop: 0px'
                    placeholder="{TR.STATE()}"
                    optionIdentifier="id"
                    getOptionLabel="{s => escape(s.name)}"
                    getSelectionLabel="{s => escape(s.name)}"
                    bind:value="{state}"
                    items="{states}"
                />
            </div>
        {/if}
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/2">
            {TR.PLANNED_START_DATE()}
        </div>
        <div class="flex w-1/2 pr-4 flex-row-reverse text-slate-700 font-normal">
            <FlatPickr
                class="rounded-lg p-0 w-32  focus:outline-none text-center text-xs border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-600 dark:hover:bg-slate-700"
                bind:value="{object.plannedStartDate}"
                placeholder="{TR.START_DATE()}"
                label="{TR.PLANNED_START_DATE()}"
                options="{{...flatpickr_options, maxDate: strDateToOption(object.plannedEndDate)}}" 
                on:change="{e => patchObject(e, 'plannedStartDate')}"
                required
            />
        </div>
    </div>
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/2">
            {TR.PLANNED_END_DATE()}
        </div>
        <div class="flex w-1/2 pr-4 flex-row-reverse text-slate-700 font-normal">
            <FlatPickr
                class="rounded-lg p-0 w-32  focus:outline-none text-center text-xs border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-600 dark:hover:bg-slate-700"
                bind:value="{object.plannedEndDate}"
                placeholder="{TR.END_DATE()}"
                label="{TR.PLANNED_END_DATE()}"
                options="{{...flatpickr_options, minDate: strDateToOption(object.plannedStartDate)}}"
                on:change="{e => patchObject(e, 'plannedEndDate')}"
                required
            />
        </div>
    </div>
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/2">
            {TR.START_DATE()}
        </div>
        <div class="flex w-1/2 pr-4 flex-row-reverse text-slate-700 font-normal">
            <FlatPickr
                class="rounded-lg p-0 w-32  focus:outline-none text-center text-xs border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-600 dark:hover:bg-slate-700"
                bind:value="{object.actualStartDate}"
                placeholder="{TR.START_DATE()}"
                label="{TR.START_DATE()}"
                options="{{...flatpickr_options, maxDate: strDateToOption('now', object.actualEndDate)}}"
                on:change="{e => patchObject(e, 'actualStartDate')}"
            />
        </div>
    </div>
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/2">
            {TR.END_DATE()}
        </div>
        <div class="flex w-1/2 pr-4 flex-row-reverse text-slate-700 font-normal">
            <FlatPickr
                class="rounded-lg p-0 w-32  focus:outline-none text-center text-xs border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-600 dark:hover:bg-slate-700"
                bind:value="{object.actualEndDate}"
                placeholder="{TR.END_DATE()}"
                label="{TR.END_DATE()}"
                options="{{...flatpickr_options, minDate: strDateToOption(object.actualStartDate), maxDate: strDateToOption('now')}}"
                on:change="{e => patchObject(e, 'actualEndDate')}"
            />
        </div>
    </div>
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/3">
            {TR.PLANNED_BUDGET()}
        </div>
        <VariableSizedInput 
            classes="ml-4 px-2 text-slate-700 dark:text-slate-300 font-normal bg-transparent rounded-lg border border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:border-slate-600"    
            bind:value="{object.plannedBudget}"
            on:click_enter="{e => {object.plannedBudget=e.detail.value; patchObject(e, 'plannedBudget')}}"
            placeholder="{TR.BUDGET()}"
            min_width="70px"
        />
    </div>
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/3">
            {TR.BUDGET()}
        </div>
        <VariableSizedInput 
            classes="ml-4 px-2 text-slate-700 dark:text-slate-300 font-normal bg-transparent rounded-lg border border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:border-slate-600"    
            bind:value="{object.actualBudget}"
            on:click_enter="{e => {object.actualBudget=e.detail.value; patchObject(e, 'actualBudget')}}"
            placeholder="{TR.BUDGET()}"
            min_width="70px"
        />
    </div>
    <div class="text-xs mt-2 text-slate-900 dark:text-slate-300 font-medium">
        {$LL.DESCRIPTION()}:
        <div class="flex text-slate-700">
        {#if editable === 'description'}
            <textarea 
                class="rounded-lg p-2 focus:outline-none text-sm text-slate-700 border-slate-300  dark:text-slate-300 dark:bg-slate-800 "
                bind:value="{object.description}"
                on:change="{e => patchObject(null, 'description')}"
            />
        {:else}
            <button 
              class="text-left rounded-lg p-2 mr-2 w-full font-normal text-xs  border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              on:click="{()=>editable='description'}"
            >
                {object.description}
            </button>
        {/if}
        </div>
    </div>
    {#if mode === 'activity'}
        
    <div class="flex text-xs mt-2 text-slate-900 font-medium dark:text-slate-300">
        <div class="w-1/3">
            {TR.ASSIGNEE()}
        </div>
        <div class="px-1 w-2/3 font-normal text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
        {#if editable === 'assignees'}
            <Select
                inputStyles="--tw-ring-color: transparent"
                containerClasses="pl-1 p-1 pr-2 mr-2  text-sm"
                containerStyles='{$darkTheme? 'background: #121212; border-color: #454545; --listBackground: #343434; --itemHoverBG: #505050; ': ''};--height: 34px; --borderRadius: 12px; --padding: 0px 0px 0px 4px; --clearSelectBottom: 0px; --clearSelectTop: 0px'
                placeholder="{TR.EMPLOYEE_NAME()}"
                optionIdentifier="id"
                getOptionLabel="{o => escape(o.username)}"
                getSelectionLabel="{o => escape(o.username)}"
                items="{employees}"
                bind:value="{assignees}"
                Item="{UserItem}"
                MultiSelection="{AssignedSelectionItem}"
                isMulti="{true}"
            />
        {:else}
        <button class="inline-flex" on:click="{() => editable='assignees'}">
            {#if object.__typename == "GanttActivity" && object.assignees && assignees}
                <!-- <span class="w-6 h-6 bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                    <img class="w-full rounded-full align-middle border-none shadow-lg" src="{assignee.avatar}" aria-hidden="true">
                </span> -->
                
                
                {#each assignees as assigned}
                    <UserIcon avatar="{assigned.avatar}"/>
                    <div class="p-1">
                        {assigned.username}
                    </div>

                {:else}
                    {TR.NOT_ASSIGNED()}
                {/each}

            {:else}
                {TR.NOT_ASSIGNED()}
            {/if}
        </button>
        {/if}
            
            
        </div>
    </div>
    {/if}
    
    {#if object.id}
    <div class="w-full text-xs">
        {#if mode === 'activity'}
        <button 
            class="p-1 mt-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" 
            class:bg-slate-100="{detail_mode==='comment'}"
            class:dark:bg-slate-800="{detail_mode==='comment'}"
            on:click="{() => detail_mode='comment'}"
        >
            {TR.COMMENTS()}
        </button>
        {/if}
            
        
    </div>
    {/if}


    {#if detail_mode==='comment'}
        <div class="text-xs mt-2 text-slate-900 font-medium dark:text-slate-300">
            <Comment activity_id="{object.id}"/>
        </div>
    {/if}
   
</div>