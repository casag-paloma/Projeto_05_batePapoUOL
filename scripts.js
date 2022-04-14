//carregar as mensagens
let chat;
let nomeUsuario;
let dados

function pedirNome(){
    nomeUsuario = prompt('Qual a sua graça?');
}

function cadastrarNome(){
    pedirNome();
    console.log(nomeUsuario);
    dados = {
        name: nomeUsuario
      };
    console.log(dados);
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados);
    promessa.then(tratarSucesso);
    promessa.catch(tratarError);
}

function tratarSucesso(resposta){
    console.log(dados);
    const idInteval = setInterval(manterConexao, 4000);
    console.log(idInteval);
}

function tratarError(error){
    console.log('deu bad');
    console.log(error.response);
    if(error.response.status === 400){
        console.log('se cadastre de novo');
        cadastrarNome();
    }

}

function manterConexao(){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', dados);
    console.log('ta indoo..')

}

function buscarMensagens(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promise.then(processarResposta);
}

function NovasMensagens(){
    buscarMensagens();
    rolagemAutomática();
}

function processarResposta(resposta){
    console.log(resposta.data);
    chat = resposta.data;
    console.log(chat.length);
    carregarMensagens();
}

function carregarMensagens(){
    const conversas = document.querySelector(".main");
    console.log(conversas);
    conversas.innerHTML = "";
    for(let i = 0; i < chat.length; i++){
        if(chat[i].type === "status"){
            conversas.innerHTML +=
             `<div class=" mensagem msg_status"> 
                <p class="horario" >${chat[i].time}  </p> 
                <p class="nome"> ${chat[i].from} </p> 
                <p>${chat[i].text}</p> 
             </div> ` ;
        }
        
        if(chat[i].type === "private_message" && chat[i].to === nomeUsuario){
            conversas.innerHTML +=
            `<div class="mensagem msg_privada"> 
            <p class="horario" > ${chat[i].time} </p> 
            <p class="nome"> ${chat[i].from} </p> 
            <p>reservadamente para</p> 
            <p class="nome"> ${chat[i].to}: </p> 
            <p>${chat[i].text}</p>
            </div>`;
        }
    
        if(chat[i].type === "message"){
            conversas.innerHTML +=
            `<div class="mensagem"> 
            <p class="horario" > ${chat[i].time} </p> 
            <p class="nome"> ${chat[i].from} </p> 
            <p>para</p>  
            <p class="nome"> ${chat[i].to}: </p> 
            <p>${chat[i].text}</p> 
            </div>`;
        }
    }
     
}

function rolagemAutomática(){
    const mensagens = document.querySelectorAll(".mensagem");
    const ultimaMensagem = mensagens[(mensagens.length - 1)]
    console.log(ultimaMensagem);
    ultimaMensagem.scrollIntoView();
}


cadastrarNome();
buscarMensagens();
const idInteval = setInterval(NovasMensagens, 3000);
console.log(idInteval);




//{
//from: "João",
 //   to: "Todos",
 //   text: "entra na sala...",
  //  type: "status",
    //time: "08:01:17"
//},