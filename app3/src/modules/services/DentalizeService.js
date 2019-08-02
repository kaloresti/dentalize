import {TokenManager} from '../infra/TokenManager';

const HttpClient = {
    post: (url, { body }) => {
        return fetch(url, {
            method: "POST", body: JSON.stringify(body),
            headers: { "Content-type" : "application/json"}
        });
    }
};

const prefixUrl = "http://127.0.0.1:8000/api/";

async function login({login, senha}){
    HttpClient.post(prefixUrl+"login", {
        body: {login, senha}
    })
    .then(respostaDoServidor => {
        return respostaDoServidor.text();
    })
    .then(async token => {
        await TokenManager.setToken(token);
        console.warn(await TokenManager.getToken());
    }).catch(err => {
        alert("Erro !");
    });;
}

async function registerDoctor(body) // {name, email, cro, cro_uf, cpf, c_password}
{
    HttpClient.post(prefixUrl+"register_doctor", {
        body: body
    })
    .then(respostaDoServidor => {
        return respostaDoServidor.json();
    })
    .then(async data => {
        //await TokenManager.setToken(token);
        return data;
        //await console.log(data);
    })
    .catch(error => {
        console.warn(error); 
    });
}

export default {login, registerDoctor};