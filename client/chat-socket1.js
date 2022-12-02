const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imh1bmciLCJzdWIiOjEsImlhdCI6MTY2OTkxMTk1NCwiZXhwIjoxNjc4NTUxOTU0fQ.cL9oKfOWNLGA41M0oG4alQMubCzlaCBx7-lfZYxjsAM';
const socket = io('http://localhost:3000', {
  query: `token=${token}`,
});

const message = document.getElementById('message');
const messages = document.getElementById('messages');
const users = document.getElementById('users');

const handleSubmitNewMessage = (room) => {
  socket.emit('message', {
    room,
    user_id: 1,
    status: true,
    message: message.value,
    conversation_id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

socket.on('message', ({ message }) => {
  handleNewMessage(message);
});

const handleNewMessage = (data) => {
  messages.appendChild(buildNewMessage(data));
};

const buildNewMessage = (data) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(data));
  return li;
};

socket.on('users', (arr_user) => {
  users.innerHTML = '';
  arr_user.forEach(element => {
    handleNewUser(element);
  });
});

const handleNewUser = (data) => {
  users.innerHTML += `<li>${data}</li>`;
};

const handleSubmitRoom = () => {
  socket.emit('join', {
    room: room.value,
    user_id: 1,
  });
};

const handleSubmitLeave = () => {
  socket.emit('leave', room.value);
};
