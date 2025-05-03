/**
 * Type pour représenter les images des produits
 */
export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  type: 'main' | 'thumbnail' | 'gallery' | 'model';
  position?: number;
  width?: number;
  height?: number;
};

/**
 * Type pour regrouper les images par catégorie
 */
export type ProductImageCollection = {
  main: ProductImage | null;
  thumbnail: ProductImage | null;
  gallery: ProductImage[];
  model: ProductImage[];
};

/**
 * Fonction utilitaire pour organiser les images par type
 */
export const organizeProductImages = (images: ProductImage[]): ProductImageCollection => {
  const result: ProductImageCollection = {
    main: null,
    thumbnail: null,
    gallery: [],
    model: []
  };

  images.forEach(image => {
    switch (image.type) {
      case 'main':
        result.main = image;
        break;
      case 'thumbnail':
        result.thumbnail = image;
        break;
      case 'gallery':
        result.gallery.push(image);
        break;
      case 'model':
        result.model.push(image);
        break;
    }
  });

  return result;
};
