<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";

  import Admin from "./layouts/Admin.svelte";
  import NotFound from './views/NotFound.svelte';

  export let url = "";
</script>

<Router url="{url}">
  <Route path="f/*" component="{Admin}" />
  <Route component="{NotFound}" />
</Router>
