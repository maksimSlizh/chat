import React, { useState } from 'react';
import { searchUsersByUsername } from '../../http/searchApi';
import { createGroupConversation } from '../../http/messageApi';
import { useDispatch } from 'react-redux';
import { fetchConversations } from '../../redux/messageSlice';
import { MdClose } from "react-icons/md";
import unknown from '../../assets/images/images.jpeg';

export default function GroupChatModal({ onClose, currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [participants, setParticipants] = useState([currentUser])
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      const results = await searchUsersByUsername(e.target.value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddParticipant = (user) => {
    if (!participants.some(participant => participant.id === user.id)) {
      setParticipants([...participants, user]);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const groupName = prompt("Enter group name");
      if (!groupName || participants.length < 2) {
        alert('Group must have at least two participants and a name');
        return;
      }

      await createGroupConversation(groupName, participants.map(p => p.id))
      alert('Group chat created successfully!');

      dispatch(fetchConversations())
      onClose()
    } catch (error) {
      alert('Failed to create group chat');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}><MdClose /></button>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }} className="modal-title">Create Group Chat</h2>

        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          className='form-control mt-4'
          onChange={handleSearch}
        />

        <ul>
          {searchResults.map(user => (
            <div key={user.id} className='d-flex gap-3 mt-3' onClick={() => handleAddParticipant(user)}>
              <img src={user.avatar ? `http://localhost:8000${user.avatar}` : unknown} alt="Avatar" className="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <span className="username">{user.username}</span>
            </div>
          ))}
        </ul>

        <h3 className='mt-5'>Participants:</h3>
        <ul>
          {participants.map(participant => (
            <div key={participant.username} className='d-flex gap-3 mt-3'>
            <img src={participant.avatar ? `http://localhost:8000${participant.avatar}` : unknown} alt="Avatar" className="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <span className="username">{participant.username}</span>
          </div>
          ))}
        </ul>

        <button className='btn btn-primary mt-4' onClick={handleCreateGroup}>Create Group</button>
      </div>
    </div>
  );
}
