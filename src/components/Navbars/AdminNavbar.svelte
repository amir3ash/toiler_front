<script>
  // core components
  import UserDropdown from "../Dropdowns/UserDropdown.svelte";
  import LL from "../../i18n/i18n-svelte";
  import { show_sidebar, search_text, dir } from "../../stores";
</script>

<!-- Navbar -->
<nav
  class="absolute top-0 left-0 w-full z-3 md:flex-row md:flex-nowrap md:justify-start flex items-center p-2 shadow-md bg-slate-50 dark:bg-slate-900"
>
  <button class="text-xl p-1 lg:hidden" on:click="{() => $show_sidebar=true}">
    <i class="fas fa-bars"></i>
  </button>
  <div
    class="w-full mx-autp items-center flex justify-end md:flex-nowrap flex-wrap md:px-10 px-4"
  >
    <!-- Brand -->
    <a
      class="text-slate-700 text-sm uppercase hidden lg:inline-block font-semibold"
      href="/"
    >
      <img src="/assets/img/drawing-1.svg" alt="Toiler icon">
    </a>
    <!-- Form -->
    <form on:submit|preventDefault="{()=>{}}"
      class="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3"
    >
      <div class="relative flex w-full flex-wrap items-stretch">
        <span
          class="z-2 h-full leading-snug font-normal text-center text-slate-300 dark:text-slate-600 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3"
        >
          <i class="fas fa-search"></i>
        </span>
        <input
          dir="{$dir}"
          type="text"
          bind:value="{$search_text}"
          placeholder="{$LL.mainTopbar.SEARCH_HERE()}"
          class="border-0 px-3 py-3 placeholder-slate-300 dark:placeholder-slate-400 text-slate-600 dark:text-blue-300 relative  bg-white dark:bg-gray-800 rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
        />
      </div>
    </form>
    <!-- User -->
    <ul class="flex-col md:flex-row list-none items-center  md:flex">
      <UserDropdown />
    </ul>
  </div>
</nav>
<!-- End Navbar -->
