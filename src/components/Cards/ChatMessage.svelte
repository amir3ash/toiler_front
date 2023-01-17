<script lang="ts">
    import { user } from '../../stores';
    import type { GetCommentsQuery } from '../../gql/graphql';
    import { locale } from '../../i18n/i18n-svelte';

    type Comment = GetCommentsQuery['activityComments'][0]
    type Author = Comment['author']
    type Message = Omit<Comment, 'author'>

    export let author: Author;    
    export let messages: Message[] = []

    const isMine = (author.id === $user.id);
    const containerclasses = isMine ? 'order-1 items-end' : 'order-2 items-start';
    const textClasses = isMine ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600';
    const lastMessageClass = isMine ? 'rounded-br-none' : 'rounded-bl-none';
    
    const dateOptions = {};
    const timeFormatter = new Intl.DateTimeFormat($locale, {hour: "2-digit", minute: "2-digit", hour12: false,})

    const dateFormatter = new Intl.DateTimeFormat($locale, {year: 'numeric',month: 'short', day: "2-digit"})
    
    let last_date_text: string = null;
    function getDateText(date: Date){
        // date = new Date(date);
        let text = dateFormatter.format(date);

        if (last_date_text && text === last_date_text)
            return null;

        last_date_text = text;

        return text;
   }
</script>

<div class="chat-message">
    
    <div class="flex items-end relative" class:justify-end="{isMine}">
        <div class="flex flex-col space-y-2 text-xs w-full max-w-xs mx-2 {containerclasses}">
            {#each messages as message, i (message.id)}
                {@const date=getDateText(message.createdAt)}
                {#if date}
                <div class="w-full mt-3 mb-2 justify-between text-center text-slate-500">
                    <span class="px-4 py-1 rounded-full text-xs bg-sky-100">
                        {date}
                    </span>
                </div>
                {/if}
                
                <div class="rounded-lg flex flex-col {textClasses} {i === messages.length-1?lastMessageClass:''}">
                    {#if i === 0}
                        <span class="ml-auto mr-1.5 text-yellow-100">
                            {isMine ? $user.username : author.username}
                        </span>
                    {/if}
                    
                    <span class="px-4 pt-1 pb-0 inline-block">
                        {message.text}
                    </span>
                    <span class="ml-auto mr-1 text-[11px] text-neutral-100">
                        {timeFormatter.format(message.createdAt)}
                    </span>
                </div>
            {/each}
        </div> 
        <img class="w-6 h-6 rounded-full sticky bottom-1 overflow-hidden text-transparent bg-blueGray-200 dark:bg-blueGray-700 {isMine ? 'order-2' : 'order-1'}"
            src="{isMine ? $user.avatar : author.avatar}"   
            alt="{isMine ? 'my avatar' : `${author.username}'s avatar`}"
        >
    </div>
</div>