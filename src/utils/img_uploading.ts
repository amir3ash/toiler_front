import { user } from "../stores";
import { showAlert } from "./errors";
import { getCookie } from "./get_cookie";

/** uploads avatar then update `user` store. Shows Alert in case of error.*/
export async function uploadAvatar(file: Blob){
    const formData = new FormData();

    try {
        formData.append('csrfmiddlewaretoken', getCookie('csrftoken'))
        formData.append('avatar', file)
    
    } catch (error) {
        return Promise.reject(error)
    }

    return fetch('/user/avatar', {
        method: 'POST',
        body: formData
    })
    .then(async response => {
        const jsonData = response.json();
        if (response.ok)
            return jsonData;

        const detail: string|number = await jsonData.then(d => d.avatar || d.detail || Promise.reject())
                    .catch(() => response.statusText || response.status);

        return Promise.reject(detail);
    })
    .then(data => user.update(u =>{u.avatar=data.avatar; return u}))
    .catch(e => showAlert(e, 'error'));   
}