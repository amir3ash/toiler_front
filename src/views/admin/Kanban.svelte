<script lang="ts">
    import VariableSizedInput from '../../utils/VariableSizedInput.svelte'
    import { onMount } from 'svelte';
    import { user, search_text } from '../../stores'
    import { send_json_data } from '../../utils/get_cookie'
    import { showAlert } from '../../utils/errors';
    import AvatarDropdown from '../../components/Dropdowns/AvatarDropdown.svelte'

    import type { GetProjectQuery } from '../../gql/graphql';
    import LL from '../../i18n/i18n-svelte';

    type ProjectType = GetProjectQuery['project']
    type TaskType = ProjectType['tasks'][0]
    type ActivityType = TaskType['activities'][0]

    export let project_data: ProjectType;
    export let mode: "activity" | "task";
    export let selected_object: ActivityType | TaskType;
    mode = 'activity'

    $: TR = $LL.kanban;

    function patchOrCreateState(id:number, name: string){
        if(id){
            send_json_data(`/gantt/state/${id}/`, 'PATCH', {
                name: name,
            })
            .then(data => {
                const index = project_data.states.findIndex(o => o.id === id);
                project_data.states[index] = data;
                project_data = project_data;
            })
        }
        else {
            send_json_data('/gantt/state/', 'POST', {
                name: name,
                project: project_data.id
            })
            .then(data => {
                project_data.states=[...project_data.states, data]
                project_data = project_data
            })
        }
    }

    function deleteState(id: number){
        send_json_data(`/gantt/state/${id}/`, 'DELETE', '', true)
        .then(res => {
            if(res.ok){
                project_data.states = project_data.states.filter(o => o.id !== id)
                project_data = project_data;
            }
        })
        .catch(data => showAlert(data))
    }
</script>

<section class="w-full max-h-full overflow-auto">
    <div class="flex mt-4 pb-8 min-w-max flex-nowrap justify-start">
        {#each project_data.states as state(state.id)}
            <div class="text-center mx-2 p-2 w-72 rounded-lg bg-white shadow">
                <div class="flex p-1 mb-2 border-b border-slate-400">
                    <h3 class="w-full uppercase">
                        <VariableSizedInput value="{state.name}" on:click_enter="{e => patchOrCreateState(state.id, e.detail.value)}"/>
                    </h3>
                    <button on:click="{()=>deleteState(state.id)}" class="px-2 text-slate-300 hover:text-rose-700" aria-label="{TR.DELETE_STATE(state)}">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                
                
                {#each project_data.tasks as task}
                    
                    {#each task.activities.filter(o => (o.state && o.state.id || o.state) === state.id).filter(o=>o.name.includes($search_text)) as activity(activity.id)}
                        <div class="flex justify-between mx-1 p-2 text-left shadow-md border rounded border-lime-200">
                            <button on:click="{() =>{selected_object=activity}}">
                                {activity.name}
                            </button>
                            <div class="min-w-max p-0">
                                {#each activity.assignees as {user: assignee}}
                                    <AvatarDropdown  user="{assignee}"/>
                                    <!-- <span class="w-8 h-8 ml-auto bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                                        {#if assignee.avatar}
                                            <img class="w-full rounded-full align-middle border-none shadow-lg" src="{assignee.avatar}" alt="{assignee.username}'s avatar">
                                        {/if}
                                    </span> -->
                                {/each}
                            </div>
                        </div>
                    {/each}
                {/each}
            
            </div>
        {/each}

        <div class="text-center mx-2 p-2 w-72 rounded-lg bg-slate-50 shadow">
            <h3 class="w-full mb-2 p-1 uppercase border-b border-slate-400  ">
                <VariableSizedInput 
                    on:click_enter="{e => patchOrCreateState(null, e.detail.value)}"
                    placeholder="{TR.STATE_NAME()}"
                    min_width="110px"
                    classes="bg-slate-50"
                />
            </h3>
        </div>
        
    </div>
</section>