<script lang="ts">
  import Select from 'svelte-select'
  import ProjectDropdown from 'components/Dropdowns/ProjectDropdown.svelte'
import { escape, onMount } from 'svelte/internal';
import { send_json_data } from '../../utils/get_cookie';
import { showAlert } from '../../utils/errors';
import UserItem from 'components/Cards/UserItem.svelte'
import { queryStore, gql, getContextClient } from '@urql/svelte';
import type { GanttTeammember } from '../../gql/graphql';
import LL from '../../i18n/i18n-svelte';

  let TR = $LL.addTeamMembers;

  export let project_id: number;
  export let teams=[];
  export let roles = [];

  export let team_members: GanttTeammember[] = [];

  let selected_team = null;
  let selected_role = null;
  let selected_employee = null;

  function getUserByUsername(username){
    return fetch(`/user/search_users?search=${username}`)
    .then(r => {
      if (r.ok)
        return r.json().then(json => {
          console.log(json, team_members)
          return json
        })
    })
  }
  
  function add_team_member(event){
    if (selected_employee === null || selected_role === null || selected_team === null)
      return;
    console.log(selected_employee)
    const data = {
      team: selected_team.id,
      role: selected_role.id,
      user: selected_employee.id
    }

    send_json_data('/gantt/team-member/', 'POST', data)
    .then(data => {
      get_team_members();
      showAlert(TR.TEAM_MEMBER_ADDED(), 'success')
    })
    .catch(e => {
      console.error(e);
      showAlert(e)
    })
  }

  function get_team_members(){
    fetch('/gantt/team-member/?verbose=true')
      .then(d => d.json())
      .then(data => {
          team_members = data
      })
  }

  function uniqBy<T, K>(a: T[], key: (b: T)=>K) {
    let seen = new Set<K>();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
  }
</script>

<div class="p-2 m-2 bg-white rounded-md shadow-md">
    <h6 class="ml-2 mt-2 px-1 text-lg uppercase">
        {TR.TEAM_MEMBERS()}
    </h6>
    <div class="flex flex-wrap items-center">
      <div class="relative w-full max-w-full flex-grow flex-1">
        <div class="m-2">
          <div class="text-xs mt-2 uppercase text-slate-500">
                <div class="mt-1 flex flex-wrap text-slate-700 themed">
                    <lable class="mb-3 flex flex-col w-full lg:p-1 lg:w-1/2">
                        {TR.TEAM()}:
                        <Select
                            inputStyles="--tw-ring-color: transparent"
                            containerClasses="rounded-xl pl-1 p-1 pr-2 mr-2  text-sm"
                            placeholder="{TR.TEAM_NAME()}"
                            items="{teams.map(({name, ...rest}) => ({name:escape(name), ...rest}))}"
                            optionIdentifier="id"
                            labelIdentifier="name"
                            bind:value={selected_team}
                        />
                    </lable>

                    <lable class="mb-3 flex flex-col w-full lg:p-1 lg:w-1/2">
                        {TR.ROLE()}:
                        <Select
                            inputStyles="--tw-ring-color: transparent"
                            containerClasses="rounded-xl pl-1 p-1 pr-2 mr-2  text-sm"
                            placeholder="{TR.ROLE_NAME()}"
                            items="{roles.map(({name, ...rest}) => ({name:escape(name), ...rest}))}"
                            optionIdentifier="id"
                            labelIdentifier="name"
                            bind:value={selected_role}
                        />
                    </lable>

                    <lable class="mb-3 flex flex-col w-full lg:p-1 lg:w-1/2">
                        {TR.EMPLOYEE()}:
                        <Select
                            inputStyles="--tw-ring-color: transparent"
                            containerClasses="rounded-xl pl-1 p-1 pr-2 mr-2  text-sm"
                            placeholder="{TR.EMPLOYEE_USERNAME()}"
                            optionIdentifier="id"
                            getOptionLabel="{u => escape(u.username)}"
                            getSelectionLabel="{u => escape(u.username)}"
                            loadOptions="{getUserByUsername}"
                            bind:value={selected_employee}
                            Item="{UserItem}"
                        />
                    </lable>
                    <div class="mb-3 flex flex-col-reverse  lg:p-1 ">
                        <button
                            class="px-4 py-1 mb-0.5 text-center text-sm rounded-xl  shadow border border-slate-300 hover:bg-slate-50"
                            on:click="{add_team_member}"
                        >{$LL.ADD()}</button>
                    </div>
                   
                </div>
          </div>
          
          <div class="flex flex-col text-xs mt-4 text-slate-500">
            <div class="uppercase">
                {#if selected_team}
                  {TR.TEAM_TEAMMEMBERS(selected_team)}
                {:else}
                  {TR.TEAM_MEMBERS()}
                {/if}
                 :
            </div>
            <div class="p-2 flex flex-wrap rounded-lg text-sm text-slate-700">
                {#each uniqBy(team_members.filter(o => selected_team==null || o.team.id === selected_team.id), o => o.user.id) as {user}}

                <div class=" pl-1 m-1 inline-flex rounded-xl text w-fit border border-teal-400">
                  <span class="my-1 mr-1 w-5 h-5 bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                    <img class="w-full rounded-full align-middle border-none shadow-lg" src="{user.avatar}" alt="">
                  </span>
                    <div class="py-1">
                        {user.username}
                    </div>
                    <ProjectDropdown 
                        toggle_classes="text-teal-500 py-1 px-2"
                        edit_btn_name="{$LL.EDIT()}"
                        on:click_delete="{()=>{alert(3)}}"
                        on:click_edit="{()=>{alert(5)}}"
                    />
                      
                  </div>
                {/each}
            
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  
  </div>

<style>
    .themed {
        --borderRadius: 0.75rem;
        --padding: 0px 8px;
        --selectedItemPadding: 0px 10px 0px 0px;
        /* --border: 0px; */
        --height: 2rem;
    }
</style>