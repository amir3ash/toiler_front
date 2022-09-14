<script>
    import Modal from 'components/Cards/Modal.svelte'
    import ProjectDropdown from 'components/Dropdowns/ProjectDropdown.svelte'
    import ProjectCapsule from 'components/Cards/ProjectCapsule.svelte';
    import CardAddTeamMember from 'components/Cards/CardAddTeamMember.svelte';
    import { send_json_data } from '../../utils/get_cookie';
    import CardAddTeam from 'components/Cards/CardAddTeam.svelte';
    import FlatPickr from 'svelte-flatpickr'
    import Input from '../../utils/VariableSizedInput.svelte';
    import { onMount } from 'svelte';
    import { showAlert } from '../../utils/errors.js';
    import { formatedD } from '../../utils/date_util';
    

    let teams = [];
    let roles = [];
    let employees = [];
    let input_value;

    export let id = null
    
    let name = ''
    let planned_start_date = ''
	let planned_end_date = '';
	let actual_start_date = ''
	let actual_end_date = ''
	let description = '';
    
    
    function updateOrAdd(){
        let data = {
            name: name,
            planned_start_date: formatedD(planned_start_date),
            planned_end_date: formatedD(planned_end_date),
            actual_start_date: formatedD(actual_start_date),
            actual_end_date: formatedD(actual_end_date),
            description: description
        };
        if (id !== null){
            if(actual_end_date && !actual_start_date){
                showAlert('Start date can not be empty')
                return;
            }

            const url=`/gantt/project/${id}/`;
            data = {id: id, ...data}

            send_json_data(url, 'PUT', data, true).then(res => res.json())
            .then(d => {
                showAlert('Project updated', 'success')
            })
            .catch(async res => {
                if (! res !== 400){
                    showAlert('Error!');
                    return;
                }
                
                const data = await res.json().catch(() => showAlert('Error'));
                Object.entries(data)
                .map(([field, [error]]) => 
                    showAlert(`${field.replaceAll('_', ' ')}: ${error}`, 'error', 5000)
                );  
            })
        }
        else {
            const url=`/gantt/project/`;

            send_json_data(url, 'POST', data, true).then(res => res.json())
            .then(d => {
                id = d.id;
            })
            .catch(async res => {
                if (! res !== 400){
                    showAlert('Error!');
                    return;
                }
                
                const data = await res.json().catch(() => showAlert('Error'));
                Object.entries(data)
                .map(([field, [error]]) => 
                    showAlert(`${field.replaceAll('_', ' ')}: ${error}`, 'error', 5000)
                );  
            })
        }
            
    }

   

    function add_role(event){
        const role_name = event.detail.value;
        if (role_name != ''){
            send_json_data('/gantt/role/', 'POST', {project: id, name: role_name})
            .then(data => {
                roles = [...roles, {...data}]
            })
            .catch(e => {
                showAlert('Error in adding role')
            })
            
        }
    }

    function add_team(event){
        const team_name = event.detail.value;
        
        if (team_name != ''){
            send_json_data('/gantt/team/', 'POST', {project: id, name: team_name})
            .then(data => {
                teams = [...teams, {...data}];
                
            })
            .catch(e => {
                showAlert('Error in adding team')
            })
            
        }
    }

    onMount(()=>{
        const url=`/gantt/project/${id}/`;
        if (id != null){
            fetch(url)
            .then(d => d.json())
            .then(project => {
                name = project.name;
                planned_start_date = project.planned_start_date;
                planned_end_date = project.planned_end_date;
                actual_start_date = project.actual_start_date;
                actual_end_date = project.actual_end_date;
                description = project.description;
            })
            
            fetch(`/gantt/role/?project=${id}`)
            .then(d => d.json())
            .then(data => roles=data)

            fetch(`/gantt/team/?project=${id}`)
            .then(d => d.json())
            .then(data => teams=data)

            // fetch('/gantt/employee/')
            // .then(d => d.json())
            // .then(data => employees=data)
        }
    });
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
<div class="relative flex flex-wrap">
    <div class="xl:w-1/2">
  <div class="p-2 m-2 bg-white rounded-md shadow-md">
    <input
          bind:value={name}
          placeholder="Title"
          class="font-medium text-xl ml-2 mt-2 w-11/12 px-1 rounded-md bg-transparent focus:outline-none focus:border border-sky-500"
        >
    <div class="flex flex-wrap items-center">
      <div class="relative w-full max-w-full flex-grow flex-1">
        <div class="m-2">
          <div class="text-xs mt-2 text-slate-500">
                Actual:
                <div class="flex text-slate-700">
                    <FlatPickr
                        class="rounded-lg p-0 mr-2 w-24 md:w-24 focus:outline-none text-center text-sm border-slate-300"
                        bind:value={actual_start_date}
                        placeholder="Start date"
                        label="Actual Start date"
                        options="{date_options}"
                    />
                   to 
                   <FlatPickr
                        class="rounded-lg p-0 ml-2 w-24 md:w-24 focus:outline-none text-center text-sm border-slate-300"
                        bind:value={actual_end_date}
                        placeholder="End date"
                        label="Actual end date"
                    />
                </div>
          </div>
          <div class="text-xs mt-2 text-slate-500">
            Planned:
            <div class="flex text-slate-700">
                <FlatPickr
                    class="rounded-lg p-0 mr-2 w-24 md:w-24 focus:outline-none text-center text-sm border-slate-300"
                    bind:value={planned_start_date}
                    placeholder="Start date"
                    label="Planed Start date"
                    required
                />
               to 
               <FlatPickr
                    class="rounded-lg p-0 ml-2 w-24 md:w-24 focus:outline-none text-center text-sm border-slate-300"
                    bind:value={planned_end_date}
                    placeholder="End date"
                    label="Planed end date"
                    required
                />
            </div>
          </div>
          <div class="flex flex-col text-xs mt-2 text-slate-500">
            <label for="#project-desctiption">
                Description:
            </label>
            <textarea 
                class="rounded-lg p-2 focus:outline-none text-sm text-slate-700 border-slate-300"
                bind:value="{description}"
                id="project-desctiption"
            />
          </div>
          
        </div>
        <button class="px-2 m-2 rounded-md bg-rose-500 text-white" on:click="{updateOrAdd}">
            Save
        </button>
        
      </div>
    </div>
    {#if id !== null}
        
    
    <hr class="my-6">

    <div class="flex flex-col text-xs mt-4 text-slate-500">
        <div class="uppercase ml-2">
            Teams:
        </div>
        <div class="p-2 flex flex-wrap rounded-lg text-sm text-slate-700">
        
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
                        classes="px-1 rounded-md bg-transparent focus:outline-none "
                        div_padding="8px"
                        min_width="100px"
                        placeholder="New team"
                        on:click_enter="{add_team}"
                        
                    />
                </div>
            </div>
        </div>
    </div>
    
    <hr class="my-6">

    <div class="flex flex-col text-xs mt-4 text-slate-500">
        <div class="uppercase ml-2">
            Roloes:
        </div>
        <div class="p-2 flex flex-wrap rounded-lg text-sm text-slate-700">
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
                        classes="px-1 rounded-md bg-transparent focus:outline-none "
                        div_padding="8px"
                        min_width="85px"
                        placeholder="New role"
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
                {employees}
            />
        </div>
    {/if}
</div>



