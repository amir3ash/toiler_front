<script>
  // core components
  import CardSettings from "../../components/Cards/CardSettings.svelte";
  import CardProfile from "../../components/Cards/CardProfile.svelte";
  import { dir } from '../../stores'
  export let location;
</script>

<svelte:head>
  <title>Toiler - Settings</title>
</svelte:head>

<div class="flex flex-wrap">
  <div class="w-full lg:w-8/12 px-4" dir="{$dir}">
    <CardSettings />
  </div>
  <div class="w-full lg:w-4/12 px-4" dir="{$dir}">
    <CardProfile />
  </div>
</div>
