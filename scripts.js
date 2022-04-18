//carregar as mensagens
let chat;
let nomeUsuario;
let dados;
let mensagemDigitada;
let nomeEnviado;
let tipoMensagem;
let msgReservada = document.querySelector(".reservado");

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
    buscarMensagens();
    const idInteval2 = setInterval(NovasMensagens, 3000);
}

function tratarError(error){
    if(error.response.status === 400){
        cadastrarNome();
    }

}

function manterConexao(){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', dados);
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
        
        if(chat[i].type === "private_message" && (chat[i].to === nomeUsuario || chat[i].from === nomeUsuario)){
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

    const mensagemEnviada = {
        from: `${nomeUsuario}`,
        to: `${nomeEnviado}`,
        text: `${mensagemDigitada.value}`,
        type: `${tipoMensagem}` 
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagemEnviada);
    promise.then(NovasMensagens2);
    promise.catch(tratarError2);

}

function NovasMensagens2(){
    NovasMensagens();
    mensagemDigitada.value = "";
}

function tratarError2(){
    window.location.reload();
}


//criar bônus --> participantes ativos;

function abrirParticipantes(){
    const elemento = document.querySelector(".menu-lateral");
    elemento.classList.remove("escondido");
}

function escolherParticipante(elemento){
    nomeEnviado = elemento.querySelector(".nome-icone p").innerHTML;
    console.log(nomeEnviado);
    if(nomeEnviado !== "Todos"){
        msgReservada.innerHTML = `<p class="escondido">Enviando para ${nomeEnviado} (reservadamente)</p>`;
    }
    else{
        msgReservada.innerHTML = "";
    }
    const escolhido = document.querySelector(".participantes .escolhido");
    if(escolhido === null){
        const marcado = elemento.querySelector(".check");
        marcado.classList.remove("escondido");
        marcado.classList.add("escolhido");
    } else{
        escolhido.classList.add("escondido");
        escolhido.classList.remove("escolhido");
        const marcado = elemento.querySelector(".check");
        marcado.classList.remove("escondido");
        marcado.classList.add("escolhido");
    }
}

function escolherVisibilidade (elemento){
    tipoMensagem = elemento.querySelector(".nome-icone p").innerHTML;
    console.log(msgReservada);
    console.log(msgReservada.querySelector("p"));
    let textoMsgResevada = msgReservada.querySelector("p");

    if(tipoMensagem === "Público"){
        tipoMensagem = "message";
    } else{
        tipoMensagem = "private_message"
        textoMsgResevada.classList.remove("escondido");
    }
    const escolhido = document.querySelector(".visibilidade .escolhido");
    if(escolhido === null){
        const marcado = elemento.querySelector(".check");
        marcado.classList.remove("escondido");
        marcado.classList.add("escolhido");
    } else{
        escolhido.classList.add("escondido");
        escolhido.classList.remove("escolhido");
        const marcado = elemento.querySelector(".check");
        marcado.classList.remove("escondido");
        marcado.classList.add("escolhido");
    }
}

function retornarChat(){
    const elemento = document.querySelector(".menu-lateral");
    elemento.classList.add("escondido");
}

function solicitarParticipantes(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(addParticipantes)
}

function addParticipantes(response){
    let listaParticipantes = document.querySelector(".participantes-ativos")
    listaParticipantes.innerHTML = ` 
    <p>Escolha um contato para enviar mensagem: </p>
        <div class="ativo" onclick="escolherParticipante(this)">
            <div class="nome-icone">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
        </div>
        <ion-icon class="check escondido" name="checkmark-outline"></ion-icon>
        </div>`
   
    for(let i=0; i< response.data.length; i++){
        let nomeParticipantes = response.data[i].name;
        listaParticipantes.innerHTML += `
        <div class="ativo" onclick="escolherParticipante(this)">
                <div class="nome-icone">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${nomeParticipantes}</p>
                </div>
                <ion-icon class="check escondido" name="checkmark-outline"></ion-icon>

            </div>
        `
    }
}

//cadastrarNome();

solicitarParticipantes();