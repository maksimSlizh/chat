import React from 'react';

const Message = ({ avatar, text, time, isUserMessage }) => {
  return (
    <div className={`message ${isUserMessage ? 'message--user' : ''}`}>
      {!isUserMessage && avatar && <img src={avatar} alt="Avatar" className="message__avatar" />}
      <div className="message__bubble">
        <p className="message__text">{text}</p>
        <span className="message__time">{time}</span>
      </div>
      {isUserMessage && avatar && <img src={avatar} alt="Avatar" className="message__avatar" />}
    </div>
  );
};

export default Message;
