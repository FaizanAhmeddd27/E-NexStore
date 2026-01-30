import cloudinary from '../lib/cloudinary.js';
import DatauriParser from 'datauri/parser.js';
import path from 'path';

const parser = new DatauriParser();

// Convert buffer to Data URI string
export const bufferToDataURI = (fileFormat, buffer) => {
  const formatted = parser.format(fileFormat, buffer);
  return formatted.content; // data:<mimetype>;base64,<data>
};

// Upload image to Cloudinary
export const uploadToCloudinary = async (file, folder = 'products') => {
  try {
    const fileFormat = path.extname(file.originalname).toString();
    const dataUri = bufferToDataURI(fileFormat, file.buffer);

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `ecommerce/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Image deletion failed');
  }
};