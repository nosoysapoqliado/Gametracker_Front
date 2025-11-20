import React from 'react';
import './GameCard.css';

const GameCard = ({ game, onDelete, onUpdate, onOpen, onAddReview, onEditReview, onDeleteReview }) => {
  const id = game._id || game.id;
  return (
    <article className="game-card" onClick={() => onOpen && onOpen(game)}>
      <div className="cover-wrap">
        <img
          src={game.imagenPortada || game.imageUrl || 'https://via.placeholder.com/600x340'}
          alt={game.titulo || game.name || 'Juego'}
          className="game-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/600x340'; }}
        />
        {game.completado && <span className="badge completed">Completado</span>}
      </div>

      <div className="game-body">
        <h3 className="game-title">{game.titulo || game.name}</h3>
        <div className="meta">
          <span className="genre">{game.genero || game.category}</span>
          {game.plataforma && <span className="platform">• {game.plataforma}</span>}
          {game.anioLanzamiento && <span className="year">• {game.anioLanzamiento}</span>}
        </div>
        {game.descripcion && <p className="description-preview">{game.descripcion}</p>}
        <div className="game-footer">
          <div className="developer">{game.desarrollador}</div>
          <div className="actions">
            <button
              className="btn-update"
              onClick={(e) => { e.stopPropagation(); onUpdate && onUpdate(game); }}
            >
              Editar
            </button>
            <button
              className="btn-delete"
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(id); }}
            >
              Eliminar
            </button>
          </div>

        </div>
      </div>
    </article>
  );
};

export default GameCard;
