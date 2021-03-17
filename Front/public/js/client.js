const socket = io('https://agile-ravine-87873.herokuapp.com');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const welcomeDiv = document.getElementById('welcome');
const sendBtn = document.querySelector('.btn');

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){ 
        audio.play();
    }
}

const welcome = (message, position) =>{

    const welcomeMessage = document.createElement('h2');
    welcomeMessage.innerText = message;
    welcomeMessage.classList.add(position);
    welcomeDiv.append(welcomeMessage);
}


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

socket.on('dispUserName' , name=>{
    welcome(`Welcome ${name} to Chat`, 'text-center');
})

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
    audio.play();
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

sendBtn.addEventListener('click',function(e){
    let value = messageInput.value;
    if(value == ''){
        e.preventDefault();
    }
});
