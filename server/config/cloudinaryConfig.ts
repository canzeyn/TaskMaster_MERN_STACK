import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({  // kullanıcıların fotoğraflarını cloudinaryde saklanacağı için bağlantı bilgileri burada ayarlanıyor
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinaryV2;