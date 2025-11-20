// Importar las imágenes
const importImage = (imageName) => {
  return new URL(`../assets/images/${imageName}`, import.meta.url).href;
};

export const gameImages = {
  getGameImage: (imageName) => importImage(imageName),
};
