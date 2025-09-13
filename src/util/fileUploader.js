import axios from 'axios';
import { toast } from 'react-hot-toast';
const ACCOUNTS_URL = process.env.REACT_APP_ACCOUNTS_URL;

export const getImageUrl = async (e) => {
  const originalFile = e.target.files[0];
  if (!originalFile) return;

  const sanitizedFileName = originalFile.name.replace(/\s+/g, '_');
  const sanitizedFile = new File([originalFile], sanitizedFileName, {
    type: originalFile.type,
  });

  try {
    const data = new FormData();
    data.append('file', sanitizedFile);

    let image_url = "https://static.investindia.gov.in/s3fs-public/2024-12/image-13_1.png"

    const response = await axios.post(`${ACCOUNTS_URL}/auth/upload-image`, data);
    // return response.data.imageUrl;
    return image_url;
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred');
    throw error; 
  }
};
