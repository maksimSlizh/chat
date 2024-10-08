import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../http/searchApi'; // Импортируйте ваш API
import './usermodal.css'

const UserListModal = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Список пользователей</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Полное имя</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default UserListModal;
