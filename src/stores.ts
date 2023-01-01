import { readable, writable } from "svelte/store";
import type { Writable } from "svelte/store";

type User = {id?: number, firstName?: string, lastName?: string, avatar?: string, username?: string}

export const teams = writable([]);
export const show_sidebar = writable(false);

export const user: Writable<User> = writable({id: undefined, firstName: '', lastName: '', avatar: undefined, username: ''});
export const search_text = writable('');

export const darkTheme = writable(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const isDark = event.matches;
    darkTheme.set(isDark)
});