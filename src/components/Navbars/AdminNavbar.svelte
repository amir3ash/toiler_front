<script>
  // core components
  import UserDropdown from "components/Dropdowns/UserDropdown.svelte";
  import { show_sidebar, search_text } from "../../stores";
</script>

<!-- Navbar -->
<nav
  class="absolute top-0 left-0 w-full z-3 md:flex-row md:flex-nowrap md:justify-start flex items-center p-2 shadow-md bg-blueGray-50"
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
          class="z-2 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3"
        >
          <i class="fas fa-search"></i>
        </span>
        <input
          type="text"
          bind:value="{$search_text}"
          placeholder="Search here..."
          class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
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
