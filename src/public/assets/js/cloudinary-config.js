// Configuração do Cloudinary
const CLOUDINARY_CONFIG = {
    CLOUD_NAME: 'dsh5vvzyv', 
    UPLOAD_PRESET: 'helpstress_avatars', 
    FOLDER: 'avatars',
    MAX_FILE_SIZE: 5 * 1024 * 1024, 
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
};

async function uploadToCloudinary(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
        formData.append('folder', CLOUDINARY_CONFIG.FOLDER);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('Erro no upload');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Erro no upload para Cloudinary:', error);
        throw error;
    }
}

function validateImageFile(file) {
    if (!CLOUDINARY_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, WEBP).');
        return false;
    }

    if (file.size > CLOUDINARY_CONFIG.MAX_FILE_SIZE) {
        alert('A imagem deve ter no máximo 5MB.');
        return false;
    }

    return true;
}

window.CLOUDINARY_CONFIG = CLOUDINARY_CONFIG;
window.uploadToCloudinary = uploadToCloudinary;
window.validateImageFile = validateImageFile; 