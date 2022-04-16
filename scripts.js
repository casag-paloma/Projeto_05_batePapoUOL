//carregar as mensagens
let chat;
let nomeUsuario;
let dados;
let mensagemDigitada;

function pedirNome(){
    nomeUsuario = prompt('Qual é o seu nome de usuário?');
}

function cadastrarNome(){
    pedirNome();
    dados = {
        name: nomeUsuario
      };
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados);
    promessa.then(tratarSucesso);
    promessa.catch(tratarError);

}

function tratarSucesso(resposta){
    const idInteval = setInterval(manterConexao, 4000);
    console.log(idInteval);
    buscarMensagens();
    const idInteval2 = setInterval(NovasMensagens, 3000);
    console.log(idInteval2);
}

function tratarError(error){
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
    chat = resposta.data;
    carregarMensagens();
}

function carregarMensagens(){
    const conversas = document.querySelector(".main");
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
    ultimaMensagem.scrollIntoView();
}

function enviarMensagens(){
    mensagemDigitada = document.querySelector('input');
    console.log(mensagemDigitada.value)

    const mensagemEnviada = {
        from: `${nomeUsuario}`,
        to: "Todos",
        text: `${mensagemDigitada.value}`,
        type: "message" 
    }

    console.log(mensagemEnviada)

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagemEnviada);
    promise.then(NovasMensagens2);
    promise.catch(tratarError2);

}

function NovasMensagens2(){
    NovasMensagens();
    mensagemDigitada.value = "";
    console.log('zerou mensagem');
}

function tratarError2(){
    window.location.reload();
}

cadastrarNome();
