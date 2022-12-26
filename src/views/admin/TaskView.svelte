<script lang="ts">
    // export let location;
    import { onMount } from 'svelte';
    import { user, search_text } from '../../stores'
    import {send_json_data} from '../../utils/get_cookie'
    import SideBarDetail from 'components/Cards/SideBarDetail.svelte'
    import {showAlert} from '../../utils/errors';
    import Modal from 'components/Cards/Modal.svelte'
    import type { GetProjectQuery } from '../../gql/graphql';

    type ProjectType = GetProjectQuery['project']
    type TaskType = ProjectType['tasks'][0]
    type ActivityType = TaskType['activities'][0]

    type Common<A, B> = {
        [P in keyof A & keyof B]: A[P] | B[P];
    }

    type CommonFields = Common<ActivityType, TaskType>

    export let selected_object=null;
    export let mode: 'task' | 'activity';
    export let project_id: number;

    export let project_data: ProjectType;

    let edit_object: TaskType | ActivityType = null;
    let edit_mode: 'task' | 'activity';
    let create_mode=false;
    
    const default_fields: (keyof CommonFields)[] = ['name', 'plannedStartDate', 'plannedEndDate', 'actualStartDate',
                            'actualEndDate', 'description', 'plannedBudget', 'actualBudget'];
    

    // for on_click_save of Modal 
    function update(e){
        // console.log(edit_object); return;
        const method = create_mode ? 'POST' : 'PUT';
        const url_id = create_mode ? '' : `${edit_object.id}/`;

        let data = default_fields.map(field => ({[field]: edit_object[field]}))
        .reduce((a, b) => ({...a, ...b}));

        if (create_mode){
            if (edit_mode === 'activity' && edit_object.__typename == "GanttActivity"){
                data.task = edit_object.taskId;
                data.state = edit_object.state.id;
                data.assignees = edit_object.assignees;
            }
            else if (edit_mode === 'task'){
                data.project = project_data.id;
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


    const default_object: CommonFields = {
        "__typename": "GanttTask",
        "id": null,
        "name": "",
        "plannedStartDate": null,
        "plannedEndDate": null,
        "plannedBudget": "0",
        "actualStartDate": null,
        "actualEndDate": null,
        "actualBudget": "0",
        "description": ""
    }

    const flatpickr_options = {
        time_24hr: true,
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        altInput: true,
        altFormat: "M j, Y at H:i",
    }

    function createActivity(task: TaskType){
        edit_object = {...default_object, __typename: "GanttActivity"} as ActivityType;
        edit_object['task'] = task;
        edit_object['assignees'] = [];
        edit_mode = 'activity';
        create_mode = true;
    }

    function createTask(){
        edit_object = default_object as TaskType
        edit_mode = 'task';
        create_mode = true; 
    }

    function deleteTask(task_id: number){
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
    <!-- {#await awaitable then _} -->
            
        
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
                    on:click="{()=> createActivity(task)}"    
                >
                   Add New Activity
                </button>
            
            </div>
        {/each}

        <div class="px-4 w-10 min-w-max">
            <button
              class="p-4 w-full flex-nowrap whitespace-nowrap mb-6 shadow-lg rounded border-2 border-dashed border-slate-500 bg-slate-50 hover:bg-slate-100"
              on:click="{()=> createTask()}"
            >
                Add New Task
            </button>
        </div>

    <!-- {/await} -->
    </div>
</section>

{#if edit_mode}
<Modal save="true" on:click_close="{() => {edit_mode=null; edit_object=null}}" on:click_save="{update}">
    <h1 slot="header" class="px-2 font-extralight text-3xl">
        {create_mode? 'Create':'Edit'} {edit_mode==='task'? 'Task': 'Activity'}
    </h1>
<!-- TODO: change onDelete -->
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
