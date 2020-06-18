const fetch = require('node-fetch');


async function getUsers(){ 
    const response = await fetch('http://localhost:3000/public/users.json', {});
    const json = await response.json();
    let array = [];
    json.map(user=>{
        array.push(user);
    })
    return array;
}

module.exports = {getUsers};