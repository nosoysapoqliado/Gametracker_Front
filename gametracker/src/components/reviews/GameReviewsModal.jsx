import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/reviewService';
import ReviewForm from './ReviewForm';
import './GameReviewsModal.css';

// mode: 'list' | 'add' | 'edit' | 'delete'
const GameReviewsModal = ({ game, mode = 'list', onClose }) => {
  const juegoId = game?._id || game?.id;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeMode, setActiveMode] = useState(mode);
  const [editingReview, setEditingReview] = useState(null);

  const loadReviews = async () => {
    if (!juegoId) return;
    setLoading(true);
    setError('');
    try {
      const data = await reviewService.getByGameId(juegoId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, [juegoId]);
  useEffect(() => { setActiveMode(mode); }, [mode]);

  const handleAddSubmit = async (payload) => {
    try {
      await reviewService.create({ ...payload, juegoId });
      await loadReviews();
      setActiveMode('list');
    } catch (err) {
      console.error(err);
      alert(`No se pudo crear la reseña: ${err?.message || ''}`);
    }
  };

  const handleEditStart = (r) => {
    setEditingReview(r);
    setActiveMode('edit');
  };

  const handleEditSubmit = async (payload) => {
    if (!editingReview) return;
    try {
      await reviewService.update(editingReview._id || editingReview.id, payload);
      await loadReviews();
      setEditingReview(null);
      setActiveMode('list');
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar la reseña');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar reseña?')) return;
    try {
      await reviewService.remove(id);
      await loadReviews();
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la reseña');
    }
  };

  return (
    <div className="reviews-overlay" role="dialog" aria-modal="true">
      <div className="reviews-modal">
        <header className="reviews-header">
          <h3>Reseñas: {game.titulo || game.name}</h3>
          <button className="close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <div className="reviews-body">
          {activeMode === 'add' && (
            <ReviewForm onSubmit={handleAddSubmit} onCancel={() => setActiveMode('list')} />
          )}
          {activeMode === 'edit' && (
            <ReviewForm initial={editingReview} onSubmit={handleEditSubmit} onCancel={() => setActiveMode('list')} />
          )}
          {activeMode === 'list' && (
            <>
              <div className="toolbar">
                <button className="btn-update" onClick={() => setActiveMode('add')}>+ Agregar reseña</button>
              </div>
              {loading ? (
                <div className="loading">Cargando reseñas...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : reviews.length === 0 ? (
                <div className="empty">Aún no hay reseñas para este juego.</div>
              ) : (
                <ul className="reviews-list">
                  {reviews.map(r => (
                    <li key={r._id || r.id} className="review-item">
                      <div className="meta">
                        <span>⭐ {r.puntuacion}/5</span>
                        <span>• {r.horasJugadas ?? 0}h</span>
                        {r.dificultad && <span>• {r.dificultad}</span>}
                        {r.recomendaria && <span className="recommend">• Recomendado</span>}
                      </div>
                      {r.textoResena && <p className="text">{r.textoResena}</p>}
                      <div className="item-actions">
                        <button className="btn-update" onClick={() => handleEditStart(r)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(r._id || r.id)}>Eliminar</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        <footer className="reviews-footer">
          {activeMode !== 'list' && (
            <button className="btn-secondary" onClick={() => setActiveMode('list')}>Volver</button>
          )}
          <button className="btn-secondary" onClick={onClose}>Cerrar</button>
        </footer>
      </div>
    </div>
  );
};

export default GameReviewsModal;