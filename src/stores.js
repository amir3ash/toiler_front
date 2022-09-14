import { writable } from "svelte/store";


export const teams = writable([]);
export const show_sidebar = writable(false);

export const user = writable({id: null, first_name: '', last_name: '', avatar: null});
export const search_text = writable('');
