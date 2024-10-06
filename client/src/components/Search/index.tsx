import React from 'react'
import { CiSearch } from "react-icons/ci";

export default function Search() {
  return (
    <div className='search'>
      <form className='search__form'>
        <input className='search__input' type="text" placeholder="Search..." />
        <button className='search__button' type="submit">
          <CiSearch />
        </button>
      </form>
    </div>
  )
}
