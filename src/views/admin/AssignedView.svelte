<script lang="ts">
    import { dir, search_text } from '../../stores'
    import SideBarDetail from '../../components/Cards/SideBarDetail.svelte'
    import { queryStore, getContextClient, } from '@urql/svelte';
    import type { AssignedToMeQuery } from '../../gql/graphql';
    import { assignedToMeQuery } from '../../gql/queries/assigned';
    import LL from '../../i18n/i18n-svelte';

    type AssignedType = AssignedToMeQuery['assignedToMe'][0]
    type ActivityType = AssignedType['activity'] & {'redStatus': boolean}

    const now = new Date();

    let assignededToMeActivities: ActivityType[] = [];
    let selected_object: ActivityType = null;
    let project_id: number = null;

    
    let assignedToMeGql = queryStore({
        client:getContextClient(),
        query: assignedToMeQuery
    });

    $: if ($assignedToMeGql.data){
        assignededToMeActivities = $assignedToMeGql.data.assignedToMe.map(a=> a.activity).map(
            (activity: ActivityType) => {
                const end_date = new Date(activity.plannedEndDate);
                activity.plannedEndDate = end_date
                activity.redStatus = end_date < now;

                return activity;
            }
        )
    }


    function onDelete(e){
        const activity_id: number = e.detail.id;
        assignededToMeActivities=assignededToMeActivities.filter(o => o.id !== activity_id);
        selected_object=null
    }
</script>

<svelte:head>
    <title>Toiler - Assigned To Me</title>
</svelte:head>

{#if selected_object}
    <div class="absolute mt-24 w-80 z-2 right-0 top-0 rounded-lg shadow-lg bg-white dark:bg-slate-900 transition-all duration-500 translate-x-0">
        <SideBarDetail
            bind:object="{selected_object}"
            on:close="{() => selected_object=null}"
            on:delete="{onDelete}"
            mode="activity"
            project_id="{project_id}"
        />
    </div>
{/if}


<section class="flex flex-wrap">
    {#if $assignedToMeGql.fetching}
        fetching...
    {:else if $assignedToMeGql.error}
        {$assignedToMeGql.error.message}
    {:else}
        {#each assignededToMeActivities.filter(o=>o.name.includes($search_text) || o.task.project.name.includes($search_text)) as activity(activity.id)}
            <div class="w-full lg:w-1/2">
                <div class="flex flex-wrap m-2 p-2 rounded-lg shadow-lg bg-white dark:bg-slate-900">
                    <h3 class="text-lg text-slate-700 dark:text-slate-300">
                        <button
                            class="text-left px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                            on:click="{()=>{selected_object=activity; project_id=activity.task.project.id;}}"
                        >
                            {activity.name}
                        </button>
                    </h3>
                    <div class="ml-auto flex flex-wrap">
                        <span class="inline-block h-6 px-2 max-w-[10rem] text-ellipsis overflow-hidden rounded-full border border-zinc-300 dark:border-zinc-700">
                            {activity.task.project.name}
                        </span>
                        <span dir="{$dir}" class="inline-block h-6 ml-1 px-2 rounded-full whitespace-nowrap border {activity.redStatus?'border-red-300 dark:border-red-700':'border-sky-300 dark:border-sky-700'}">
                            {$LL.assignedToMe.DATE({d:activity.plannedEndDate})}
                        </span>
                    </div>
                </div>
            </div>
        {/each}
    {/if}
</section>