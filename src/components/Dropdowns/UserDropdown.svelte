<script>
  // library for creating dropdown menu appear on click
  import { createPopper } from "@popperjs/core";
  import { dir, user } from "../../stores"
  import { clickOutside } from "../../utils/click_outside";
	import { onDestroy } from 'svelte';
  import LL from "../../i18n/i18n-svelte";
  import { Link } from "svelte-routing";

  let dropdownPopoverShow = false;

  let btnDropdownRef;
  let popoverDropdownRef;
  let popperInstance

  const toggleDropdown = (event) => {
    event.preventDefault();
    if (dropdownPopoverShow) {
      dropdownPopoverShow = false;
    } else {
      dropdownPopoverShow = true;
      popperInstance = createPopper(btnDropdownRef, popoverDropdownRef, {
        placement: "bottom-start",
      });
    }
  };

  onDestroy(()=>{
      if (popperInstance){
          popperInstance.destroy();
          popperInstance = null;
      }
  })
</script>

<div dir="{$dir}">
  <button
    class="text-slate-500 block"
    bind:this="{btnDropdownRef}"
    on:click="{toggleDropdown}"
    aria-label="show popover"
  >
    <div class="items-center flex">
      <span
        class="w-12 h-12 text-sm text-white bg-slate-200 dark:text-black dark:bg-slate-700 inline-flex items-center justify-center rounded-full"
      >
        <img
          alt="..."
          class="w-full rounded-full align-middle border-none shadow-lg"
          src="{$user.avatar}"
        />
      </span>
    </div>
  </button>
  <div
    bind:this="{popoverDropdownRef}"
    use:clickOutside
    on:outclick="{()=>{if(dropdownPopoverShow) dropdownPopoverShow = false}}"
    class="bg-white dark:bg-black text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 {dropdownPopoverShow ? 'block':'hidden'}"
  >
    <Link
      to="/f/settings"
      class="text-sm py-2 px-4 font-normal block rtl:text-right w-full whitespace-nowrap bg-transparent text-slate-700  hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {$LL.SETTINGS()}
    </Link>
    
    <div class="h-0 my-2 border border-solid border-slate-100 dark:border-slate-700" />
    <a
      href="/user/logout"
      class="text-sm py-2 px-4 font-normal rtl:text-right block w-full whitespace-nowrap bg-transparent text-slate-700 hover:text-red-700  hover:bg-slate-100 dark:hover:text-red-400 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {$LL.LOGOUT()}
    </a>
  </div>
</div>
