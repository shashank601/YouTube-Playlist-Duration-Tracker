import api from './axios.js'

export const Login = ({email, password}) => {
    const credentials = {email, password};
    return api.post('/auth/login', credentials); // jwt token or error
}

// register will not redirect to mainApp, no jwt yet, we redirect user to login 
export const Signup = ({username, email, password}) => { 
    const credentials = {username, email, password};
    return api.post('/auth/register', credentials); // {id, username, email} or error
}

export const verify = () => {
    return api.get('/auth/verify'); // {id} or error
}

