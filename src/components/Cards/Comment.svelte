<script lang="ts">
   import ChatMessage from './ChatMessage.svelte'
   import { send_json_data, getCookie } from '../../utils/get_cookie';
   import { beforeUpdate, afterUpdate, onDestroy } from 'svelte';
   import websocketStore from 'svelte-websocket-store';
   import { queryStore, getContextClient, } from '@urql/svelte';
   import type { GetCommentsQuery } from '../../gql/graphql';
   import { commentsQuery } from '../../gql/queries/commentQuery';
import LL from '../../i18n/i18n-svelte';
import { dir } from '../../stores';

   type Comment = GetCommentsQuery['activityComments'][0]
   type Author = Comment['author']
   type GroupComment = {'author': Author, 'messages': Omit<Comment, 'author'>[]}

   export let activity_id: number;
   let text: string;

   let group_comments: GroupComment[] = [];
   let last_author=null;

   let commentsGql = queryStore({
      client: getContextClient(),
      query: commentsQuery,
      variables: {id: activity_id}
    });


   function sendComment(){
      if (text)
         send_json_data('/gantt/comment/', 'POST', {
            activity: activity_id,
            text: text
         })
         .then(data => {
            addComment({...data, author: {id: data.author}});
            text = '';
         })
   }

   function addComment(comment: Comment){
      let {author, ...comment_data} = comment;
      let last_group_comment: GroupComment;

      comment_data.createdAt = new Date(comment_data.createdAt);

      if (!last_author || last_author.id !== author.id){
         last_author = author;

         last_group_comment = {author: author, messages: []}
         group_comments = [...group_comments, last_group_comment];
      }
      last_group_comment = group_comments[group_comments.length -1]
         
      last_group_comment.messages = [...last_group_comment.messages, comment_data]
      group_comments = group_comments;

   }

   // function getComments(){
   //    fetch(`/gantt/${activity_id}/comment/`)
   //    .then(res => res.json())
   //    .then(data => {
   //       comments_dates = data.map(o => o.created_at);
   //       data.forEach(comment => {
   //          addComment(comment)  
   //       })
   //    })
   // }

   // getComments()

   $: if ($commentsGql.data) {
      $commentsGql.data.activityComments.forEach(comment => addComment(comment))
   }

   let div;
	let autoscroll: boolean;

   beforeUpdate(() => {
		autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20);
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

   const csrftoken = getCookie('csrftoken');
   const myStore = websocketStore(`wss://${window.location.host}/ws/activity/${activity_id}/?csrftoken=${csrftoken}`, null, []);

   const unsubscribe =  myStore.subscribe(data => data && addComment(data));

   onDestroy(unsubscribe)

</script>

<div class="flex-1 pt-2 max-h-96 justify-between flex flex-col">
    <!-- <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
       <div class="relative flex items-center space-x-4">
          <div class="relative">
             <span class="absolute text-green-500 right-0 bottom-0">
                <svg width="20" height="20">
                   <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                </svg>
             </span>
          <img src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="" class="w-10 sm:w-16 h-10 sm:h-16 rounded-full">
          </div>
          <div class="flex flex-col leading-tight">
             <div class="text-2xl mt-1 flex items-center">
                <span class="text-gray-700 mr-3">Anderson Vanhron</span>
             </div>
             <span class="text-lg text-gray-600">Junior Developer</span>
          </div>
       </div>
       <div class="flex items-center space-x-2">
          <button type="button" class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
             </svg>
          </button>
          <button type="button" class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
             </svg>
          </button>
          <button type="button" class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
             </svg>
          </button>
       </div>
    </div> -->

    <div bind:this="{div}" id="messages" class="flex flex-col space-y-4 py-2 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
       {#each group_comments as group_comment}
            <!-- <div class="sticky top-0">3434</div> -->
            <ChatMessage author="{group_comment.author}" messages="{group_comment.messages}"/>
       {/each}
       
    </div>
    <div class="border-t-2 border-gray-200 dark:border-slate-700 px-4 pt-4 mb-2 sm:mb-0">
       <div class="relative flex">
          <!-- <span class="absolute inset-y-0 flex items-center">
             <button type="button" class="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
             </button>
          </span> -->
          <form on:submit|preventDefault="{sendComment}">
          <input bind:value="{text}" type="text" placeholder="{$LL.sidebar.WRITE_YOUR_MESSAGE()}" class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 bg-gray-200 rounded-lg dark:text-slate-300 dark:placeholder-gray-500 dark:bg-slate-800">
          <div class="absolute items-center inset-y-0 hidden sm:flex {$dir == 'ltr' ? 'right-0' : 'left-0'}">
             <!-- <button type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
             </button> -->
             <!-- <button type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
             </button> -->
             <!-- <button type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
             </button> -->
             <button class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                <span class="font-bold">{$LL.sidebar.SEND()}</span>
                <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 ml-2 transform rotate-90">
                   <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg> -->
             </button>
          </div>
         </form>
       </div>
    </div>
 </div>
 
 <style>
 .scrollbar-w-2::-webkit-scrollbar {
   width: 0.25rem;
   height: 0.25rem;
 }
 
 .scrollbar-track-blue-lighter::-webkit-scrollbar-track {
   --bg-opacity: 1;
   background-color: #f7fafc;
   background-color: rgba(247, 250, 252, var(--bg-opacity));
 }
 
 .scrollbar-thumb-blue::-webkit-scrollbar-thumb {
   --bg-opacity: 1;
   background-color: #edf2f7;
   background-color: rgba(237, 242, 247, var(--bg-opacity));
 }
 
 .scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
   border-radius: 0.25rem;
 }
 </style>
 