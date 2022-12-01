const socket = io('http://localhost:3000', {
  query:
    'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imh1bmciLCJzdWIiOjEsImlhdCI6MTY2OTg1ODE4NywiZXhwIjoxNjY5OTQ0NTg3fQ.YLfn5fpjxJiF2-eU10o6cy0sGz5rRbuwExAhC96DODE',
});

const message = document.getElementById('message');
const messages = document.getElementById('messages');

const handleSubmitNewMessage = () => {
  socket.emit('message', {
    user_id: 1,
    status: true,
    message: message.value,
    conversation_id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

// socket.on('message', ({ data }) => {
//   console.log(data);
//   handleNewMessage(data);
// });

// const handleNewMessage = (data) => {
//   messages.appendChild(buildNewMessage(data));
// };

// const buildNewMessage = (data) => {
//   const li = document.createElement('li');
//   li.appendChild(document.createTextNode(data));
//   return li;
// };

const handleSubmitNewRoom = () => {
  socket.emit('room', room.value);
};
