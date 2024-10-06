import React from 'react'
import Signup from '../components/Auth/Signup'
import Login from '../components/Auth/Login'

export default function Auth() {
  return (
    <section className=''>
      <div className='container'>
        <Signup />
        {/* <Login /> */}
      </div>
    </section>
  )
}
