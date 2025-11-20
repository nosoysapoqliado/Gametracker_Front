import React, { useState, useEffect } from 'react';
import './ReviewForm.css';

const DIFFICULTIES = ['Fácil', 'Normal', 'Difícil'];

const ReviewForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    puntuacion: 5,
    textoResena: '',
    horasJugadas: 0,
    dificultad: 'Normal',
    recomendaria: true,
  });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (initial) {
      setForm({
        puntuacion: initial.puntuacion ?? 5,
        textoResena: initial.textoResena ?? '',
        horasJugadas: initial.horasJugadas ?? 0,
        dificultad: initial.dificultad ?? 'Normal',
        recomendaria: !!initial.recomendaria,
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'horasJugadas' || name === 'puntuacion') ? Number(value) : value
    }));
  };

  const handleRatingClick = (rating) => {
    setForm(prev => ({ ...prev, puntuacion: rating }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="form-section">
        <label className="rating-label">
          <span>Puntuación</span>
          <div className="star-rating" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`star-btn ${star <= (hoverRating || form.puntuacion) ? 'active' : ''}`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                aria-label={`Calificar ${star} estrellas`}
              >
                ★
              </button>
            ))}
          </div>
          <input type="hidden" name="puntuacion" value={form.puntuacion} />
        </label>
      </div>

      <div className="row">
        <label className="field-with-icon">
          <span>Horas jugadas</span>
          <div className="input-wrap">
            <span className="icon">⏱️</span>
            <input
              type="number"
              name="horasJugadas"
              min={0}
              value={form.horasJugadas}
              onChange={handleChange}
              className="input-hours"
            />
          </div>
        </label>

        <label className="field-with-icon">
          <span>Dificultad</span>
          <div className="input-wrap">
            <span className="icon">📊</span>
            <select name="dificultad" value={form.dificultad} onChange={handleChange} className="input-difficulty">
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <div className="recommend-toggle-row">
        <label className="toggle-switch">
          <input type="checkbox" name="recomendaria" checked={form.recomendaria} onChange={handleChange} />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">¿Lo recomendarías?</span>
      </div>

      <label className="full-width">
        <span>Reseña</span>
        <textarea
          name="textoResena"
          value={form.textoResena}
          onChange={handleChange}
          placeholder="Comparte tu experiencia con este juego..."
          className="input-review"
        />
      </label>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar Reseña</button>
      </div>
    </form>
  );
};

export default ReviewForm;