<script>
    import { link } from "svelte-routing";
    import { show_sidebar } from "../../stores";

    export let location;

    const urls = {
        'index': '',
        'projects': '/f/projects',
        'assigned': '/f/assigned',
        'settings': '/f/settings',
        // 'tables': '/f/tables/',
        'logout': '/user/logout'
    };
    let active = Object.entries(urls)
                .reduce((previousValue, [name]) => ({[name]: false, ...previousValue}), {});
    const falseActive = {...active};

    function update(pathname){
        try {
            const [name, ] = Object.entries(urls)
            .filter(([, url]) => pathname === url)
            .at(0);

            active = {...falseActive, [name]: true}
        } catch (e) {}
    }

    $: update(location.pathname)

    function handle_page(node){
        // const handleClick = (event) => {
        //     let tag_a;
        //     if (node.tagName === 'A')
        //         tag_a = node;
        //     else if (node.parentNode.tagName === 'A')
        //         tag_a = node.parentNode;
        //     else
        //         return;

        //     if (location.href.indexOf(tag_a.href) == 0){
        //         tag_a.classList.remove('text-gray-900');
        //         tag_a.classList.add('text-red-500');

        //         node.classList.remove('text-gray-500');
        //         node.classList.add('text-red-500');
        //     }
        // }
        
        // document.addEventListener("click", handleClick, true);

        // return {
        //     destroy() {
        //         document.removeEventListener("click", handleClick, true);
        //     }
	    // }
    }
</script>

<aside 
  class="fixed  lg:static z-2 lg:h-auto h-full w-64 bg-gray-100  shadow-xl transition-all -translate-x-full lg:translate-x-0"
  aria-label="Sidebar"
  class:-translate-x-full="{!$show_sidebar}"
>
    <div class="overflow-y-auto py-4 px-3 mt-14 rounded">
        <div class="flex justify-end lg:hidden">
            <button class="bg-gray-200 rounded-full py-0 px-1.5" on:click="{() => $show_sidebar=false}">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>
        <ul class="space-y-2 mt-2 lg:mt-0">
        <!-- <li>
            <a use:link href="{urls['dashboard']}" class="flex items-center p-2 uppercase text-sm font-normal  text-blueGray-600 rounded-lg  hover:bg-gray-100 ">
                <svg use:handle_page class="w-6 h-6 text-gray-500 transition duration-75 op group-hover:text-gray-900 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                <span class="ml-3">Dashboard</span>
            </a>
        </li> -->
        <li>
            <a use:link href="{urls['projects']}" class="flex items-center p-2 uppercase text-sm font-normal text-blueGray-600 rounded-lg   hover:bg-gray-100  ">
                <i use:handle_page class="fa fa-business-time flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75   group-hover:text-gray-900" aria-hidden="true"></i>
                <span class="flex-1 ml-3 whitespace-nowrap">Projects</span>
                <!-- <span class="inline-flex justify-center items-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full    ">Pro</span> -->
            </a>
        </li>
        <li>
            <a use:link href="{urls['assigned']}" class="flex items-center p-2 uppercase text-sm font-normal text-blueGray-600 rounded-lg   hover:bg-gray-100  ">
                <i use:handle_page class="fa fa-calendar-check flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75   group-hover:text-gray-900" aria-hidden="true"></i>
                <span class="flex-1 ml-3 whitespace-nowrap">Assigned</span>
                <!-- <span class="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full    ">3</span> -->
            </a>
        </li>
        <li>
            <a use:link href="{urls['settings']}" class="flex items-center p-2 uppercase text-sm font-normal text-blueGray-600 rounded-lg   hover:bg-gray-100  ">
                <i use:handle_page class="fa fa-cogs flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75   group-hover:text-gray-900" aria-hidden="true"></i>
                <span class="flex-1 ml-3 whitespace-nowrap">Settings</span>
                <!-- <span class="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full    ">3</span> -->
            </a>
        </li>
       
        <!-- <li>
            <a use:link href="{urls['tasks']}" class="flex items-center p-2 uppercase text-sm font-normal text-blueGray-600 rounded-lg   hover:bg-gray-100  ">
                <svg use:handle_page class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75   group-hover:text-gray-900  " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                <span class="flex-1 ml-3 whitespace-nowrap">Tasks</span>
            </a>
        </li> -->
        <!-- <li>
            <a use:link href="#" class="flex items-center p-2 uppercase text-sm font-normal text-blueGray-600 rounded-lg   hover:bg-gray-100  ">
                <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75   group-hover:text-gray-900  " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>
                <span class="flex-1 ml-3 whitespace-nowrap">Products</span>
            </a>
        </li> -->
        <!-- <li>
            <a use:link href="#" class="flex items-center p-2 uppercase text-sm font-normal text-blueGray-600 rounded-lg   hover:bg-gray-100  ">
                <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75   group-hover:text-gray-900  " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path></svg>
                <span class="flex-1 ml-3 whitespace-nowrap">Sign In</span>
            </a>
        </li> -->
        <li>
            <a href="{urls['logout']}" class="flex items-center p-2 uppercase text-sm font-normal text-blueGray-600 rounded-lg   hover:bg-gray-100  ">
                <i class="fa fa-door-closed flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75   group-hover:text-gray-900" aria-hidden="true"></i>
                <span class="flex-1 ml-3 whitespace-nowrap">Log out</span>
            </a>
        </li>
        </ul>
    </div>
</aside>
   