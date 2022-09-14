<script>
    // export let location;
    import { onMount } from 'svelte';
    import { user, search_text } from '../../stores'
    import {send_json_data} from '../../utils/get_cookie'
    import SideBarDetail from 'components/Cards/SideBarDetail.svelte'
    import {showAlert} from '../../utils/errors';
    import Modal from 'components/Cards/Modal.svelte'
   
    export let selected_object=null;
    export let mode;
    export let project_id;

    let project_data;
    const awaitable = fetch(`/gantt/all/${project_id}/`).then(r => r.json())
    .then(data => {project_data=data; edit_object=data.tasks[0]})

    let edit_object=null;
    let edit_mode; // 'task' or 'activity'
    let create_mode=false;
    
    // مشترک ها
    const default_fields = ['name', 'planned_start_date', 'planned_end_date', 'actual_start_date',
                            'actual_end_date', 'description', 'planned_budget', 'actual_budget'];

    function update(e){
        // console.log(edit_object); return;
        const method = create_mode ? 'POST' : 'PUT';
        const url_id = create_mode ? '' : `${edit_object.id}/`;

        let data = default_fields.reduce(
            (obj, field) => obj.length ? {[obj]: edit_object[obj], [field]: edit_object[field]}  // initial
                                       : {...obj, [field]: edit_object[field]}  // create object with edit_object fields 
        );
        if (create_mode){
            if (edit_mode === 'activity'){
                data.task = edit_object.task;
                data.state = edit_object.state;
                data.assignees = edit_object.assignees;
            }
            else if (edit_mode === 'task'){
                data.project = project_id;
            }
        }

        send_json_data(`/gantt/${edit_mode}/${url_id}`, method, data)
        .then(data => {
            if (create_mode){
                if (data.task){ // activity
                    const index = project_data.tasks.findIndex(t => t.id === data.task);
                    project_data.tasks[index].activities.push(data);
                    project_data = project_data;
                }
                else if (data.project){ // task
                    data.activities = [];
                    project_data.tasks.push(data);
                    project_data = project_data;
                }
            }

            const message = create_mode ? 'Created' : 'Updated';
            showAlert(message, 'success');
        })
        .catch(e => showAlert(e))
    }


    const default_object = {
        "name": "",
        "planned_start_date": null,
        "planned_end_date": null,
        "planned_budget": null,
        "actual_start_date": null,
        "actual_end_date": null,
        "actual_budget": null,
        "description": ""
    }

    const flatpickr_options = {
        time_24hr: true,
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        altInput: true,
        altFormat: "M j, Y at H:i",
    }

    function createActivity(task_id){
        edit_object = default_object;
        edit_object['task'] = task_id;
        edit_object['assignees'] = [];
        edit_mode = 'activity';
        create_mode = true;
    }

    function deleteTask(task_id){
        send_json_data(`/gantt/task/${task_id}/`,'DELETE', '', true)
        .then(() => {
            const tasks = project_data.tasks
            const index = tasks.findIndex(t => t.id === task_id);
            project_data.tasks = [...tasks.slice(0, index), ...tasks.slice(index+1)]
            project_data = project_data;
            showAlert('Task deleted', 'error');
        })
        .catch((e) => {console.log(e); showAlert('Error!', 'error');})
    };

    function deleteActivity(){};
</script>

<section class="w-full max-h-full overflow-auto">
    <div class="flex mt-4 pb-8 min-w-max flex-nowrap justify-start">
    {#await awaitable then _}
            
        
        {#each project_data.tasks as task(task.id)}
            <div class="text-left mx-2 p-2 w-72 rounded-lg bg-white shadow">
                <div class="flex p-1 mb-2 border-b border-slate-400">
                    <h3 class="w-full text-lg">
                        <button on:click="{() => {mode='task'; selected_object=task}}">
                            {task.name}
                        </button>
                    </h3>
                    
                    <button on:click="{()=>deleteTask(task.id)}" class="px-2 text-slate-300 hover:text-rose-700" aria-label="delete task">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                
                

                {#each task.activities.filter(o => o.name.includes($search_text)) as activity(activity.id)}
                    <div class="flex my-1 justify-start mx-1 p-2 text-left shadow border rounded border-amber-200">
                        <button on:click="{() => {mode='activity'; selected_object=activity}}">
                            {activity.name}
                        </button>
                        {#if activity.assignees}
                            <!-- {#each activity.assignees as assignee}
                                <span class="w-8 h-8 ml-auto bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                                    <img  class="w-full rounded-full align-middle border-none shadow-lg" src="{activity.assigned.avatar}" alt="{activity.assigned.username}'s avatar">
                                </span>
                            {/each} -->
                        {/if}
                    </div>
                {/each}

                <button 
                    class="flex my-1 w-full justify-start mx-1 p-2 text-left border rounded border-slate-200 hover:bg-slate-100"
                    on:click="{()=> createActivity(task.id)}"    
                >
                   Add New Activity
                </button>
            
            </div>
        {/each}

        <div class="px-4 w-10 min-w-max">
            <button
              class="p-4 w-full flex-nowrap whitespace-nowrap mb-6 shadow-lg rounded border-2 border-dashed border-slate-500 bg-slate-50 hover:bg-slate-100"
              on:click="{()=>{edit_object=default_object; edit_mode='task'; create_mode=true;}}"
            >
                Add New Task
            </button>
        </div>

    {/await}
    </div>
</section>



{#if edit_mode}
<Modal save="true" on:click_close="{() => {edit_mode=null; edit_object=default_object}}" on:click_save="{update}">
    <h1 slot="header" class="px-2 font-extralight text-3xl">
        {create_mode? 'Create':'Edit'} {edit_mode==='task'? 'Task': 'Activity'}
    </h1>
    <SideBarDetail
        bind:object="{edit_object}"
        on:close="{() => edit_object=null}"
        on:delete="{e => alert(e.detail.id)}"
        mode="{edit_mode}"
        modal="true"
        project_id="{project_id}"
    />
</Modal>
{/if}




<!-- <div class="flex">
    <svg viewBox="0 0 0 0" style="position: absolute; z-index: -1; opacity: 0;">
    <defs>
        <linearGradient id="boxGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="25" y2="25">
        <stop offset="0%" stop-color="#27FDC7"></stop>
        <stop offset="100%" stop-color="#0FC0F5"></stop>
        </linearGradient>

        <linearGradient id="lineGradient">
        <stop offset="0%" stop-color="#0FC0F5"></stop>
        <stop offset="100%" stop-color="#27FDC7"></stop>
        </linearGradient>
        <linearGradient id="gra" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0FC0F5"></stop>
        <stop offset="100%" stop-color="#27FDC7"></stop>
        </linearGradient>

        <path id="todo__line" stroke="url(#lineGradient)" d="M21 12.3h168v0.1z"></path>
        <path id="todo__box" stroke="url(#boxGradient)" d="M21 12.7v5c0 1.3-1 2.3-2.3 2.3H8.3C7 20 6 19 6 17.7V7.3C6 6 7 5 8.3 5h10.4C20 5 21 6 21 7.3v5.4"></path>
        <path id="todo__check" stroke="url(#boxGradient)" d="M10 13l2 2 5-5"></path>
        <circle id="todo__circle" cx="13.5" cy="12.5" r="10"></circle>
    </defs>
    </svg>
    {#each tasks as task (task.id)}
        <div class="w-full xl:w-4/12 mb-12 xl:mb-0 px-4">
            <Task {...task}/>
        </div>
    {/each}

    <div class="w-full xl:w-4/12 mb-12 xl:mb-0 px-4">
        <button
          class="p-4 w-full break-words mb-6 shadow-lg rounded border-2 border-dashed border-slate-500 bg-slate-50 hover:bg-slate-100"
        >
            Add New Task
        </button>
    </div>
</div> -->