export const request = async (url, logoutFn, headers, method = 'GET', body = null) => {
    const response = await fetch(url, {
        headers,
        body,
        method
    })    
    if (!response.ok){
        const err = await response.json();
        if (logoutFn){
            if (err.expiredAt){
                logoutFn();
            }
        }
        throw new Error('Unauthorized or Expired Token');
    } 
    else {    
        return await response.json();
    }
}

