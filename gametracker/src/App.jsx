import React, { useState } from 'react';
import Library from './pages/Library';
import GameForm from './components/forms/GameForm';
import { API_URL } from './config/api';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [gameToEdit, setGameToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- nuevo estado

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const openAdd = () => {
    setGameToEdit(null);
    setShowForm(true);
  };

  const handleEditRequest = (game) => {
    setGameToEdit(game);
    setShowForm(true);
  };

  const handleGameAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowForm(false);
    setGameToEdit(null);
  };

  return (
    <div className="app">
      <nav className="top-nav">
        <div className="nav-sections">
          <div className="nav-title">BIBLIOTECA</div> {/* ya no es botón */}
          <button className="nav-button add-game" onClick={openAdd}>
            + AGREGAR JUEGO
          </button>
          <button className="nav-button refresh" onClick={handleRefresh}>
            ↻ ACTUALIZAR
          </button>
        </div>
        <div className="nav-controls">
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // <-- enlaza búsqueda
          />
        </div>
      </nav>

      <main className="main-content">
        {showForm && (
          <GameForm
            onClose={() => { setShowForm(false); setGameToEdit(null); }}
            onGameAdded={handleGameAdded}
            apiUrl={API_URL}
            gameToEdit={gameToEdit}
          />
        )}
        <Library
          refreshTrigger={refreshTrigger}
          apiUrl={API_URL}
          onEditGame={handleEditRequest}
          searchTerm={searchTerm} // <-- paso el término a Library
        />
      </main>
    </div>
  );
}

export default App;
