insert into users(name, email, password, created_at, updated_at)
values
('hung','hung@gmail.com','1234','2022-11-29','2022-11-29'),
('hung1','hung1@gmail.com','1234','2022-11-29','2022-11-29');

insert into conversations(title, description, author_id, created_at, updated_at)
values
('Dev Team','Trao đổi', 1, '2022-11-29','2022-11-29');

insert into messages(conversation_id, user_id, status, message, created_at, updated_at)
values
(1,1, true,'Xin chào, mình tạo nhóm này','2022-11-29','2022-11-29'),
(1,2, true,'Xin chào, mình vừa được thêm vào nhóm này','2022-11-29','2022-11-29');

update conversations
SET last_message_id = 2
WHERE id = 1;

insert into user_conversation(user_id, conversation_id, mute, block, created_at, updated_at)
values
(1,1,false,false,'2022-11-29','2022-11-29'),
(2,1,false,false,'2022-11-29','2022-11-29');