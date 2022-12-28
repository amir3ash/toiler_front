import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

type User = {id?: number, firstName?: string, lastName?: string, avatar?: string, username?: string}

export const teams = writable([]);
export const show_sidebar = writable(false);

export const user: Writable<User> = writable({id: undefined, firstName: '', lastName: '', avatar: undefined, username: ''});
export const search_text = writable('');
