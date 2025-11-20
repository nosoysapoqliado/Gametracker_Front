const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://jacobogarcesoquendo:aFJzVMGN3o7fA38A@cluster0.mqwbn.mongodb.net/nico_rojo";

const gameSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  imageUrl: String
}, { timestamps: true, versionKey: false });

const Game = mongoose.model('Game', gameSchema);

const examples = [
  { name: "The Legend of Zelda", category: "Adventure", price: 59, imageUrl: "" },
  { name: "Super Mario Odyssey", category: "Platform", price: 49, imageUrl: "" },
  { name: "God of War", category: "Action", price: 39, imageUrl: "" }
];

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');
  await Game.deleteMany({});
  const inserted = await Game.insertMany(examples);
  console.log('Inserted', inserted.length, 'games');
  mongoose.disconnect();
}

run().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
