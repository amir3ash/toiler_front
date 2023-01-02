<script lang="ts">
    // import Modal from 'components/Cards/Modal.svelte'
    // import ProjectDropdown from 'components/Dropdowns/ProjectDropdown.svelte'
    import ProjectCapsule from '../../components/Cards/ProjectCapsule.svelte';
    import CardAddTeamMember from '../../components/Cards/CardAddTeamMember.svelte';
    import { send_json_data } from '../../utils/get_cookie';
    // import CardAddTeam from 'components/Cards/CardAddTeam.svelte';
    import FlatPickr from 'svelte-flatpickr'
    import Input from '../../utils/VariableSizedInput.svelte';
    import { onMount } from 'svelte';
    import { showAlert } from '../../utils/errors.js';
    import { formatedD } from '../../utils/date_util';
    import { queryStore, getContextClient } from '@urql/svelte';
    import type { GetProjectForEditQuery } from '../../gql/graphql';
    import { getProjectQuery } from '../../gql/queries/editProjectQuery';
    import LL from '../../i18n/i18n-svelte';
import { dir } from '../../stores';
    
    type TeamMember = GetProjectForEditQuery['teammembers'][0]
    type Team = GetProjectForEditQuery['project']['teams'][0]
    type Role =  GetProjectForEditQuery['project']['roles'][0]
    type ProjectData = Pick<GetProjectForEditQuery['project'], 'id'|'name'|'plannedStartDate'|'plannedEndDate'|
                                                    'actualStartDate'|'actualEndDate'|'description'>

    let teams: Team[]= [];
    let roles: Role[] = [];
    let team_members: TeamMember[] = []

    let TR = $LL.editProject;

    export let id = null
    
    let name = ''
    let plannedStartDate = ''
	let plannedEndDate = '';
	let actualStartDate = ''
	let actualEndDate = ''
	let description = '';
    
    
    function updateOrAdd(){
        let data: ProjectData = {
            id: id,
            name: name,
            plannedStartDate: formatedD(plannedStartDate),
            plannedEndDate: formatedD(plannedEndDate),
            actualStartDate: formatedD(actualStartDate),
            actualEndDate: formatedD(actualEndDate),
            description: description
        };

        if (!isValidAndShowError(data))
            return

        if (id !== null){
            if(actualEndDate && !actualStartDate){
                showAlert(TR.ERR_EMPTY_ERR())
                return;
            }

            const url=`/gantt/project/${id}/`;
            data = {id: id, ...data}

            send_json_data(url, 'PUT', data, true).then(res => res.json())
            .then(d => {
                showAlert(TR.PROJECT_UPDATED(), 'success')
            })
            .catch(async res => {
                if (res !== 400){
                    showAlert('Error!');
                    return;
                }
                
                // const data = await res.json().catch(() => showAlert('Error'));
                // Object.entries(data)
                // .map(([field, [error]]) => 
                //     showAlert(`${field.replaceAll('_', ' ')}: ${error}`, 'error', 5000)
                // );  
            })
        }
        else {
            const url=`/gantt/project/`;

            send_json_data(url, 'POST', data, true).then(res => res.json())
            .then(d => {
                id = d.id;
            })
            .catch(async res => {
                if (res == 400){
                    showAlert('Error!');
                    return;
                }
                
                // const data = await res.json().catch(() => showAlert('Error'));
                // Object.entries(data)
                // .map(([field, [error]]) => 
                //     showAlert(`${field.replaceAll('_', ' ')}: ${error}`, 'error', 5000)
                // );  
            })
        }
            
    }


    function isValidAndShowError(data: ProjectData): boolean{
        let errors: string[] = []
        
        const name = data.name, now = strDateToOption('now'),
            plannedStartDate = strDateToOption(data.plannedStartDate),
            plannedEndDate = strDateToOption(data.plannedEndDate),
            actualStartDate = strDateToOption(data.actualStartDate),
            actualEndDate = strDateToOption(data.actualEndDate);
        
        if (name.length < 1)
            errors.push("Project's name can't be empty.")
        

        if (plannedStartDate > plannedEndDate)
            errors.push('Planned start date should be before Planned end date.')
        
        if (actualStartDate && actualEndDate && actualStartDate > actualEndDate)
            errors.push('Actual start date should be before Actual end date.')
        
        if (actualStartDate && (actualStartDate > now))
            errors.push('Actual start date should be before now.')
        
        if (actualEndDate){
            if (actualEndDate > now)
                errors.push('Actual start date should be before now.')
            
            if (!actualStartDate)
                errors.push('If you specified ActualEndDate, you should specify ActualStartDate.')
        }

        errors.map(error => showAlert(error))

        return errors.length == 0
    }
    

   /**
     * @returns date in milliseconds or `null`.
     * 
     * if `date` is `"now"` then returns now in milliseconds.
     * if `date` is `null`, returns `null`.
     * if date2 is not null, returns min of them
     */
     function strDateToOption(date?: string | "now", date2?: string){
        if (date === null)
            return null

        let res: number = null;
        if (date !== 'now')
            res =  new Date(date).getTime()
        else
            res = new Date().getTime()
        
        if (date2){
            let d2 = new Date(date2).getTime()
            res = d2 >= res ? res : d2;
        }
        
        return res
    }

    function add_role(event){
        const role_name: string = event.detail.value;
        if (role_name != ''){
            send_json_data('/gantt/role/', 'POST', {project: id, name: role_name})
            .then(data => {
                roles = [...roles, {...data}]
            })
            .catch(e => {
                showAlert(TR.ERR_ADDING_ROLE())
            })
            
        }
    }

    function add_team(event){
        const team_name: string = event.detail.value;
        
        if (team_name != ''){
            send_json_data('/gantt/team/', 'POST', {project: id, name: team_name})
            .then(data => {
                teams = [...teams, {...data}];
                
            })
            .catch(e => {
                showAlert(TR.ERR_ADDING_TEAM())
            })
            
        }
    }

    let projectGql = queryStore({
        client:getContextClient(),
        query: getProjectQuery,
        variables: {id: id},
        pause: true
    });

    onMount(()=>{
        if (id != null){
            projectGql.resume()
        }
    });

    let canLoad = true
    $: if (canLoad && $projectGql.data){
        const p = $projectGql.data.project;
        name = p.name;
        plannedStartDate = formatedD(p.plannedStartDate);
        plannedEndDate = formatedD(p.plannedEndDate);
        actualStartDate = formatedD(p.actualStartDate);
        actualEndDate = formatedD(p.actualEndDate);
        teams = p.teams;
        roles = p.roles;
        team_members = $projectGql.data.teammembers
        canLoad = false;
    } else if ($projectGql.error){
        showAlert(TR.ERR_GETTING_PROJECT())
    }

    const date_options = {
        // dateFormat: 'Y',
    //     altInput: true,
    // altFormat: "H:i K",
    // dateFormat: "U",
    }
</script>
<!-- <FlatPickr
              class="rounded-lg p-0 ml-2 w-24 md:w-20 focus:outline-none text-center text-xs border-slate-300"
              bind:value={planned_end_date}
              placeholder="End date"
              label="Planed end date"
              required
            /> -->
<!-- <Modal>
    <h6 slot="header" class="text-lg m-2 font-medium">
        Edit the name of employee
    </h6>
    <div class="p-2">
        hello
    </div>
</Modal> -->
<div class="relative flex flex-wrap" dir="{$dir}">
    <div class="xl:w-1/2">
  <div class="p-2 m-2 bg-white rounded-md shadow-md dark:bg-slate-900">
    <input
          bind:value={name}
          placeholder="{$LL.TITLE()}"
          class="font-medium text-xl ml-2 mt-2 w-11/12 px-1 rounded-md bg-transparent focus:outline-none focus:border border-sky-500"
        >
    <div class="flex flex-wrap items-center">
      <div class="relative w-full max-w-full flex-grow flex-1">
        <div class="m-2">
          <div class="text-xs mt-2 text-slate-500 dark:text-slate-300">
            {$LL.PLANNED()}:
            <div class="flex text-slate-700 dark:text-slate-300">
                <FlatPickr
                    class="rounded-lg p-0 mr-2 w-24 md:w-24 focus:outline-none text-center text-sm border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                    bind:value={plannedStartDate}
                    placeholder="{TR.START_DATE()}"
                    label="{TR.PLANNED_START_DATE()}"
                    options="{{...date_options, maxDate: strDateToOption(plannedEndDate)}}"
                    required
                />
               {$LL.TO()} 
               <FlatPickr
                    class="rounded-lg p-0 ml-2 w-24 md:w-24 focus:outline-none text-center text-sm border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                    bind:value={plannedEndDate}
                    placeholder="{TR.END_DATE()}"
                    label="{TR.PLANNED_END_DATE()}"
                    options="{{...date_options, minDate: strDateToOption(plannedStartDate)}}"
                    required
                />
            </div>
          </div>
          <div class="text-xs mt-2 text-slate-500 dark:text-slate-300">
                {$LL.ACTUAL()}:
                <div class="flex text-slate-700 dark:text-slate-300">
                    <FlatPickr
                        class="rounded-lg p-0 mr-2 w-24 md:w-24 focus:outline-none text-center text-sm border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                        bind:value={actualStartDate}
                        placeholder="{TR.START_DATE()}"
                        label="{TR.ACTUAL_START_DATE()}"
                        options="{{...date_options, maxDate: strDateToOption('now', actualEndDate)}}"
                        />
                   {$LL.TO()} 
                   <FlatPickr
                        class="rounded-lg p-0 ml-2 w-24 md:w-24 focus:outline-none text-center text-sm border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                        bind:value={actualEndDate}
                        placeholder="{TR.END_DATE()}"
                        label="{TR.ACTUAL_END_DATE()}"
                        options="{{...date_options, minDate: strDateToOption(actualStartDate), maxDate: strDateToOption('now')}}"
                    />
                </div>
          </div>
          <div class="flex flex-col text-xs mt-2 text-slate-500 dark:text-slate-300">
            <label for="#project-desctiption">
                {$LL.DESCRIPTION()}:
            </label>
            <textarea 
                class="rounded-lg p-2 focus:outline-none text-sm text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                bind:value="{description}"
                id="project-desctiption"
            />
          </div>
          
        </div>
        <button class="px-2 m-2 rounded-md bg-rose-500 text-white dark:bg-rose-700" on:click="{updateOrAdd}">
            {$LL.SAVE()}
        </button>
        
      </div>
    </div>
    {#if id !== null}
        
    
    <hr class="my-6">

    <div class="flex flex-col text-xs mt-4 text-slate-500 dark:text-slate-300">
        <div class="uppercase ml-2">
            {TR.TEAMS()}:
        </div>
        <div class="p-2 flex flex-wrap rounded-lg text-sm text-slate-700 dark:text-slate-300">
        
            {#each teams as team}
                <ProjectCapsule
                    bind:name="{team.name}"
                    id="{team.id}"
                    mode="team"
                />
            {/each}
            
            <div class="py-0 pl-2 m-1 inline-flex rounded-xl w-fit border border-rose-400">
                <div class="py-1" >
                    <Input
                        classes="px-1 rounded-md bg-transparent focus:outline-none placeholder-red-500"
                        div_padding="8px"
                        min_width="100px"
                        placeholder="{TR.NEW_TEAM()}"
                        on:click_enter="{add_team}"
                    />
                </div>
            </div>
        </div>
    </div>
    
    <hr class="my-6">

    <div class="flex flex-col text-xs mt-4 text-slate-500 dark:text-slate-300">
        <div class="uppercase ml-2">
            {TR.ROLES()}:
        </div>
        <div class="p-2 flex flex-wrap rounded-lg text-sm text-slate-700 dark:text-slate-300">
            {#each roles as role}
                <ProjectCapsule
                    bind:name="{role.name}"
                    id="{role.id}"
                    mode="role"
                />
            {/each}
            <div class="py-0 pl-2 m-1 inline-flex rounded-xl w-fit border border-teal-400">
                <div class="py-1" >
                    <Input
                        classes="px-1 rounded-md bg-transparent focus:outline-none placeholder-teal-500"
                        div_padding="8px"
                        min_width="85px"
                        placeholder="{TR.NEW_ROLE()}"
                        on:click_enter="{add_role}"
                        
                    />
                </div>
            </div>
        </div>
    </div>
    {/if}
  </div>
  </div>
  

<!-- 
  <div class="lg:w-1/2">
    <div class="p-2 m-2 bg-white rounded-md shadow-md">
      <h6 class="ml-2 mt-2 px-1 text-lg uppercase">
        Employees
      </h6>
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <div class="m-2">
              <button>copy</button>
            <div class="flex mt-2 text-slate-700 text-sm">
              {#each employees as {name}}
                <div class="py-0 pl-2 m-1 inline-flex rounded-xl w-fit border border-cyan-400">
                    <div class="py-1">
                        {name}
                    </div>
                    <button class="text-cyan-500 py-1 px-2">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
              {/each}
            </div>
            
          </div>
          
        </div>
      </div>
    
    </div>
    </div> -->




    <!-- <div class="lg:w-1/2">
        <CardAddTeam project_id="{id}"/>
    </div> -->
    {#if id !== null}
        <div class="w-full xl:w-1/2">
            <CardAddTeamMember 
                project_id="{id}"
                {teams}
                {roles}
                {team_members}
            />
        </div>
    {/if}
</div>



