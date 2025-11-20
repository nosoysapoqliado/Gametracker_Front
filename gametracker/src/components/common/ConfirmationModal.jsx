import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-overlay" role="dialog" aria-modal="true">
      <div className="confirmation-modal">
        <div className="confirmation-body">
          <p>{message || '¿Estás seguro?'}</p>
        </div>
        <div className="confirmation-footer">
          <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
          <button className="btn-confirm" onClick={onConfirm}>Sí, borrar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
