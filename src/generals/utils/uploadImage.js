import axios from "axios";

const uploadImageToCloudinary = async (file) => {
    const cloudName = 'dyqpebht7';
    const uploadPreset = 'import_chinese_goods';
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const result = response.data;

        if (result.secure_url) {
            return {
                success: true,
                url: result.secure_url,
            };
        } else {
            throw new Error('Image upload failed: no secure URL found');
        }
    } catch (error) {
        console.error('Error uploading image: ', error);
        return error;
    }
};

export default uploadImageToCloudinary;
