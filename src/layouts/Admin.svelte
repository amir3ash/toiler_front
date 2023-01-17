<script lang="ts">
  import { dir, user } from '../stores'
  import { Router, Route } from "svelte-routing";
  import { createClient, setContextClient } from '@urql/svelte';

  // components for this layout
  import AdminNavbar from "../components/Navbars/AdminNavbar.svelte";
  import TailwindSidebar from "../components/Sidebar/TailwindSidebar.svelte";

  import Settings from "../views/admin/Settings.svelte";
  import GanttView from "../views/admin/GanttView.svelte"
  import ProjectView from "../views/admin/ProjectsView.svelte"
  import EditProject from "../views/admin/EditProject.svelte"
  import ShowError from "../views/admin/ShowError.svelte";
  import AssignedView from "../views/admin/AssignedView.svelte";
  import NotFound from "../views/NotFound.svelte"
  import { queryStore, gql } from '@urql/svelte';
  import type { UserUser } from '../gql/graphql';
  import { setLocale, } from '../i18n/i18n-svelte'
  import { loadAllLocales } from '../i18n/i18n-util.sync';
  import { onMount } from 'svelte';

  export let location;

  const client = createClient({
    url: '/gql/query',
  });

  setContextClient(client);

  const userGql = queryStore<{me: UserUser}>({
      client: client,
      query: gql(`
        {
          me {
            id
            firstName
            lastName
            username
            avatar
          }
        }
      `),
    });

  const isInteger = (num: string) => /^[0-9]+$/.test(num);

  $: if ($userGql.data){
    loadUserData($userGql.data.me)
  } else if ($userGql.error){
    window.location.replace("/user/login");
  }

  function loadUserData(u: UserUser){
      $user = u
  }

  onMount(()=>{
    loadAllLocales()
    const defaultLang = 'en';
    let lang = localStorage.getItem('Lang');
    
    if (lang !== null && (lang === 'en' || lang === 'fa'))
      setLocale(lang)
    else {
      lang = defaultLang
      localStorage.setItem('Lang', defaultLang)
      setLocale(defaultLang)
    }
    
    $dir =  lang === 'fa'? 'rtl': 'ltr'
  })
</script>

<div class="flex flex-1">
  <TailwindSidebar {location}/>
  <div class="w-full lg:w-[calc(100%-16rem)] bg-blueGray-100 dark:bg-blueGray-800">
    <AdminNavbar />
    <div class="min-h-screen">
      <div class="px-4 md:px-10 mx-auto w-full mt-24">
        <ShowError/>
        <Router url="/">
          {#if $userGql.data}
            <Route path="view/:id/" let:params>
              {#if isInteger(params.id)}
                <GanttView project_id="{parseInt(params.id)}"/>
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
          {/if}
          <Route component="{NotFound}" />
        </Router>
      </div>
    </div>
  </div>
</div>
