<script lang="ts">
    import ProjectDropdown from '../Dropdowns/ProjectDropdown.svelte'
    import Input from '../../utils/VariableSizedInput.svelte';
    import { send_json_data } from '../../utils/get_cookie';
    import LL from '../../i18n/i18n-svelte';


    export let name = '';
    export let id: number;
    export let mode: 'team'| 'role';

    let editable = false;
    let editInputPlaceholder = ''
    
    let border_color;
    let btn_color;
    let update_url;

    switch (mode) {
        case 'team':
            border_color = 'border-rose-400';
            btn_color = 'text-rose-500';
            update_url = `/gantt/team/${id}/`;
            editInputPlaceholder = $LL.addTeamMembers.TEAM_NAME()
            break;
        
        case 'role':
            border_color = 'border-teal-400';
            btn_color = 'text-teal-500';
            update_url = `/gantt/role/${id}/`;
            editInputPlaceholder = $LL.addTeamMembers.ROLE_NAME()
            break;

        default:
            break;
    }

    function update(event){
        const input_text = event.detail.value;
        if (input_text == '' || input_text == name){
            editable = false;
            return;
        }

        send_json_data(update_url, 'PATCH', {name: input_text})
        .then(data => {
            name = data.name
        })
        .finally(() => {
            editable = false
        })  
    }
</script>

<div dir="ltr" class="py-0 pl-2 m-1 inline-flex rounded-xl w-fit border justify-center items-center {border_color}">
    {#if editable}
        <Input
            classes="px-1 rounded-md bg-transparent focus:outline-none"
            div_padding="8px"
            min_width="100px"
            placeholder="{editInputPlaceholder}"
            on:click_enter="{update}"
            value="{name}"
            on:click_outside="{() => editable=false}"
        />
    {:else}
        <div class="py-1">
            {name}
        </div>
        <ProjectDropdown
            toggle_classes="py-1 px-2 {btn_color}"
            edit_btn_name="{$LL.editProject.EDIT_NAME()}"
            on:click_delete="{()=>{alert(3)}}"
            on:click_edit="{() => editable=true}"
        />
    {/if}
</div>