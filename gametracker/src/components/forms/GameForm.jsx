import React, { useState, useEffect, useRef } from 'react';
import './GameForm.css';

const isHttpUrl = (url) => /^https?:\/\//i.test(url);

const GENRES = ['Acción', 'RPG', 'Aventura', 'Estrategia', 'Simulación', 'Deportes', 'Indie'];
const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'Switch'];

const GameForm = ({ onClose, onGameAdded, apiUrl, gameToEdit }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    genero: '',
    plataforma: '',
    anioLanzamiento: '',
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    completado: false
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageValid, setImageValid] = useState(null); // null = unknown, true/false
  const [errors, setErrors] = useState({});
  const descMax = 800;
  const titleRef = useRef(null);

  useEffect(() => {
    if (gameToEdit) {
      setFormData({
        titulo: gameToEdit.titulo || gameToEdit.name || '',
        genero: gameToEdit.genero || '',
        plataforma: gameToEdit.plataforma || '',
        anioLanzamiento: gameToEdit.anioLanzamiento || '',
        desarrollador: gameToEdit.desarrollador || '',
        imagenPortada: gameToEdit.imagenPortada || gameToEdit.imageUrl || '',
        descripcion: gameToEdit.descripcion || '',
        completado: !!gameToEdit.completado
      });
    } else {
      setFormData({
        titulo: '',
        genero: '',
        plataforma: '',
        anioLanzamiento: '',
        desarrollador: '',
        imagenPortada: '',
        descripcion: '',
        completado: false
      });
      setImagePreview(null);
      setImageValid(null);
    }
    // autofocus title
    setTimeout(() => titleRef.current?.focus(), 50);
  }, [gameToEdit]);

  useEffect(() => {
    // validate image url when it changes
    const url = formData.imagenPortada?.trim();
    if (!url) {
      setImagePreview(null);
      setImageValid(null);
      return;
    }
    let canceled = false;
    const img = new Image();
    img.onload = () => { if (!canceled) { setImagePreview(url); setImageValid(true); } };
    img.onerror = () => { if (!canceled) { setImagePreview(null); setImageValid(false); } };
    img.src = url;
    return () => { canceled = true; };
  }, [formData.imagenPortada]);

  const canSubmit = isHttpUrl(apiUrl) && !!formData.titulo.trim() && !(errors.anio);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));

    // inline validations
    if (name === 'anioLanzamiento') {
      const year = Number(value);
      const cur = new Date().getFullYear();
      if (value && (isNaN(year) || year < 1950 || year > cur + 1)) {
        setErrors(prev => ({ ...prev, anio: 'Año inválido' }));
      } else {
        setErrors(prev => { const p = { ...prev }; delete p.anio; return p; });
      }
    }
    if (name === 'descripcion') {
      if (value.length > descMax) setErrors(prev => ({ ...prev, descripcion: 'Máximo de caracteres alcanzado' }));
      else setErrors(prev => { const p = { ...prev }; delete p.descripcion; return p; });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      alert('Completa el título y corrige los errores antes de enviar.');
      return;
    }

    const payload = {
      titulo: formData.titulo,
      genero: formData.genero || '',
      plataforma: formData.plataforma || '',
      anioLanzamiento: formData.anioLanzamiento ? Number(formData.anioLanzamiento) : undefined,
      desarrollador: formData.desarrollador || '',
      imagenPortada: formData.imagenPortada || '',
      descripcion: formData.descripcion || '',
      completado: !!formData.completado,
      fechaCreacion: new Date()
    };

    try {
      const url = gameToEdit && (gameToEdit._id || gameToEdit.id) ? `${apiUrl}/${(gameToEdit._id || gameToEdit.id)}` : apiUrl;
      const method = gameToEdit && (gameToEdit._id || gameToEdit.id) ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${text}`);
      }
      if (onGameAdded) onGameAdded();
      onClose();
    } catch (err) {
      console.error('Error saving game:', err);
      alert('Error al guardar el juego. Revisa la consola.');
    }
  };

  return (
    <div className="game-form-overlay" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <div className="game-form modal-grid">
        <header className="form-header">
          <div className="header-left">
            <h2 id="form-title" className="form-title">{gameToEdit ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h2>
            <div className="form-sub">Agrega información clave del juego. Campos marcados con * obligatorios.</div>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar formulario">×</button>
        </header>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="col-left">
            {/* TÍTULO con icono y estilo destacado */}
            <label className="field-with-icon">
              <span>Título *</span>
              <div className="input-wrap">
                <span className="icon">🎮</span>
                <input
                  ref={titleRef}
                  name="titulo"
                  className="input-title"
                  placeholder="Título del juego"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <div className="two-cols">
              <label>
                <span>Género</span>
                <input name="genero" list="genres" placeholder="Ej: Acción" value={formData.genero} onChange={handleChange} />
                <datalist id="genres">{GENRES.map(g => <option key={g} value={g} />)}</datalist>
              </label>

              <label>
                <span>Plataforma</span>
                <input name="plataforma" list="platforms" placeholder="PC, PlayStation..." value={formData.plataforma} onChange={handleChange} />
                <datalist id="platforms">{PLATFORMS.map(p => <option key={p} value={p} />)}</datalist>
              </label>
            </div>

            <div className="two-cols">
              <label>
                <span>Año</span>
                <input name="anioLanzamiento" placeholder="2023" value={formData.anioLanzamiento} onChange={handleChange} type="number" />
                {errors.anio && <small className="field-error">{errors.anio}</small>}
              </label>

              {/* DESARROLLADOR con icono */}
              <label className="field-with-icon">
                <span>Desarrollador</span>
                <div className="input-wrap">
                  <span className="icon">🏷️</span>
                  <input name="desarrollador" className="input-developer" placeholder="Estudio" value={formData.desarrollador} onChange={handleChange} />
                </div>
              </label>
            </div>

            <label className="full-width">
              <span>Descripción</span>
              <textarea name="descripcion" placeholder="Breve descripción" value={formData.descripcion} onChange={handleChange} rows={4} maxLength={descMax} />
              <div className="desc-row">
                <small className="char-count">{formData.descripcion.length}/{descMax}</small>
                {errors.descripcion && <small className="field-error">{errors.descripcion}</small>}
              </div>
            </label>

            <label className="checkbox-row">
              <input type="checkbox" name="completado" checked={formData.completado} onChange={handleChange} />
              <span>Completado</span>
            </label>
          </div>

          <div className="col-right">
            {/* IMAGE URL con icono */}
            <label className="field-with-icon">
              <span>Imagen portada (URL)</span>
              <div className="input-wrap">
                <span className="icon">🖼️</span>
                <input name="imagenPortada" className="input-url" placeholder="https://..." value={formData.imagenPortada} onChange={handleChange} />
              </div>
            </label>

            <div className="image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" />
              ) : (
                <div className={`preview-placeholder ${imageValid === false ? 'invalid' : ''}`}>
                  {imageValid === false ? 'URL inválida' : 'Previsualización de portada'}
                </div>
              )}
              {imageValid === true && <div className="preview-badge">Imagen válida</div>}
            </div>

            <div className="help">
              <small>Consejo: usa una URL directa a la imagen. El título es obligatorio.</small>
            </div>

            <footer className="form-footer">
              <div className="footer-left">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
              </div>
              <div className="footer-right">
                <button type="submit" className="btn-primary" disabled={!canSubmit}>
                  {gameToEdit ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </footer>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameForm;
