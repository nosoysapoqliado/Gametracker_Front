const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 4000;

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://jacobogarcesoquendo:aFJzVMGN3o7fA38A@cluster0.mqwbn.mongodb.net/nico_rojo";

const app = express();
app.use(cors());
app.use(express.json());

// Definir schema y modelo (coincide con los campos usados en el frontend)
const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: '' },
  price: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' }
}, { timestamps: true, versionKey: false });

const Game = mongoose.model('Game', gameSchema);

// Conectar a MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Endpoints CRUD
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Not found' });
    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

app.post('/api/games', async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      imageUrl: req.body.imageUrl
    };
    const g = new Game(payload);
    const saved = await g.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

app.put('/api/games/:id', async (req, res) => {
  try {
    const updated = await Game.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      imageUrl: req.body.imageUrl
    }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

app.delete('/api/games/:id', async (req, res) => {
  try {
    const removed = await Game.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
