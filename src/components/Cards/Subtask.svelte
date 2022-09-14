<script>
  export let name="Sub task";
  export let id;
  export let checked = false;

  $: {
    console.log("subtask:", id, "changed to", checked)
  }

  let confirm=false;
  let deleted=false;

  function onclick_delete(){
    if(confirm){
        deleted=true;

    } else {
       confirm=true;
    }
  }


  function on_mouse_out(){ // Reset
      if(confirm || deleted){
          setTimeout(function(){
              deleted=false;
              confirm=false;
              
          }, 2000);
      }
  }
  let width = name.length + "ch"

  function resize_input() {
    width = this.value.length + "ch";
  }

</script>

<div class="flex item">
    <label class="todo">
      <input class="todo__state" type="checkbox" bind:checked>

      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="width: 35px" viewBox="0 0 25 25" class="todo__icon">
        <use xlink:href="#todo__box" class="todo__box"></use>
        <use xlink:href="#todo__check" class="todo__check"></use>
        <use xlink:href="#todo__circle" class="todo__circle"></use>
      </svg>

        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="25px" class="todo__icon todo_gra_line"
             style="width: -moz-fit-content; margin-left: 28px; padding-right: 8px">
          <line x1="0" y1="12.3" x2="98%" y2="12.3" stroke="url(#gra)" stroke-width="3" class="todo_line_mine"></line>
        </svg>

        <div class="todo__text">
          <!-- <input type="text" bind:value="{name}" on:input={resize_input} style="width: {width};"> -->
          {name}
        </div>

    </label>
    <div class="my-auto todo_delete ml-auto">
      <button class='centerMe but_e' on:click="{onclick_delete}" class:confirm class:done={deleted} on:mouseout="{on_mouse_out}">
        <div class='text'>
          <span>
            {#if deleted}
              Deleted
            {:else if confirm}
              Are you sure?
            {:else}
              Delete
            {/if}
          </span>
        </div>
        <div class='icon'>
          <i class='fa fa-trash'></i>
          <i class='fa fa-question'></i>
          <i class='fa fa-check'></i>
        </div>
      </button>
    </div>
</div>

<style>
  .item {
    border-bottom: solid 1px   #ddd;
  }
  .item:last-child {
    border-bottom: none;
  }

  .centerMe {
  position: absolute;
  /*{#top: 50%;#}*/
  /*{#left: 50%;#}*/
  -webkit-transform: translate(-80%, -50%);
          transform: translate(-80%, -50%);
    z-index: 1;
}
@media (min-width: 576px) {
 .centerMe{
     -webkit-transform: translate(-85%, -50%);
          transform: translate(-85%, -50%);
 }
}
@media (min-width: 768px) {
 .centerMe{
     -webkit-transform: translate(-80%, -50%);
          transform: translate(-80%, -50%);
 }
}
@media (min-width: 992px) {
 .centerMe{
     -webkit-transform: translate(-75%, -50%);
          transform: translate(-75%, -50%);
 }
}
@media (min-width: 1200px) {
 .centerMe{
     -webkit-transform: translate(-73%, -50%);
          transform: translate(-73%, -50%);
 }
}
.but_e {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  cursor: pointer;
  border: 0;
  background: transparent;
  outline: 0;
  overflow: hidden;
}

.but_e .icon {
  position: relative;
  /*#background: white;*/
  line-height: 30px;
  width: 30px;
  height: 30px;
  text-align: center;
  color: #f55957;
  font-size: 18px;
    opacity: 60%;
  -webkit-transition: .2s color;
  transition: .2s color;
  border-radius: 4px;
}
.but_e .icon .fa {
  width: 30px;
  -webkit-transition: .2s all;
  transition: .2s all;
}
.but_e .icon .fa-check {
  color: #38B87C;
}
.but_e .icon .fa-question {
  color: #2492FF;
}
.but_e:hover .icon:after {
  content: ' ';
  display: block;
  position: absolute;
  width: 5px;
  height: 5px;
  -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
  background: white;
  top: 12.5px;
  left: -2px;
  -webkit-transition: .2s left;
  transition: .2s left;
  z-index: 2;
}
.but_e .text {
  position: relative;
  width: 0;
  height: 30px;
  overflow: hidden;
  font-family: "Roboto", sans-serif;
  font-size: small;
  background: #F34541;
  text-align: center;
  line-height: 30px;
  color: #fff;
  font-weight: 300;
  -webkit-transition: .2s all;
  transition: .2s all;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.but_e .text span {
  width: 100%;
  opacity: 0;
  position: absolute;
  top: -30px;
  left: 50%;
  -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
  -webkit-transition: .3s all;
  transition: .3s all;
}
.but_e:hover .icon {
  color: #F34541;
    background: white;
    opacity: 100%;
    border-radius: 0 5px 5px 0;
}
.but_e:hover .icon:after {
  right: -2px;
}
.but_e:hover .text {
  width: 120px;
}
.but_e:hover .text span {
  opacity: 1;
  top: 0;
}
.but_e.confirm .icon {
    border-radius: 0 5px 5px 0;
}
.but_e.confirm .icon .fa {
  -webkit-transform: translateY(-30px);
          transform: translateY(-30px);
}
.but_e.confirm .icon:after {
  right: -2px;
}
.but_e.confirm .text {
  background: #2492FF;
  width: 120px;
}
.but_e.confirm .text span {
  opacity: 1;
  top: 0;
}
.but_e.done .icon {
    border-radius: 0 5px 5px 0;
}
.but_e.done .icon .fa {
  -webkit-transform: translateY(-60px);
          transform: translateY(-60px);
}
.but_e.done .icon:after {
  right: -2px;
}
.but_e.done .text {
  background: #38B87C;
  width: 120px;
}
.but_e.done .text span {
  opacity: 1;
  top: 0;
}


.todo {
  display: inline-flex;
  position: relative;
  padding: 1em 1em 1em 44px;
  margin: 0 auto 0 0;
  cursor: pointer;
 /* border-bottom: solid 1px   #ddd; */
}
/* .todo:last-child {
  border-bottom: none;
} */
.todo__state {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.todo__text {
  color: #135156;
  -webkit-transition: all 0.4s linear 0.4s;
  transition: all 0.4s linear 0.4s;
}
.todo_gra_line{
    width: fit-content;
    width: intrinsic;
    width: -moz-fit-content; 
    width: -webkit-fit-content;
	width: -moz-fit-content;
	margin-left: 28px;
	padding-right: 8px;
}
.todo__icon {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  margin: auto;
  fill: none;
  stroke: #27FDC7;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.todo_line_mine,
.todo__line,
.todo__box,
.todo__check {
  -webkit-transition: stroke-dashoffset 0.8s cubic-bezier(0.9, 0, 0.5, 1);
  transition: stroke-dashoffset 0.8s cubic-bezier(0.9, 0, 0.5, 1);
}
.todo__circle {
  stroke: #27FDC7;
  stroke-dasharray: 1,6;
  stroke-width: 0;
  -webkit-transform-origin: 13.5px 12.5px;
          transform-origin: 13.5px 12.5px;
  -webkit-transform: scale(0.4) rotate(0deg);
          transform: scale(0.4) rotate(0deg);
  -webkit-animation: none 0.8s linear;
          animation: none 0.8s linear;
}
@-webkit-keyframes explode {
  30% {
    stroke-width: 3;
    stroke-opacity: 1;
    -webkit-transform: scale(0.8) rotate(40deg);
            transform: scale(0.8) rotate(40deg);
  }
  100% {
    stroke-width: 0;
    stroke-opacity: 0;
    -webkit-transform: scale(1.1) rotate(60deg);
            transform: scale(1.1) rotate(60deg);
  }
}
@keyframes explode {
  30% {
    stroke-width: 3;
    stroke-opacity: 1;
    -webkit-transform: scale(0.8) rotate(40deg);
            transform: scale(0.8) rotate(40deg);
  }
  100% {
    stroke-width: 0;
    stroke-opacity: 0;
    -webkit-transform: scale(1.1) rotate(60deg);
            transform: scale(1.1) rotate(60deg);
  }
}
.todo__box {
  stroke-dasharray: 56.1053, 56.1053;
  stroke-dashoffset: 0;
  -webkit-transition-delay: 0.16s;
          transition-delay: 0.16s;
}
.todo__check {
  stroke: #27FDC7;
  stroke-dasharray: 9.8995, 9.8995;
  stroke-dashoffset: 9.8995;
  -webkit-transition-duration: 0.32s;
          transition-duration: 0.32s;
}
.todo_line_mine{
    stroke-dasharray: 1800,1000;
    stroke-dashoffset: 1800;
}
.todo__line {
  stroke-dasharray: 168, 1684;
  stroke-dashoffset: 168;
}
.todo__circle {
  -webkit-animation-delay: 0.56s;
          animation-delay: 0.56s;
  -webkit-animation-duration: 0.56s;
          animation-duration: 0.56s;
}
.todo__state:checked ~ .todo__text {
  -webkit-transition-delay: 0s;
          transition-delay: 0s;
  color: #5EBEC1;
  opacity: 0.6;
}
.todo__state:checked ~ .todo__icon .todo__box {
  stroke-dashoffset: 56.1053;
  -webkit-transition-delay: 0s;
          transition-delay: 0s;
}
.todo__state:checked ~ .todo__icon .todo__line {
  stroke-dashoffset: -8;
}
.todo__state:checked ~ .todo__icon .todo_line_mine {
    stroke-dashoffset: -8;
}
.todo__state:checked ~ .todo__icon .todo__check {
  stroke-dashoffset: 0;
  -webkit-transition-delay: 0.48s;
          transition-delay: 0.48s;
}
.todo__state:checked ~ .todo__icon .todo__circle {
  -webkit-animation-name: explode;
          animation-name: explode;
}
</style>
