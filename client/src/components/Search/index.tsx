import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CiSearch } from "react-icons/ci";
import { searchUsers, clearSearchResults } from '../../redux/usersSlice';
import unknown from '../../assets/images/images.jpeg';

export default function Search({ onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.users);
  const avatarSrc = unknown;

  useEffect(() => {
    if (searchTerm.trim()) {
      dispatch(searchUsers(searchTerm))
    } else {
      dispatch(clearSearchResults())
    }
  }, [searchTerm, dispatch])

  const handleSelectUser = (user) => {
    onSelectUser(user)
    setSearchTerm('')
    dispatch(clearSearchResults())
  };

  return (
    <div className='search'>
      <form className='search__form' onSubmit={(e) => e.preventDefault()}>
        <input
          className='search__input'
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className='search__button' type="submit">
          <CiSearch />
        </button>
      </form>

      {/* Модальное окно с результатами поиска */}
      {searchResults.length > 0 && (
        <div className='search__results'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            searchResults.map((user) => (
              <div
                key={user.id}
                className='search__result-item'
                onClick={() => handleSelectUser(user)}
              >
                <img src={user.avatar ? `http://localhost:8000${user.avatar}` : avatarSrc} alt="avatar" className='search__result-avatar' />
                <p>{user.username}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
