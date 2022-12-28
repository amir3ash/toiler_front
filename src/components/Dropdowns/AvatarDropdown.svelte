<script lang="ts">
// library for creating dropdown menu appear on click
  import { createPopper } from "@popperjs/core";
//   import { clickOutside } from "../../utils/click_outside";
  import { onDestroy } from 'svelte';
  import UserPopOver from '../Cards/UserPopOver.svelte'
  import type { UserUser } from "../../gql/graphql";

  export let user: UserUser;

  let popperInstance = null;

  let dropdownPopoverShow = false;

  let spanRef;
  let popoverDropdownRef;

  const toggleDropdown = () => {
    if (dropdownPopoverShow) {
        dropdownPopoverShow = false;
    } 
    else {
        dropdownPopoverShow = true;
        if (popperInstance == null)
            popperInstance = createPopper(spanRef, popoverDropdownRef);
    }
  };

  onDestroy(()=>{
    if (popperInstance){
        popperInstance.destroy();
        popperInstance = null;
    }
  })

</script>

<span 
    class="w-8 h-8 ml-auto bg-blueGray-200 inline-flex items-center justify-center rounded-full"
    on:mouseenter="{() => toggleDropdown()}"
    on:mouseleave="{() => toggleDropdown()}"
    bind:this="{spanRef}"
>
    {#if user.avatar}
        <img class="w-full rounded-full align-middle border-none shadow-lg" src="{user.avatar}" alt="{user.username}'s avatar">
    {/if}
</span>
  
<div
  bind:this="{popoverDropdownRef}"
  class="fixed z-2 float-left {dropdownPopoverShow ? 'block':'hidden'}"
>
    <UserPopOver user="{user}" />
</div>