const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imh1bmciLCJzdWIiOjEsImlhdCI6MTY2OTkxMTk1NCwiZXhwIjoxNjc4NTUxOTU0fQ.cL9oKfOWNLGA41M0oG4alQMubCzlaCBx7-lfZYxjsAM';
const socket = io('http://localhost:3000', {
  query: `token=${token}`,
});

const message = document.getElementById('message');
const messages = document.getElementById('messages');
const users = document.getElementById('users');
const description_room = document.getElementById('description_room');
const name_room = document.getElementById('name_room');
const conversations = document.getElementById('conversations');
const join_room = document.getElementById('join_room');
const message_room = document.getElementById('message_room');
const add_name_room = document.getElementById('add_name_room');
const add_user_id = document.getElementById('add_user_id');

const handleSubmitNewMessage = () => {
  socket.emit('message', {
    room: message_room.value,
    user_id: 1,
    status: true,
    message: message.value,
    conversation_id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

socket.on('message', (message) => {
  messages.innerHTML = '';
  handleNewMessage(message.user_id, message.message, message.room);
});

const handleNewMessage = (user_id, message, room) => {
  messages.innerHTML += `${room}`;
  if (user_id && message) {
    messages.innerHTML += `<li>${user_id}: ${message}</li>`;
  }
};

socket.on('users', (arr_user) => {
  users.innerHTML = '';
  arr_user.forEach((element) => {
    handleNewUser(element);
  });
});

const handleNewUser = (data) => {
  users.innerHTML += `<li>${data}</li>`;
};

const handleSubmitRoom = () => {
  socket.emit('join', {
    room: join_room.value,
    user_id: 1,
  });
};

const handleSubmitLeave = () => {
  socket.emit('leave', room.value);
};

const handleSubmitCreate = () => {
  socket.emit('create', {
    room: name_room.value,
    user_id: 1,
    description: description_room.value,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

socket.on('conversations', (arr_conversation) => {
  conversations.innerHTML = '';
  arr_conversation.forEach((element) => {
    handleNewConversation(element);
  });
});
const handleNewConversation = (data) => {
  conversations.innerHTML += `<li>${data}</li>`;
};
const handleSubmitAdd = () => {
  socket.emit('join', {
    room: add_name_room.value,
    user_id: add_user_id.value,
  });
};
