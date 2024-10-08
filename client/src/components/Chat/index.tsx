import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosSend } from "react-icons/io";
import Message from '../Message';
import { sendMessage, sendGroupMessage, addNewMessage } from '../../redux/messageSlice';
import unknown from '../../assets/images/images.jpeg';
import { useSocketContext } from '../../context/socketContext'
import { fetchConversations } from '../../redux/messageSlice'

export default function Chat() {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, selectedConversation, selectedUser } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const { socket } = useSocketContext()
  const userId = JSON.parse(localStorage.getItem('user')).id
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (inputMessage.trim() !== '') {
      if (selectedConversation) {
        if (selectedConversation.groupName) {
          dispatch(sendGroupMessage({
            message: inputMessage,
            conversationId: selectedConversation.id,
          }));
        } else {
          dispatch(sendMessage({
            message: inputMessage,
            receiverId: selectedConversation.otherParticipants[0].id,
          }));
        }
      } else if (selectedUser) {
        dispatch(sendMessage({
          message: inputMessage,
          receiverId: selectedUser.id,
        }));
      }
      setInputMessage('');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (newMessage) => {
        dispatch(addNewMessage(newMessage));
        dispatch(fetchConversations())
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage')
      }
    };
  }, [socket, dispatch])

  const chatTitle = selectedConversation?.groupName || selectedUser?.username || selectedConversation?.otherParticipants[0]?.username || 'No title';

  return (
    <div className='chat'>
      <div className='chat__header'>
        <p className='chat__header-text'>To: <span className='chat__username'>{chatTitle}</span></p>
      </div>

      <div className='chat__content'>
        {selectedConversation ? (
          messages.map((message) => {
            const isUserMessage = message.userId === userId

            return (
              <Message
                key={message.id}
                avatar={message.avatar ? `http://localhost:8000${message.avatar}` : unknown}
                text={message.message}
                time={new Date(message.createdAt).toLocaleTimeString()}
                isUserMessage={isUserMessage}
              />
            );
          })
        ) : selectedUser ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          <p>Please select a user to chat.</p>
        )}
      </div>

      <div className='chat__send'>
        <form className='chat__form' onSubmit={handleSendMessage}>
          <input
            className='chat__input'
            type="text"
            placeholder="Type message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button className='chat__button' type="submit">
            <IoIosSend />
          </button>
        </form>
      </div>
    </div>
  );
}
