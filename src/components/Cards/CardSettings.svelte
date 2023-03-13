<script lang="ts">
import { onMount } from "svelte";
import { send_json_data } from "../../utils/get_cookie"
import { showAlert } from '../../utils/errors'
import { user, darkTheme, dir, theme } from '../../stores'
import type { Theme } from "../../stores";
import type { UserUser } from "../../gql/graphql";
import LL, { locale, setLocale } from '../../i18n/i18n-svelte'
import Select from "svelte-select";
import type { Locales } from "../../i18n/i18n-types";
import { derived } from 'svelte/store';
import { uploadAvatar } from "../../utils/img_uploading";
  
  const TR = derived(LL, $LL => $LL.settings);

  const account_url = "/user/account";
  let username = "";
  let firstName = "";
  let lastName = "";
  let email = "";
  let updated_values: UserUser|{'email': string} = {};
  let files: FileList = null; 

  $: if (files) uploadAvatar(files[0]).finally(() => files=null);

  onMount(() => {
    fetch(account_url)
    .then(d => d.json())
    .then(data => {
      username = data.username;
      firstName = data.firstName;
      lastName = data.lastName;
      email = data.email;
      $user.avatar = data.avatar
      $user = $user;
    })
  })

  function change_info(e){
    if (Object.keys(updated_values).length !== 0)
    send_json_data(account_url, 'PATCH', updated_values)
    .then(data => {
      showAlert('Profile updated', 'success')
    })
    updated_values = {}
  }


  let currentPassword, newPassword1, newPassword2;
  let old_password_err=[], password1_err=[], password2_err=[];
  
  function change_password(e){
    const url = '/user/change_password';

    if (newPassword1 !== newPassword2)
      return;

    const data = {
      oldPassword: currentPassword,
      newPassword1: newPassword1,
      newPassword2: newPassword2
    }

    send_json_data(url, 'PUT', data, true)
    .then(() => {
      window.location.href = '/user/login';
    })
    .catch(async req => {
      if (req.status == 400){
        let json = await req.json();
        
        ({
          oldPassword: old_password_err = [],
          newPassword1: password1_err = [],
          newPassword2: password2_err = []
        } = json);
      }
    })

  }

  function onClick(e){
    e.target.children.avatar && e.target.children.avatar.click()
  }

  function changeLocale(localeLang: Locales){
    if (localStorage.getItem('Lang') !== localeLang){
      setLocale(localeLang)
      localStorage.setItem('Lang', localeLang)
      $dir = localeLang === 'fa' ? 'rtl':'ltr';
    }
  }

  const langs = [{value: 'en', label: 'English'}, {value: 'fa', label: 'Persian'}]
  let lang = langs.find(o=> o.value === $locale);
  $: if (lang) changeLocale(lang.value as Locales)

  const themes = [{value: 'dark', label: 'Dark'}, {value: 'light', label: 'Light'}, {value: 'system', label: 'System Theme'}]
  let choosenTheme = themes.find(o => o.value === $theme);
  $: if (choosenTheme) $theme = choosenTheme.value as Theme
  
</script>
  
<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0 dark:bg-slate-900"
>
  <div class="rounded-t bg-white mb-0 px-6 py-6 dark:bg-gray-900">
    <div class="text-center flex justify-between">
      <h6 class="text-slate-700 text-xl font-bold dark:text-slate-300">{$TR.MyAccount()}</h6>
      <button
        class="bg-red-400 dark:bg-red-700 text-white active:bg-red-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
        type="button"
      >
        {$TR.SETTINGS()}
        
      </button>
    </div>
  </div>
  <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
    <div class="flex w-full justify-center lg:hidden">
      <div class="flex relative rounded-full justify-center flex-col w-32 h-32">
        <img
          alt="{$TR.YOUR_AVATAR()}"
          src="{$user.avatar}"
          class="bg-white dark:bg-gray-700 shadow-xl text-transparent rounded-full h-full align-middle border-none absolute w-32"
        />
        
        <button class="absolute w-full h-full rounded-full text-lg font-medium opacity-0 hover:opacity-100 hover:bg-white hover:bg-opacity-50 dark:hover:bg-black"
          on:click="{onClick}"
        >
        <input name="avatar" hidden="{true}" type="file" accept="image/png, image/jpeg" bind:files/>
          {$TR.UPLOAD()}
        </button>
      </div>
    </div>
      <h6 class="text-slate-400 dark:text-slate-500 text-sm mt-3 mb-6 font-bold uppercase">
        {$TR.USER_INFORMATION()}
        <!-- @{username} -->
      </h6>
      <form on:submit|preventDefault="{change_info}">
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-slate-600 dark:text-slate-400 text-xs font-bold mb-2"
                for="grid-username"
              >
                {$TR.USERNAME()}
              </label>
              <input
                id="grid-username"
                type="text"
                class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value="{username}"
                disabled
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-slate-600 dark:text-slate-400 text-xs font-bold mb-2"
                for="grid-email"
              >
                {$TR.EMAIL_ADDRESS()}
              </label>
              <input
                id="grid-email"
                placeholder="{$TR.EMAIL_PLACEHOLDER()}"
                type="email"
                class="border-0 px-3 py-3 placeholder-slate-300 dark:placeholder-slate-400 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value="{email}"
                on:change="{() => updated_values = {email: email, ...updated_values}}"
                required
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-slate-600 dark:text-slate-400 text-xs font-bold mb-2"
                for="grid-first-name"
              >
                {$TR.FIRSTNAME()}
              </label>
              <input
                id="grid-first-name"
                placeholder="{$TR.FIRSTNAME_PLACEHOLDER()}"
                type="text"
                class="border-0 px-3 py-3 placeholder-slate-300 dark:placeholder-slate-400 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value="{firstName}"
                on:change="{() => updated_values = {firstName: firstName, ...updated_values}}"
                minlength="1"
                required
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-slate-600 dark:text-slate-400 text-xs font-bold mb-2"
                for="grid-last-name"
              >
                {$TR.LASTNAME()}
              </label>
              <input
                id="grid-last-name"
                placeholder="{$TR.LASTNAME_PLACEHOLDER()}"
                type="text"
                class="border-0 px-3 py-3 placeholder-slate-300 dark:placeholder-slate-400 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value="{lastName}"
                on:change="{() => updated_values = {lastName: lastName, ...updated_values}}"
              />
            </div>
          </div>
          <div class="px-4 mt-5">
            <button 
              class="py-1 px-3 font-bold bg-rose-500 dark:bg-rose-800 text-white text-sm rounded-lg uppercase shadow"
              type="submit"
            >
              {$TR.UPDATE()}
            </button>
          </div>
        </div>
      </form>
      
      
      <hr class="mt-6 border-b-1 border-slate-300 dark:border-slate-700" />

      <h6 class="text-slate-400 dark:text-slate-500 text-sm mt-3 mb-6 font-bold uppercase">
        <!-- Contact Information -->
        {$TR.SECURITY()}
      </h6>
      <form on:submit|preventDefault="{change_password}">
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-slate-600 dark:text-slate-400 text-xs font-bold mb-2"
                for="grid-current-password"
              >
                {$TR.CURRENT_PASSWORD()}
              </label>
              <input
                id="grid-current-password"
                placeholder="{$TR.CURRENT_PASSWORD()}"
                type="password"
                class="border-0 px-3 py-3 placeholder-slate-300 dark:placeholder-slate-400 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value="{currentPassword}"
                required
              />
              {#each old_password_err as err}
                <div class="text-xs font-light text-red-500">
                  {err}
                </div>
              {/each}
            </div>
          </div>

          <div class="basis-full" style="flex-basis: 100%;"></div>

          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-slate-600 dark:text-slate-400 text-xs font-bold mb-2"
                for="grid-new-password"
              >
                {$TR.NEW_PASSWORD()}
              </label>
              <input
                id="grid-new-password"
                placeholder="{$TR.NEW_PASSWORD()}"
                type="password"
                class="border-0 px-3 py-3 placeholder-slate-300 dark:placeholder-slate-400 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value="{newPassword1}"
                minlength="8"
                required
              />
              {#each password1_err as err}
                <div class="text-xs font-light text-red-500">
                  {err}
                </div>
              {/each}
            </div>
          </div>

          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-slate-600 dark:text-slate-400 text-xs font-bold mb-2"
                for="grid-confirm-password"
              >
                {$TR.CONFIRM_PASSWORD()}
              </label>
              <input
                id="grid-new_password"
                placeholder="{$TR.CONFIRM_PASSWORD()}"
                type="password"
                class="border-0 px-3 py-3 placeholder-slate-300 dark:placeholder-slate-400 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value="{newPassword2}"
                required
              />
              {#each password2_err as err}
                <div class="text-xs font-light text-red-500">
                  {err}
                </div>
              {/each}
            </div>
          </div>

          <button class="mx-4 mt-5 py-1 px-3 font-bold bg-rose-500 dark:bg-red-800 text-white text-sm rounded-lg uppercase shadow">
            {$TR.CHANGE()}
          </button>
        </div>
      </form>

      <hr class="mt-6 border-b-1 border-slate-300 dark:border-slate-700" />

      <div class="flex mt-3">
          <Select
              inputStyles="--tw-ring-color: transparent"
              containerClasses="flex w-full xl:w-1/4 pl-1 p-1 pr-2 mx-2  text-xs dark:bg-slate-800"
              containerStyles='{$darkTheme? 'background: #0f172a; border-color: #454545; --listBackground: #343434; --itemHoverBG: #505050; ': ''}; direction: ltr; --height: 24px; --borderRadius: 12px; --selectedItemPadding: 0 0 0 4px; --padding: 0px 4px 0px 4px; --clearSelectBottom: 0px; --clearSelectTop: 0px'
              placeholder="Language"
              bind:value="{lang}"
              items="{langs}"
          />

          <Select
              inputStyles="--tw-ring-color: transparent"
              containerClasses="flex w-full xl:w-1/4 pl-1 p-1 pr-2 mx-2  text-xs dark:bg-slate-800"
              containerStyles='{$darkTheme? 'background: #0f172a; border-color: #454545; --listBackground: #343434; --itemHoverBG: #505050; ': ''}; direction: ltr; --height: 24px; --borderRadius: 12px; --selectedItemPadding: 0 0 0 4px; --padding: 0px 4px 0px 4px; --clearSelectBottom: 0px; --clearSelectTop: 0px'
              placeholder="Theme"
              bind:value="{choosenTheme}"
              items="{themes}"
          />
      </div>
  </div>
</div>
