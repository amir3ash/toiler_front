<script>
    import { user } from '../../stores'
    import VariableSizedInput from '../../utils/VariableSizedInput.svelte'
    import {send_json_data} from '../../utils/get_cookie'
    import FlatPickr from 'svelte-flatpickr'
    import UserItem from 'components/Cards/UserItem.svelte';
    import UserIcon from 'components/Cards/UserIcon.svelte';
    import { escape, onMount,createEventDispatcher } from 'svelte/internal';
    import Select from 'svelte-select'
    import Comment from 'components/Cards/Comment.svelte';
    import { showAlert } from '../../utils/errors'
    import { formatedDateTime } from '../../utils/date_util'
    import AssignedSelectionItem from './AssignedSelectionItem.svelte'


    const dispatch = createEventDispatcher()
    const close = () => dispatch('close', {id: object.id});
    
    function deleteObj(){
        send_json_data(`/gantt/${mode}/${object.id}/`, 'DELETE', '', true)
        .then(res => {
            if (res.ok){
                dispatch('delete', {id: object.id});
                showAlert('Deleted')
            }
        }) 
    }

    function updateObject(e, field=null){
        if (modal)
            return;

        field = field || editable;
        let data = {[field]: object[field]};

        if (field.endsWith('_date')){
            const [ selectedDates ] = e.detail;
            data = {[field]: formatedDateTime(selectedDates)}
        }

        send_json_data(`/gantt/${mode}/${object.id}/`, 'PATCH', data, true).then(res => res.json())
        .then(data => {
            object=data;

            dispatch('update', {mode: mode, field: field, object: object}) 
            showAlert('Updated', 'success')
        })
        .catch(async res => {
            if (! res !== 400){
                showAlert('Error!');
                return;
            }
            
            const data = await res.json().catch(() => showAlert('Error'));
            Object.entries(data)
            .map(([field, [error]]) => 
                showAlert(`${field.replaceAll('_', ' ')}: ${error}`, 'error', 5000)
            );  
        })
    }

   

    export let object;
    export let mode; // 'activity' or 'task'
    export let modal = false;
    export let project_id;

    if (!object.name && object.id){
        const url = `/gantt/${mode}/${object['id']}/`;
        const load = async () => {
            object = await fetch(url).then(res => res.json())
        }; 
        load()
    };
    

    let listOpen = false;

    
    let state=null;
    let states = [];
    let employees = [];
    let assignees=null;

    if (mode === 'activity'){
        fetch(`/gantt/${project_id}/state/`)
        .then(res => res.json())
        .then(data => {
            states = data
            state = states.find(s => s.id === (object.state && object.state.id || object.state));
        })

        
        fetch(`/gantt/${project_id}/employee/`).then(r => r.json())
        .then(data => {
            employees=data;
            if (object.assignees)
                assignees = employees.filter(em => object.assignees.find(o => (o.user && o.user.id || o.user)=== em.id));
        })
    }

    let editable=''

    const flatpickr_options = {
        time_24hr: true,
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        altInput: true,
        altFormat: "M j, Y at H:i",
    }

    $: if (state!==null && mode==='activity'){
        
        if (state === undefined && object.state !== null){
            object.state = null;
            updateObject(null, 'state')
        }
        else if(state && state.id !== (object.state && object.state.id || object.state)){
            object.state = state.id;
            updateObject(null, 'state');
        }
    }

    $: if (assignees!==null && mode==='activity'){
        updateAssignees()
    }
    
    function updateAssignees(){
        if (assignees === undefined && object.assignees.length > 0){
            object.assignees = [];
            updateObject(null, 'assignees');
            return;
        }

        if (!assignees.length){
            return;
        }

        if (!object.assignees){
            object.assignees = assignees.map(user_id => ({user: user_id}));
            updateObject(null, 'assignees');
            return;
        }

        let a = object.assignees.map(o => o.user && o.user.id || o.user).sort();
        let b = assignees.map(o =>o.id).sort();

        if (a.length !== b.length){
            object.assignees = b.map(user_id => ({user: user_id}));
            updateObject(null, 'assignees');
            return;
        }

        let is_equal = true;
        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]){
                is_equal = false;
                break;
            }
        }

        if(!is_equal){
            object.assignees = b.map(user_id => ({user: user_id}));
            updateObject(null, 'assignees');
            return;
        }
    }

let detail_mode; // comment or history

    
</script>

<div class="p-2 bg-white">

    {#if !modal}
    <div class="flex justify-end">
        <button 
            class="bg-transparent text-slate-700 text-md mr-4 px-2 rounded-lg outline-none focus:outline-none hover:bg-red-100"
            on:click="{deleteObj}"
            aria-label="Delete"
        >
            <i class="fas fa-trash"></i>
        </button>
        <button 
            class="bg-transparent text-slate-700 text-2xl mr-4 px-2 rounded-lg outline-none focus:outline-none hover:bg-blue-100"
            on:click="{close}"
            aria-label="Close"
        >
            <i class="fas fa-times"></i>
        </button>
        
    </div>
    {/if}
   
    
    
        <h6 class="text-blueGray-700 mb-1 px-1 text-xl font-medium hover:bg-slate-100">
            {#if editable === 'name'}
                <input class="" type="text" bind:value="{object.name}" on:change="{updateObject}">
            {:else}
                <button class="w-full text-left" on:click="{(e) => editable='name'}">
                    {object.name || 'Enter to edit name'}
                </button>
            {/if}
        </h6>
        {#if mode === 'activity'}
            <div class="w-1/3">
                <Select
                    inputStyles="--tw-ring-color: transparent"
                    containerClasses="flex pl-1 p-1 pr-2 mr-2  text-xs"
                    containerStyles='--height: 24px; --borderRadius: 12px; --selectedItemPadding: 0 0 0 4px; --padding: 0px 4px 0px 4px; --clearSelectBottom: 0px; --clearSelectTop: 0px'
                    placeholder="State"
                    optionIdentifier="id"
                    getOptionLabel="{s => s.name}"
                    getSelectionLabel="{s => s.name}"
                    bind:value="{state}"
                    items="{states}"
                    on:change="{e => alert(e)}"
                />
            </div>
        {/if}
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/2">
            Planned Start Date
        </div>
        <div class="flex w-1/2 pr-4 flex-row-reverse text-slate-700 font-normal">
            <FlatPickr
                class="rounded-lg p-0 w-32  focus:outline-none text-center text-xs border-slate-300 hover:bg-slate-100"
                bind:value="{object.planned_start_date}"
                placeholder="Start date"
                label="Planned Start date"
                options="{flatpickr_options}"
                on:change="{e => updateObject(e, 'planned_start_date')}"
                required
            />
        </div>
    </div>
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/2">
            Planned End Date
        </div>
        <div class="flex w-1/2 pr-4 flex-row-reverse text-slate-700 font-normal">
            <FlatPickr
                class="rounded-lg p-0 w-32  focus:outline-none text-center text-xs border-slate-300 hover:bg-slate-100"
                bind:value="{object.planned_end_date}"
                placeholder="End date"
                label="Planned end date"
                options="{flatpickr_options}"
                on:change="{e => updateObject(e, 'planned_end_date')}"
                required
            />
        </div>
    </div>
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/2">
            Start Date
        </div>
        <div class="flex w-1/2 pr-4 flex-row-reverse text-slate-700 font-normal">
            <FlatPickr
                class="rounded-lg p-0 w-32  focus:outline-none text-center text-xs border-slate-300 hover:bg-slate-100"
                bind:value="{object.actual_start_date}"
                placeholder="Start date"
                label="Start date"
                options="{flatpickr_options}"
                on:change="{e => updateObject(e, 'actual_start_date')}"
            />
        </div>
    </div>
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/2">
            End Date
        </div>
        <div class="flex w-1/2 pr-4 flex-row-reverse text-slate-700 font-normal">
            <FlatPickr
                class="rounded-lg p-0 w-32  focus:outline-none text-center text-xs border-slate-300 hover:bg-slate-100"
                bind:value="{object.actual_end_date}"
                placeholder="End date"
                label="End date"
                options="{flatpickr_options}"
                on:change="{e => updateObject(e, 'actual_end_date')}"
            />
        </div>
    </div>
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/3">
            Planned Budget
        </div>
        <VariableSizedInput 
            classes="ml-4 px-2 text-slate-700 font-normal bg-transparent rounded-lg border border-slate-300 hover:bg-slate-100"    
            bind:value="{object.planned_budget}"
            on:click_enter="{e => {object.planned_budget=e.detail.value; updateObject(e, 'planned_budget')}}"
            placeholder="Budget"
            min_width="70px"
        />
    </div>
    <div class="flex text-xs mt-2 font-medium">
        <div class="w-1/3">
            Budget
        </div>
        <VariableSizedInput 
            classes="ml-4 px-2 text-slate-700 font-normal bg-transparent rounded-lg border border-slate-300 hover:bg-slate-100"    
            bind:value="{object.actual_budget}"
            on:click_enter="{e => {object.actual_budget=e.detail.value; updateObject(e, 'actual_budget')}}"
            placeholder="Budget"
            min_width="70px"
        />
    </div>
    <div class="text-xs mt-2 text-slate-900 font-medium">
        Description:
        <div class="flex text-slate-700">
        {#if editable === 'description'}
            <textarea 
                class="rounded-lg p-2 focus:outline-none text-sm text-slate-700 border-slate-300"
                bind:value="{object.description}"
                on:change="{updateObject}"
            />
        {:else}
            <button 
              class="text-left rounded-lg p-2 mr-2 w-full font-normal text-xs  border-slate-300 hover:bg-slate-100"
              on:click="{()=>editable='description'}"
            >
                {object.description}
            </button>
        {/if}
        </div>
    </div>
    {#if mode === 'activity'}
        
    <div class="flex text-xs mt-2 text-slate-900 font-medium">
        <div class="w-1/3">
            Assignee
        </div>
        <div class="px-1 w-2/3 font-normal text-slate-700 hover:bg-slate-100">
        {#if editable === 'assignee'}
            <Select
                inputStyles="--tw-ring-color: transparent"
                containerClasses="pl-1 p-1 pr-2 mr-2  text-sm"
                containerStyles='--height: 34px; --borderRadius: 12px; --padding: 0px 0px 0px 4px; --clearSelectBottom: 0px; --clearSelectTop: 0px'
                placeholder="Employee name"
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
        <button class="inline-flex" on:click="{() => editable='assignee'}">
            {#if object.assignees && assignees}
                <!-- <span class="w-6 h-6 bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                    <img class="w-full rounded-full align-middle border-none shadow-lg" src="{assignee.avatar}" aria-hidden="true">
                </span> -->
                
                
                {#each assignees as assigned}
                    <UserIcon avatar="{assigned.avatar}"/>
                    <div class="p-1">
                        {assigned.username}
                    </div>

                {:else}
                    Not assigned
                {/each}

            {:else}
                Not assigned
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
            class="p-1 rounded-md hover:bg-slate-100" 
            class:bg-slate-100="{detail_mode==='comment'}"
            on:click="{() => detail_mode='comment'}"
        >
            Comments
        </button>
        {/if}
            
        
    </div>
    {/if}


    {#if detail_mode==='comment'}
        <div class="text-xs mt-2 text-slate-900 font-medium">
            <Comment activity_id="{object.id}"/>
        </div>
    {/if}
   
</div>