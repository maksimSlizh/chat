import React from 'react';
import { FaComments } from 'react-icons/fa'; // Иконка из react-icons

export default function NoChat() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center mx-auto">
      <FaComments className="text-light mb-4" style={{ fontSize: '50px' }} />
      <h3 className="text-light mb-3">Выберите чат, чтобы начать переписку</h3>
      <p className="text-light">Пожалуйста, выберите контакт или начните новый чат.</p>
    </div>
  );
}
