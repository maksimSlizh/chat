import React from 'react'
import { IoIosSend } from "react-icons/io";

export default function Chat({username}) {
  return (
    <div className='chat'>
      <div className='chat__header'>
        <p className='chat__header-text'>To: <span className='chat__username'>{username}</span></p>
      </div>
      <div className='chat__content'></div>
      <div className='chat__send'>
        <form className='chat__form'>
          <input className='chat__input' type="text" placeholder="Type message..." />
          <button className='chat__button'>
            <IoIosSend />
          </button>
        </form>
      </div>
    </div>
  )
}
