<script>
import { createEventDispatcher} from "svelte/internal";
import { clickOutside } from './click_outside';

  const dispatch = createEventDispatcher();
  
  export let div_padding='0.25 rem';
  export let classes = '';
  export let min_width = '4px';
  export let value='';
  


  let width=0
  let input;


  function handle_enter(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
      dispatch('click_enter', {value: value});
      value = '';
      this.blur();
    }
  }
  function onClickOut(e){
    dispatch('click_outside', {value: value});
  }
</script>

<div
  bind:clientWidth="{width}"
  style:padding="{div_padding}"
  style="opacity: 0%; position: absolute; z-index: -500;"
  aria-hidden="true"
>
  {value}
</div>

<slot name="input">
  <input 
    style="width: {width+8}px;"
    style:min-width="{min_width}"
    class="{classes}"
    bind:value
    bind:this="{input}"
    on:keypress="{handle_enter}"
    use:clickOutside
    on:outclick="{onClickOut}"
    {...$$restProps}
  >
</slot>
