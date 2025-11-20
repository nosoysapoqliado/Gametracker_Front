import React from 'react';
import './GameDetail.css';

const GameDetail = ({ game, onClose, onAddReview, onEditReview, onDeleteReview }) => {
  if (!game) return null;

  return (
    <div className="game-detail-overlay" role="dialog" aria-modal="true">
      <div className="game-detail">
        <header className="detail-header">
          <h2>{game.titulo || game.name}</h2>
          <button className="detail-close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <div className="detail-body">
          <div className="detail-cover">
            <img src={game.imagenPortada || game.imageUrl || 'https://via.placeholder.com/800x450'} alt={game.titulo || game.name} />
            {game.completado && <span className="badge completed">Completado</span>}
          </div>

          <div className="detail-info">
            <p className="meta-line"><strong>Género:</strong> {game.genero || game.category || '—'}</p>
            <p className="meta-line"><strong>Plataforma:</strong> {game.plataforma || '—'}</p>
            <p className="meta-line"><strong>Año:</strong> {game.anioLanzamiento || '—'}</p>
            <p className="meta-line"><strong>Desarrollador:</strong> {game.desarrollador || '—'}</p>

            {game.descripcion && (
              <>
                <h4>Descripción</h4>
                <p className="description">{game.descripcion}</p>
              </>
            )}
          </div>
        </div>

        <footer className="detail-footer">
          <div className="detail-actions">
            <button className="btn-update" onClick={() => onEditReview && onEditReview(game)}>Ver reseñas</button>
            <button className="btn-update" onClick={() => onAddReview && onAddReview(game)}>Agregar reseña</button>
          </div>
          <button className="btn-secondary" onClick={onClose}>Cerrar</button>
        </footer>
      </div>
    </div>
  );
};

export default GameDetail;
