<script lang="ts">
    // library for creating dropdown menu appear on click
  import { createPopper } from "@popperjs/core";
	import { createEventDispatcher, onDestroy } from 'svelte';
  import LL from "../../i18n/i18n-svelte";
  import { dir } from "../../stores";
  import { clickOutside } from "../../utils/click_outside";

  const dispatch = createEventDispatcher();

  let popperInstance = null;

  export let edit_btn_name = $LL.EDIT();
  export let toggle_classes = 'text-slate-500 py-1 px-3';

	function on_delete() {
		dispatch('click_delete');
    dropdownPopoverShow = false;
	}
  function on_edit(){
    dispatch('click_edit')
    dropdownPopoverShow = false;
  }

    // core components
    let dropdownPopoverShow = false;
  
    let btnDropdownRef;
    let popoverDropdownRef;

    const toggleDropdown = () => {
      if (dropdownPopoverShow) {
        dropdownPopoverShow = false;
      } else {
        dropdownPopoverShow = true;
        if (popperInstance == null)
          popperInstance = createPopper(btnDropdownRef, popoverDropdownRef, {
            placement: "bottom-end",
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

  <div
    class="w-fit ml-auto"
    dir="{$dir}"
    use:clickOutside
    on:outclick="{()=>{if(dropdownPopoverShow) dropdownPopoverShow = false}}"
  >
    <button
      class="{toggle_classes}"
      bind:this="{btnDropdownRef}"
      on:click="{toggleDropdown}"
    >
      <i class="fas fa-ellipsis-v"></i>
    </button>
    
    <div
      bind:this="{popoverDropdownRef}"
      class="bg-white dark:bg-black text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 {dropdownPopoverShow ? 'block':'hidden'}"
    >
      <button
        on:click={on_edit}
        class="flex text-sm py-2 px-4 font-normal w-full whitespace-nowrap bg-transparent text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        {edit_btn_name}
      </button>
      
      <button
        on:click={on_delete}
        class="flex text-sm py-2 px-4 font-normal w-full whitespace-nowrap bg-transparent text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900"
      >
        {$LL.DELETE()}
      </button>
    </div>
  </div>
  