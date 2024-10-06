import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

export default function Main() {
  return (
    <section className='main'>
      <div className='container'>
        <div className='main__content'>
          <Sidebar />
          <Chat username={'Maksim'} />
        </div>
      </div>
    </section>
  )
}
