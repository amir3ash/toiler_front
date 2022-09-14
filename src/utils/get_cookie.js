export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export async function send_json_data(url='', method='POST', data, raw=false){
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-csrftoken': getCookie('csrftoken')
        }
    }).then(async r => {
        if (!raw) {
            let json = r.json();
            if (r.ok)
                return json;

            let detail  = await json.then(j => j.detail || Promise.reject())
                        .catch(() => r.statusText || r.status);
            return Promise.reject(detail);
        }
        else if (r.ok){
            return r;
        }

        return Promise.reject(r);
    })
}