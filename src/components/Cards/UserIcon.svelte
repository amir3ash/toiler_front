<script>
    export let avatar;
    export let show = true;
</script>

{#if show}
    <span class="w-6 h-6 bg-slate-200 dark:bg-slate-700 inline-flex items-center justify-center rounded-full" aria-hidden="true">
        <img class="w-full rounded-full align-middle border-none shadow-lg" src="{avatar}">
    </span>
{/if}