<script>
  import { onMount } from 'svelte';
  import { user } from '../stores'

  import {Router, Route} from "svelte-routing";

  // components for this layout
  import AdminNavbar from "components/Navbars/AdminNavbar.svelte";
  import TailwindSidebar from "components/Sidebar/TailwindSidebar.svelte";

  import Settings from "views/admin/Settings.svelte";
  import GanttView from "views/admin/GanttView.svelte"
  import ProjectView from "views/admin/ProjectsView.svelte"
  import EditProject from "views/admin/EditProject.svelte"
  import ShowError from "views/admin/ShowError.svelte";
  import AssignedView from "views/admin/AssignedView.svelte";
  import NotFound from "views/NotFound.svelte"


  export let location;

  const isInteger = num => /^[0-9]+$/.test(num);

  async function loadUserData(){
    return fetch('/user/account').then(res=>{
      if (res.ok)
        return res.json()
      if (res.status === 403)
        window.location.replace("/user/login");
    })
    .then(data => {
      $user = data
    })
  }
</script>

<div class="flex flex-1">
  <TailwindSidebar {location}/>
  <div class="w-full lg:w-[calc(100%-16rem)] bg-blueGray-100">
    <AdminNavbar />
    <div class="min-h-screen">
      <div class="px-4 md:px-10 mx-auto w-full mt-24">
        <ShowError/>
        <Router url="/">
          {#await loadUserData() then _}
            <Route path="view/:id/" let:params>
              {#if isInteger(params.id)}
                <GanttView project_id="{params.id}"/>
              {/if}
            </Route>
            <Route path="assigned" component="{AssignedView}" />
            <Route path="settings" component="{Settings}" />
            <Route path="projects" component="{ProjectView}"/>
            <Route path="projects/new" component="{EditProject}"/>
            <Route path="projects/:id/" let:params>
              {#if isInteger(params.id)}
                <EditProject id="{params.id}"/>
              {/if}
            </Route>
          {/await}
          <Route component="{NotFound}" />
        </Router>
      </div>
    </div>
  </div>
</div>
