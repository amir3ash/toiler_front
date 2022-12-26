<script lang="ts">
import { onMount } from "svelte";
import { send_json_data, getCookie} from "../../utils/get_cookie"
import { showAlert } from '../../utils/errors'
import { user } from '../../stores'
import type { UserUser } from "../../gql/graphql";
  
  const account_url = "/user/account";
  let username = "";
  let firstName = "";
  let lastName = "";
  let email = "";
  let updated_values: UserUser|{'email': string} = {};
  let files = null;

  $: if (files) try {
        const formData = new FormData();
        formData.append('csrfmiddlewaretoken', getCookie('csrftoken'))
        formData.append('avatar', files[0])

        fetch('/user/avatar', {
            method: 'POST',
            body: formData
        })
        .then(response => {
          response.json().then(data => {$user.avatar=data.avatar; $user=$user});
          // showAlert('Avatar changed', 'success')
          files = null;
        });

    } catch (error) {
        console.error(error);
        files = null;
    }

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
</script>

<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
>
  <div class="rounded-t bg-white mb-0 px-6 py-6">
    <div class="text-center flex justify-between">
      <h6 class="text-blueGray-700 text-xl font-bold">My account</h6>
      <button
        class="bg-red-400 text-white active:bg-red-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
        type="button"
      >
        Settings
      </button>
    </div>
  </div>
  <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
    <div class="flex w-full justify-center lg:hidden">
      <div class="flex relative rounded-full justify-center flex-col w-32 h-32">
        <img
          alt="avatar"
          src="{$user.avatar}"
          class="bg-white shadow-xl text-transparent rounded-full h-full align-middle border-none absolute w-32"
        />
        
        <button class="absolute w-full h-full rounded-full text-lg font-medium opacity-0 hover:opacity-100 hover:bg-white hover:bg-opacity-50"
          on:click="{e => e.target.children.avatar && e.target.children.avatar.click()}"
        >
        <input name="avatar" hidden="{true}" type="file" accept="image/png, image/jpeg" bind:files/>
          Upload
        </button>
      </div>
    </div>
      <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
        User Information
        <!-- @{username} -->
      </h6>
      <form on:submit|preventDefault="{change_info}">
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-username"
              >
                Username
              </label>
              <input
                id="grid-username"
                type="text"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value="{username}"
                disabled
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-email"
              >
                Email address
              </label>
              <input
                id="grid-email"
                placeholder="Email"
                type="email"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value="{email}"
                on:change="{() => updated_values = {email: email, ...updated_values}}"
                required
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-first-name"
              >
                First Name
              </label>
              <input
                id="grid-first-name"
                placeholder="First name"
                type="text"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-last-name"
              >
                Last Name
              </label>
              <input
                id="grid-last-name"
                placeholder="Last name"
                type="text"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                bind:value="{lastName}"
                on:change="{() => updated_values = {lastName: lastName, ...updated_values}}"
              />
            </div>
          </div>
          <div class="px-4 mt-5">
            <button 
              class="py-1 px-3 font-bold bg-rose-500 text-white text-sm rounded-lg uppercase shadow"
              type="submit"
            >
              Update
            </button>
          </div>
        </div>
      </form>
      
      
      <hr class="mt-6 border-b-1 border-blueGray-300" />

      <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
        <!-- Contact Information -->
        Security
      </h6>
      <form on:submit|preventDefault="{change_password}">
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-current-password"
              >
                Current Password
              </label>
              <input
                id="grid-current-password"
                placeholder="Current Password"
                type="password"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-new-password"
              >
                New Password
              </label>
              <input
                id="grid-new-password"
                placeholder="New Password"
                type="password"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-confirm-password"
              >
                Confirm Password
              </label>
              <input
                id="grid-new_password"
                placeholder="Confirm Password"
                type="password"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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

          <button class="mx-4 mt-5 py-1 px-3 font-bold bg-rose-500 text-white text-sm rounded-lg uppercase shadow">
            Change
          </button>
        </div>
      </form>

      <!-- <hr class="mt-6 border-b-1 border-blueGray-300" />

      <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
        About Me
      </h6>
      <div class="flex flex-wrap">
        <div class="w-full lg:w-12/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              for="grid-about-me"
            >
              About me
            </label>
            <textarea
              id="grid-about-me"
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              rows="4"
              value="A beautiful UI Kit and Admin for Svelte & Tailwind CSS. It is Free
                and Open Source."
            />
          </div>
        </div>
      </div> -->
    
  </div>
</div>
