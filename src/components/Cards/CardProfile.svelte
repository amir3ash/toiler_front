<script>
  import { Link } from "svelte-routing";
  import { user } from '../../stores';
  import { getCookie } from '../../utils/get_cookie'
  import LL from '../../i18n/i18n-svelte'

  $: TR = $LL.settings;

  let projects = [];
  let team_members = [];
  let files = null;

  $: if (files) try {
        const formData = new FormData();
        formData.append('csrfmiddlewaretoken', getCookie('csrftoken'))
        formData.append('avatar', files[0])

        fetch('/user/avatar', {
            method: 'POST',
            body: formData
        })
        .then(response => {
          response.json().then(data => {$user.avatar=data.avatar; $user=$user});
          // showAlert('Avatar changed', 'success')
          files=null;
        });

    } catch (error) {
        console.error(error);
        files=null;
    }

  async function getProjects(){
    const url='/gantt/project/'
    projects = (await fetch(url).then(res => res.json())).slice(0, 10);
  }

  function get_team_members(){
    fetch('/gantt/team-member/?verbose=true')
      .then(d => d.json())
      .then(data => {
          team_members = data.slice(0, 10) //.sort(
            // (a, b) => a.employee.name.localeCompare(b.employee.name)
            // );
      })
  }
</script>

<div
  class="relative flex flex-col min-w-0 break-words bg-white dark:bg-slate-900 w-full mb-6 shadow-xl rounded-lg mt-16"
>
  <div class="px-6">
    <div class="flex flex-wrap justify-center">
      <div class="w-full px-4 justify-center hidden lg:flex">
        <div class="flex relative rounded-full justify-center flex-col w-32 h-32 -m-16 -ml-20 lg:-ml-16" >
          <img
            alt="{TR.YOUR_AVATAR()}"
            src="{$user.avatar}"
            class="bg-white dark:bg-black shadow-xl rounded-full h-full text-transparent items-center align-middle border-none absolute w-32"
          />
          
          <button class="absolute w-full h-full rounded-full text-lg font-medium opacity-0 hover:opacity-100 hover:bg-white dark:hover:bg-neutral-900 hover:bg-opacity-50"
            on:click="{e => e.target.children.avatar && e.target.children.avatar.click()}"
          >
          <input name="avatar" hidden="hidden" type="file" accept="image/png, image/jpeg" bind:files/>
            {TR.UPLOAD()}
          </button>
        </div>
      </div>
      
    </div>
    <div class="mt-4 lg:mt-20">
      <h3 class="text-xl font-semibold leading-normal mb-2 text-blueGray-700 dark:text-neutral-400">
        {TR.PROJECTS_IN_SETTINGS()}
      </h3>
      {#await getProjects()}
        waiting
      {:then _ } 

        {#each projects as {name, id}}

          <Link to="{`/f/view/${id}/`}" class="w-full block mx-2 my-1.5 px-2 py-1 border border-fuchsia-300 dark:border-fuchsia-700 rounded-md text-left text-base font-medium text-slate-800 dark:text-slate-300">
            {name}
          </Link>
          
        {/each}

      {/await}
    </div>
    <div class="mt-8 py-7 border-t border-blueGray-200 dark:border-slate-600">
      <h3 class="text-xl font-semibold leading-normal mb-2 text-blueGray-700 dark:text-neutral-400">
        {TR.TEAMMATES_IN_SETTINGS()}
      </h3>
      {#await get_team_members()}
        waiting...
      {:then _}

      {#each team_members as {user, team, role}}
        {@const name = user.firstName + (' ' + user.lastName || '')}

          <div class="flex content-center w-full mx-2 my-1.5 px-2 py-1 border border-fuchsia-300 dark:border-fuchsia-700 rounded-lg text-left text-base font-medium text-slate-800">
            <span class="w-8 h-8 text-sm text-white bg-blueGray-200 dark:bg-slate-800 inline-flex items-center justify-center rounded-full">
              <img alt="" aria-hidden="true" class="w-full rounded-full text-transparent align-middle border-none shadow-lg" src="{user.avatar}">
            </span>
            <div class="pl-2 dark:text-slate-300">
              <div>
                {name}
              </div>
              <!-- <div>
                {team.name}
              </div> -->
              <div class="text-xs text-slate-400">
                {role.name}
              </div>  
            </div>
          </div>
          
        {/each}

      {/await}
    </div>
  </div>
</div>
