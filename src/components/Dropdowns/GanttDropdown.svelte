<script>
    // library for creating dropdown menu appear on click
    import { createPopper } from "@popperjs/core";
	import { createEventDispatcher, onDestroy } from 'svelte';
    import { clickOutside } from "../../utils/click_outside";

    const dispatch = createEventDispatcher();

    let popperInstance = null;

    export let ref;

    function updateRef(ref){
        if (popperInstance){
            // popperInstance.reference = ref;
            popperInstance.state.elements.reference = ref
            popperInstance.update();
            dropdownPopoverShow= true
        }
        else {
            popperInstance = createPopper(ref, popoverDropdownRef, {
                placement: "bottom-end",
            });
            dropdownPopoverShow= true
        }
    }

	function on_delete() {
		dispatch('click_delete');
        dropdownPopoverShow = false;
	}
    function on_remove_dep(){
        dispatch('click_remove_dep')
        dropdownPopoverShow = false;
    }

    // core components
    let dropdownPopoverShow = false;
    let popoverDropdownRef;

    onDestroy(()=>{
        if (popperInstance){
            popperInstance.destroy();
            popperInstance = null;
        }
    })

    $: if (ref) updateRef(ref);
    
</script>

    
<div
    class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg w-48 {dropdownPopoverShow ? 'block':'hidden'}"
    bind:this="{popoverDropdownRef}"
    use:clickOutside
    on:outclick="{()=>{if(dropdownPopoverShow) dropdownPopoverShow = false}}"
>
    <button
        on:click={on_remove_dep}
        class="text-sm py-2 px-4 font-normal text-left w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-slate-50"
    >
        Remove Dependency
    </button>
    
    <button
        on:click={on_delete}
        class="text-sm py-2 px-4 font-normal text-left w-full whitespace-nowrap bg-transparent text-rose-400 hover:bg-rose-50"
    >
        Delete Activity
    </button>
</div>

  