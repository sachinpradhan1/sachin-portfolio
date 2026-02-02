// Cloudinary Configuration
// Sign up at https://cloudinary.com and get your cloud name from the dashboard

export const CLOUDINARY_CONFIG = {
    // Replace with your Cloudinary cloud name (found in Dashboard)
    cloudName: 'diaj4r0ie',

    // Upload preset - create one in Settings > Upload > Upload presets (set to unsigned)
    uploadPreset: 'portfolio_videos', // Create this preset in your Cloudinary dashboard
};

// Helper to build Cloudinary video URL
export const getCloudinaryVideoUrl = (publicId: string): string => {
    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload/${publicId}`;
};

// Helper to build Cloudinary thumbnail URL
export const getCloudinaryThumbnailUrl = (publicId: string): string => {
    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload/so_0,w_800,h_450,c_fill/${publicId}.jpg`;
};
