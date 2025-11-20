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

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="row">
        <label>
          <span>Puntuación (1-5)</span>
          <input type="number" name="puntuacion" min={1} max={5} value={form.puntuacion} onChange={handleChange} required />
        </label>
        <label>
          <span>Horas jugadas</span>
          <input type="number" name="horasJugadas" min={0} value={form.horasJugadas} onChange={handleChange} />
        </label>
      </div>
      <div className="row">
        <label>
          <span>Dificultad</span>
          <select name="dificultad" value={form.dificultad} onChange={handleChange}>
            {DIFFICULTIES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="checkbox">
          <input type="checkbox" name="recomendaria" checked={form.recomendaria} onChange={handleChange} />
          <span>¿Lo recomendarías?</span>
        </label>
      </div>
      <label>
        <span>Reseña</span>
        <textarea name="textoResena" value={form.textoResena} onChange={handleChange} placeholder="Escribe tu reseña..." />
      </label>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-update">Guardar</button>
      </div>
    </form>
  );
};

export default ReviewForm;