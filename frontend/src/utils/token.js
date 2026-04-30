const Token_KEY = 'token';

export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
};


/*
localStorage = {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


local storage is a dictionary 

{
  key1: value1,
  key2: value2,
  key3: value3
}


token
theme
language
cart
lastVisitedPage
featureFlags

global env/browsers env 
Browser  → window
Node     → global
Universal → globalThis

*/