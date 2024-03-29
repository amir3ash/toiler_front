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
    import type { UserUser, GanttAssigned } from '../../gql/graphql'
    import { queryStore, gql, getContextClient } from '@urql/svelte';
    import LL, { locale } from '../../i18n/i18n-svelte';
    import fa from '../../../node_modules/flatpickr/dist/esm/l10n/fa'
    import type { BaseOptions } from 'flatpickr/dist/types/options';
    import {darkTheme, dir} from '../../stores'
    import { hijriCalendarPlugin } from '../../utils/persian_cal';
    import { deepCopy } from '../../utils/copy_util';
    import { isDatesValidOrShowError, strDateToOption } from '../../utils/sidebar_util';
    import type { ActivityType, State, TaskType } from '../../gql/ProjectQueryTypes';

    
    const TR = $LL.sidebar;

    let closed = false
    const dispatch = createEventDispatcher()
    const close = () => {
        closed = true
        dispatch('close', {id: object.id});
    }

    const copyLocalObject = () => localObject = deepCopy(object);
    
    export let object: ActivityType | TaskType;
    export let mode: 'activity' | 'task';
    export let modal = false;
    export let project_id: number;
    export let states: State[];


    let localObject = object;
    let id: number

    $: if (object.id !== id) {id = object.id; copyLocalObject();}

    function deleteObj(){
        send_json_data(`/gantt/${mode}/${object.id}/`, 'DELETE', '', true)
        .then(res => {
            if (res.ok){
                dispatch('delete', {id: object.id});
                showAlert($LL.DELETED())
            }
        }) 
    }

    let dataGql = queryStore<{employees: UserUser[]}>({
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
      }
      `),
      variables: {id: project_id},
      pause: true
    });

    function loadGqlInto(activity: ActivityType, data: {employees: UserUser[]}){
        employees = data.employees;

        state = states.find(s => s.id === (activity.state && activity.state.id || activity.state));
        assignees = employees.filter(em => activity.assignees.find(o => (o.user && o.user.id || o.user)=== em.id));
    }

    function _patch(e?, field?: keyof (ActivityType&TaskType)){
        if (closed || !isDatesValidOrShowError(localObject))
            return

        field = field || editable;
        let data = {[field]: localObject[field]};

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
            updateObjectFromRestData(data, field)

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

    function patchObject(e?, field: keyof (ActivityType&TaskType)=null){
        if (modal){
            object = localObject
            editable = null
            return;
        }

        if (field !==  'plannedBudget' && field !== 'actualBudget' && field !== 'assignees')
            setTimeout(() => _patch(e, field), 100)
        else 
            _patch(e, field)
    }

    function updateObjectFromRestData(data, updatedField?: keyof (ActivityType&TaskType)){
        Object.entries(data)
        .map(([field, value]) => {
            if ((typeof value) === 'string')
                object[field] = value;
        })

        if (updatedField === 'assignees'){
            const newAssignees = data.assignees.map(o => ({id:o.id, activityId: object.id, user: employees.find(em => em.id === o.user)}));
            object[updatedField] = newAssignees
            assignees = employees.filter(em => data.assignees.find(o => o.user === em.id));
        }

        else if (updatedField === 'state'){
            object[updatedField] = states.find(s => s.id == data.state)
        }

        copyLocalObject()
        object = object
    }

    
    let state: State = null;
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

    $: if (mode === 'activity' && (modal || object.id) && $dataGql.data) 
        loadGqlInto(object as ActivityType, $dataGql.data)
    
    function updateState(){
        if (localObject.__typename !== "GanttActivity")
            return

        if (state === undefined && localObject.state !== null){
            localObject.state = null;
            patchObject(null, 'state')
        }
        else if(state && state.id !== (localObject.state && localObject.state.id || localObject.state)){
            localObject.state = state;
            patchObject(null, 'state');
        }
    }

    function updateAssignees(){
        if (localObject.__typename != "GanttActivity" || object.__typename != 'GanttActivity')
            return
        
        if (assignees === undefined && localObject.assignees.length > 0){
            localObject.assignees = [];
            patchObject(null, 'assignees');
            return;
        }

        if (assignees === undefined || !assignees.length){
            return;
        }

        const oldUsersIds = localObject.assignees.map(o => o.user.id || o.user as number).sort();
        const newUsersIds = assignees.map(o=>o.id).sort();

        const updateObjectAssignees = function(){
            (localObject as ActivityType).assignees = newUsersIds.map(userId => ({
                user: {id: userId},
                activityId: localObject.id,
            })) as any;
        }

        if (oldUsersIds.length !== newUsersIds.length){
            updateObjectAssignees()
            patchObject(null, 'assignees');
            return;
        }

        let is_equal = true;
        for (let i = 0; i < oldUsersIds.length; ++i) {
            if (oldUsersIds[i] !== newUsersIds[i]){
                is_equal = false;
                break;
            }
        }

        if(!is_equal){
            updateObjectAssignees();
            patchObject(null, 'assignees');
            return;
        }
    }

    let detail_mode: "comment";

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
   
    
    
        <h6 class="text-slate-700 dark:text-slate-300 mb-1 px-1 text-xl font-medium">
            <input class="border-none h-7 rounded-xl bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                type="text"
                placeholder="Name"
                bind:value="{localObject.name}"
                on:change="{e => patchObject(null, 'name')}"
            >
        </h6>
        {#if mode === 'activity'}
            <div class="w-1/3">
                <Select
                    inputStyles="--tw-ring-color: transparent"
                    containerClasses="flex pl-1 p-1 pr-2 mr-2  text-xs dark:bg-slate-800"
                    containerStyles='{$darkTheme? 'background: #121212; border-color: #454545; --listBackground: #343434; --itemHoverBG: #505050; ': ''}; direction: ltr; --height: 24px; --borderRadius: 12px; --selectedItemPadding: 0 0 0 4px; --padding: 0px 4px 0px 4px; --clearSelectBottom: 0px; --clearSelectTop: 0px'
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
                bind:value="{localObject.plannedStartDate}"
                placeholder="{TR.START_DATE()}"
                label="{TR.PLANNED_START_DATE()}"
                options="{{...flatpickr_options, maxDate: strDateToOption(localObject.plannedEndDate)}}" 
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
                bind:value="{localObject.plannedEndDate}"
                placeholder="{TR.END_DATE()}"
                label="{TR.PLANNED_END_DATE()}"
                options="{{...flatpickr_options, minDate: strDateToOption(localObject.plannedStartDate)}}"
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
                bind:value="{localObject.actualStartDate}"
                placeholder="{TR.START_DATE()}"
                label="{TR.START_DATE()}"
                options="{{...flatpickr_options, maxDate: strDateToOption('now', localObject.actualEndDate)}}"
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
                bind:value="{localObject.actualEndDate}"
                placeholder="{TR.END_DATE()}"
                label="{TR.END_DATE()}"
                options="{{...flatpickr_options, minDate: strDateToOption(localObject.actualStartDate), maxDate: strDateToOption('now')}}"
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
            bind:value="{localObject.plannedBudget}"
            on:click_enter="{e => patchObject(null, 'plannedBudget')}"
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
            bind:value="{localObject.actualBudget}"
            on:click_enter="{e => patchObject(null, 'actualBudget')}"
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
                bind:value="{localObject.description}"
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
            {#if localObject.__typename == "GanttActivity" && localObject.assignees && assignees}
                <!-- <span class="w-6 h-6 bg-slate-200 inline-flex items-center justify-center rounded-full">
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