<script>
    export let item = undefined;	
	export let isActive = false;
    export let isFirst = false;
	export let isHover = false;

    let itemClasses = '';
	
	$: {
		const classes = [];
		
		if (isActive) {
			classes.push('active');
		}
		if (isFirst) {
			classes.push('first');
		}
		if (isHover) {
			classes.push('hover');
		}
		itemClasses = classes.join(' ');
	}
</script>

<div class="flex items-center h-12 px-4 text-ellipsis overflow-hidden whitespace-nowrap {itemClasses}">
    <span class="w-6 h-6 bg-blueGray-200 inline-flex items-center justify-center rounded-full">
        <img class="w-full rounded-full align-middle border-none shadow-lg" src="{item.avatar}">
    </span>
    <div class="overflow-hidden text-ellipsis whitespace-nowrap">
        <div class="inline-block ml-3">{item.username}</div>
        <!-- <div class="inline-block">{item.tagline}</div> -->
    </div>
</div>
