import { derived, get, Readable, Updater, writable } from "svelte/store";
import type { Writable } from "svelte/store";

type User = {id?: number, firstName?: string, lastName?: string, avatar?: string, username?: string}
export type Theme = 'dark' | 'light' | 'system'

export const teams = writable([]);
export const show_sidebar = writable(false);

export const user: Writable<User> = writable({id: undefined, firstName: '', lastName: '', avatar: undefined, username: ''});
export const search_text = writable('');

export const [theme, darkTheme] = function(defaultThme: Theme){
    const storageKey = 'theme'
    const store = writable(defaultThme);
    const { subscribe, set } = store;

    const dark = writable<boolean>();
    const {subscribe: darkThemeSubscribe} = dark
    function setDarkStore(isDark: boolean){
        if (isDark)
            document.documentElement.classList.add('dark')
        else
            document.documentElement.classList.remove('dark')

        dark.set(isDark)
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const isDark = event.matches;
        setDarkStore(isDark)
    });

    const storedValue = localStorage.getItem(storageKey)
    if (storedValue === 'dark' || storedValue === 'light' || storedValue === 'system')
        set(storedValue);
    
    function setTheme(t: Theme){
        localStorage.setItem(storageKey, t);
        set(t);

        if (t === "dark")
            setDarkStore(true)
        else if (t === 'light')
            setDarkStore(false)
        else
            setDarkStore(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    
    const theme: Writable<Theme> = {
        subscribe,
        set: setTheme,
        update: (cb: Updater<Theme>) => {
            const updatedStore = cb(get(store));
            setTheme(updatedStore)
        }
    }

    const darkTheme: Readable<boolean> = {
        subscribe: darkThemeSubscribe
    }
    return [theme, darkTheme]
}('system')


type Dir = 'rtl' | 'ltr'
export const dir = writable(window.document.dir as Dir)