<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let value = [];
    export let activeValue = undefined;
    export let isDisabled = false;
    export let multiFullItemClearable = false;
    export let getSelectionLabel = undefined;

    function handleClear(i, event) {
        event.stopPropagation();
        dispatch('multiItemClear', { i });
    }
</script>


{#each value as item, i}
     <div class="flex my-1 px-2 py-1  items-center text-ellipsis overflow-hidden whitespace-nowrap rounded-full bg-zinc-100 dark:bg-zinc-700">
        <span aria-hidden="true" class="w-6 h-6 bg-slate-200 dark:bg-slate-800 inline-flex items-center justify-center rounded-full">
            <img class="w-full rounded-full align-middle border-none shadow-lg" src="{item.avatar}" alt="">
        </span>
        <div class="overflow-hidden text-ellipsis whitespace-nowrap">
            <div class="inline-block ml-1">{item.username}</div>
        </div>
        {#if !isDisabled && !multiFullItemClearable}
            <button 
                class="ml-1 bg-transparent text-2xl font-semibold leading-none outline-none focus:outline-none hover:text-orange-700"
                aria-label="delete selected item"
                on:click="{e => handleClear(i, e)}"
            >
                <span>×</span>
            </button>
        {/if}
    </div>

    
{/each}