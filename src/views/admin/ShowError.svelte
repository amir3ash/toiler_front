<script>
    import Alert from "../../components/Cards/Alert.svelte"
    import { notifications } from "../../utils/errors"

    function del_error(index){
        // $notifications = [...$notifications.slice(0, index), ...$notifications.slice(index+1)]
    }
</script>

<div class="absolute z-20 left-1/2 transform -translate-x-1/2">
    {#each $notifications as {message, type}, i}
        <Alert text="{message}" type="{type}" on:close="{() => del_error(i)}"/>
    {/each}
</div>