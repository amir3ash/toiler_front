<script lang="ts">
    import { Link } from "svelte-routing";
    import type { RouteLocation } from "svelte-routing/types/Route";
    import LL from "../../i18n/i18n-svelte";
    import { show_sidebar } from "../../stores";

    export let location: RouteLocation;

    type UrlName = 'index'|'projects'|'assigned'|'settings'|'logout'

    type Url = {
        name: UrlName,
        url: string,
        renderedTitle: () =>string,
        icon: string,
        isActive: boolean
    }

    let urls: Url[] = [];

    $: urls = [
        {name:'projects', url: '/f/projects', renderedTitle: $LL.navigationSidebar.PROJECTS, icon: 'fa-business-time', isActive: false},
        {name:'assigned', url: '/f/assigned', renderedTitle: $LL.navigationSidebar.ASSIGNED, icon: 'fa-calendar-check', isActive: false},
        {name:'settings', url: '/f/settings', renderedTitle: $LL.SETTINGS, icon: 'fa-cogs', isActive: false},
        // {name:'logout', url: '/user/logout', renderedTitle: $LL.navigationSidebar.LOG_OUT, icon: 'fa-door-closed', isActive: false},
    ];
    
    function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
        const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;
        // console.log('loc:',location,'href:', href,'part:', isPartiallyCurrent, isCurrent,'active:', isActive)
        urls = urls.map(o => {
            if (o.url === href)
                o.isActive = isActive
            return o
        })
        // The object returned here is spread on the anchor element's attributes
        return {};
    }
</script>

<aside 
  class="fixed lg:hover:fixed lg:static z-2 lg:h-auto h-full lg:w-16 hover:w-auto top-0 bottom-0 bg-gray-100 dark:bg-gray-800 shadow-xl transition-all -translate-x-full lg:translate-x-0"
  aria-label="{$LL.navigationSidebar.SIDEBAR()}"
  class:-translate-x-full="{!$show_sidebar}"
>
    <div class="overflow-y-auto py-4 px-3 mt-14 rounded">
        
        <div class="flex justify-end lg:hidden">
            <button class="bg-gray-200 dark:bg-gray-600 rounded-full py-0 px-1.5" on:click="{() => $show_sidebar=false}">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <ul class="space-y-2 mt-2 lg:mt-0">

            {#each urls as url}
                <li>
                    <Link to="{url.url}" getProps="{getProps}" class="flex items-center p-2 uppercase text-sm font-normal text-blueGray-600 rounded-lg dark:text-blueGray-400 hover:bg-gray-300 dark:hover:bg-gray-600">
                        <i class="fa {url.icon} flex flex-shrink-0 w-6 h-6 text-gray-500  items-center transition duration-75   group-hover:text-gray-900"
                            aria-hidden="true"
                            class:dark:text-slate-300="{url.isActive}"
                            class:text-blue-900="{url.isActive}"
                        ></i>
                        <span class="flex-1 ml-3 whitespace-nowrap overflow-hidden"
                            class:dark:text-slate-200="{url.isActive}"
                        >
                            {url.renderedTitle()}
                        </span>
                    </Link>
                </li>
            {/each}

            <li>
                <a href="/user/logout" class="flex items-center p-2 uppercase text-sm font-normal text-blueGray-600 rounded-lg dark:text-blueGray-400 hover:bg-gray-300 dark:hover:bg-gray-600">
                    <i class="fa fa-door-closed flex flex-shrink-0 w-6 h-6 text-gray-500  items-center transition duration-75   group-hover:text-gray-900"
                        aria-hidden="true"
                    ></i>
                    <span class="flex-1 ml-3 whitespace-nowrap overflow-hidden">
                        {$LL.navigationSidebar.LOG_OUT()}
                    </span>
                </a>
            </li>
       
        </ul>
    </div>
</aside>

<style>
    @media (min-width: 1024px){
        :global(aside:hover + div){
            margin-left: 4rem;
        }
    
        aside {
            max-width: 4rem;
            transition: max-width 0.5s;
        }
        aside:hover {
            max-width: 16rem;
            transition: max-width 0.5s;
        }
    }
</style>
   