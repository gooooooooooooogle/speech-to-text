<script>
  export let name = "按钮";
  export let width = "";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function eventHander() {
    dispatch("click");
  }
</script>

<button
  class="w-{width} bg-blue-300 rounded-md px-2 py-1 hover:bg-blue-500 hover:text-white"
  on:click={eventHander}>{name}</button
>
