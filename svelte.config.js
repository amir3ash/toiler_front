import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { reactivePreprocess } from 'svelte-reactive-preprocessor'

const debuging = false
const preprocess = [vitePreprocess()]

if (debuging)
  preprocess.push(reactivePreprocess({
    enabled: true,
    state: true // for debuging set theme true
  }))

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess
}
