<script>
	import { createEventDispatcher, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();
	function close_modal(){
        dispatch('click_close');
    }
    function handle_save(){
        dispatch('click_save');
		close_modal();
    }
    export let save = false;

	let modal;

	const handle_keydown = e => {
		if (e.key === 'Escape') {
			close_modal();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown}/>

<div class="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-25" on:click={close_modal}></div>

<div class="absolute z-20 left-1/2 top-1/2 w-11/12 p-4 rounded-md bg-white max-w-lg max-h-screen overflow-auto transform -translate-x-1/2 -translate-y-1/2"
 role="dialog" aria-modal="true" bind:this={modal}
 >
	<slot name="header"></slot>
	<hr>
	<slot></slot>
	<hr class="mb-2">

	<!-- svelte-ignore a11y-autofocus -->
	<button
        class="rounded-md text-red-600 px-2 mt-1 mx-1 border border-red-300"
        autofocus
        on:click={close_modal}
    >
        Close
    </button>
    {#if save}
    <button
        class="rounded-md text-green-500 px-2 mt-1 border"
        on:click={handle_save}
    >
        Save
    </button>
    {/if}
</div>