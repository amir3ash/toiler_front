<script>
    import { search_text } from '../../stores'
    import SideBarDetail from 'components/Cards/SideBarDetail.svelte'

    let assignedes_to_me = [];
    const formatter = Intl.DateTimeFormat('en', {year: "numeric", day: "numeric", month: "short"});
    const now = new Date();

    fetch(`/gantt/assigned_to_me/`).then(res => res.json())
    .then(data =>{
        assignedes_to_me=data.map(activity => {
            const end_date = new Date(activity.planned_end_date);
        
            activity.planned_end_date = formatter.format(end_date);
            
            activity.red_status = end_date < now;

            return activity;
        });
    })
    .catch(e => console.error(e))

    let selected_object=null;
    let project_id=null;

    function onDelete(e){
        const activity_id = e.detail.id;
        assignedes_to_me=assignedes_to_me.filter(o => o.id !== activity_id);
        selected_object=null
    }
</script>

{#if selected_object}
    <div class="absolute mt-24 w-80 z-2 right-0 top-0 rounded-lg shadow-lg bg-white transition-all duration-500 translate-x-0">
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
    {#each assignedes_to_me.filter(o=>o.name.includes($search_text) || o.project.includes($search_text)) as activity(activity.id)}
        <div class="w-full lg:w-1/2">
            <div class="flex flex-wrap m-2 p-2 rounded-lg shadow-lg bg-white">
                <h3 class="text-lg text-slate-700">
                    <button
                        class="text-left"
                        on:click="{()=>{selected_object={id: activity.id}; project_id=activity.project_id;}}"
                    >
                        {activity.name}
                    </button>
                </h3>
                <div class="ml-auto flex flex-wrap">
                    <span class="inline-block h-6 px-2 max-w-[10rem] text-ellipsis overflow-hidden rounded-full border border-zinc-300">
                        {activity.project}
                    </span>
                    <span class="inline-block h-6 ml-1 px-2 rounded-full whitespace-nowrap border {activity.red_status?'border-red-300':'border-sky-300'}">
                        {activity.planned_end_date}
                    </span>
                </div>
            </div>
        </div>
    {/each}
</section>