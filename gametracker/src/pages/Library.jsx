import React, { useState, useEffect, useMemo } from 'react';
import GameCard from '../components/cards/GameCard';
import GameDetail from '../components/details/GameDetail';
import GameReviewsModal from '../components/reviews/GameReviewsModal';
import { API_URL } from '../config/api';
import './Library.css';

const Library = ({ refreshTrigger = 0, apiUrl = API_URL, onEditGame, searchTerm = '' }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [reviewsGame, setReviewsGame] = useState(null);
  const [reviewsMode, setReviewsMode] = useState('list');

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la lista de juegos. Verifica el backend.');
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [apiUrl, refreshTrigger]);

  // Filtrar exclusivamente por título (titulo/name/title)
  const filteredGames = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return games;
    return games.filter(g => {
      const title = (g.titulo || g.name || g.title || '').toString().toLowerCase();
      return title.includes(q);
    });
  }, [games, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar juego?')) return;
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setGames(prev => prev.filter(g => (g._id || g.id) !== id));
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el juego');
    }
  };

  const handleUpdate = (game) => {
    if (typeof onEditGame === 'function') {
      onEditGame({
        id: game._id || game.id,
        titulo: game.titulo,
        genero: game.genero,
        plataforma: game.plataforma,
        anioLanzamiento: game.anioLanzamiento,
        desarrollador: game.desarrollador,
        imagenPortada: game.imagenPortada,
        descripcion: game.descripcion,
        completado: game.completado
      });
    }
  };

  const handleOpenDetail = (game) => {
    setSelectedGame(game);
  };

  const handleCloseDetail = () => {
    setSelectedGame(null);
  };

  const handleAddReview = (game) => {
    setReviewsGame(game);
    setReviewsMode('add');
  };
  const handleEditReview = (game) => {
    setReviewsGame(game);
    setReviewsMode('list'); // se selecciona desde la lista para editar
  };
  const handleDeleteReview = (game) => {
    setReviewsGame(game);
    setReviewsMode('list'); // se elimina desde la lista
  };
  const handleCloseReviews = () => {
    setReviewsGame(null);
    setReviewsMode('list');
  };

  return (
    <div className="library-container">
      <section className="games-section">
        {loading ? (
          <div className="loading">Cargando juegos...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredGames.length === 0 ? (
          <div className="empty-library">
            <h2>Tu biblioteca está vacía</h2>
            <p>Agrega juegos para comenzar tu colección</p>
          </div>
        ) : (
          <div className="games-grid">
            {filteredGames.map(game => (
              <GameCard
                key={game._id || game.id}
                game={game}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onOpen={handleOpenDetail}
                onAddReview={handleAddReview}
                onEditReview={handleEditReview}
                onDeleteReview={handleDeleteReview}
              />
            ))}
          </div>
        )}
      </section>

      {selectedGame && (
        <GameDetail
          game={selectedGame}
          onClose={handleCloseDetail}
          onAddReview={handleAddReview}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
        />
      )}
      {reviewsGame && (
        <GameReviewsModal game={reviewsGame} mode={reviewsMode} onClose={handleCloseReviews} />
      )}
    </div>
  );
};

export default Library;
