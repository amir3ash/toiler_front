<script>
    import { createEventDispatcher} from "svelte/internal";

    const dispatch = createEventDispatcher();

    export let text
    export let type

    let text_color='text-red-700'
    let bg_color = 'bg-red-200'

    switch (type) {
      case 'error':
        text_color='text-red-700'
        bg_color = 'bg-red-200'
        break;
      
      case 'success':
        text_color='text-green-700'
        bg_color = 'bg-green-200'
        break;

      default:
        break;
    }

    function close(){
      dispatch('close');
    }

</script>

<div class="px-6 py-4 border-0 rounded relative mb-4 {text_color} {bg_color}" role="alert">
  <span class="text-xl inline-block mr-5 align-middle">
    <i class="fas fa-bell"></i>
  </span>
  <span class="inline-block align-middle mr-8">
    {text}
  </span>
  <button 
    class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
    on:click="{close}"
    aria-label="Close"
    >
    <span>×</span>
  </button>
</div>

