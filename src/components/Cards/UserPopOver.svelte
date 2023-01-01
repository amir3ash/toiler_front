<script lang="ts">
import type { UserUser } from "../../gql/graphql";

export let user: UserUser;
</script>
  
<div class="m-2 w-80 rounded-lg shadow-lg bg-white dark:bg-black">
    <div class="w-full h-12 bg-blue-500 rounded-t-lg"></div>
    <div class="flex -mt-10 px-2 pb-2">
        <div>
            <span class="w-20 h-20 bg-blueGray-200 dark:bg-blueGray-800 inline-flex items-center justify-center rounded-full" aria-hidden="true">
                {#if user.avatar}
                    <img class="w-full rounded-full align-middle border-none shadow-lg" src="{user.avatar}" alt="" aria-hidden="true">
                {/if}
            </span>
        </div>
        <div class="ml-1 text-slate-700 dark:text-slate-400">
            <h3 class="mt-3 pl-1 font-bold text-xl capitalize text-white">
                {user.firstName} {user.lastName || ''}
            </h3>
            <div>
                @{user.username}
            </div>
        </div>
    </div>
   
</div>
  
