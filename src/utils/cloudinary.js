import axios from 'axios'

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file, folder = 'trueque') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return {
      success: true,
      url: response.data.secure_url,
      publicId: response.data.public_id
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function uploadMultipleToCloudinary(files, folder = 'trueque') {
  const uploadPromises = Array.from(files).map(file => 
    uploadToCloudinary(file, folder)
  )
  
  const results = await Promise.all(uploadPromises)
  const successfulUploads = results
    .filter(r => r.success)
    .map(r => r.url)
    
  return successfulUploads
}