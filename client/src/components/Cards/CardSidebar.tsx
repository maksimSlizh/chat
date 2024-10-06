import React from 'react'
import unknown from '../../assets/images/images.jpeg'

export default function CardSidebar({avatar, username, message}) {
  return (
    <div className='sidebar__card'>
      <img src={avatar ? avatar : unknown} className='sidebar__avatar' alt="avatar" />
      <div className='d-flex flex-column sidebar__info gap-2'>
        <h5 className='text-light sidebar__username'>{username}</h5>
        <p className='text-light sidebar__text'>{message}</p>
      </div>
    </div>
  )
}
