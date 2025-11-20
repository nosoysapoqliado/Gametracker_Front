import React from 'react';
import './Store.css';

const Store = () => {
  return (
    <div className="store-container">
      <div className="sidebar">
        <div className="filter-section">
          <h3>CATEGORÍAS</h3>
        </div>
      </div>
      <div className="store-content">
        <div className="empty-store">
          <h2>Tienda en construcción</h2>
          <p>Próximamente podrás encontrar aquí los mejores juegos</p>
        </div>
      </div>
    </div>
  );
};

export default Store;
