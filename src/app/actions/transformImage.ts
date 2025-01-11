'use server';

import sharp from 'sharp';

export async function transformImage(formData: FormData): Promise<{ error?: string; url?: string }> {
    try {
        const file = formData.get('image') as File | null;

        if (!file) {
            return { error: 'No image file uploaded' };
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            return { error: 'File must be an image (JPEG or PNG)' };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const image = sharp(buffer);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
            throw new Error('Unable to get image dimensions');
        }

        const targetWidth = 1920;
        const targetHeight = 1080;
        
        const scale = Math.min(
            targetWidth / metadata.width,
            targetHeight / metadata.height
        );
        
        const scaledWidth = Math.round(metadata.width * scale);
        const scaledHeight = Math.round(metadata.height * scale);
        
        const left = Math.round((targetWidth - scaledWidth) / 2);
        const top = Math.round((targetHeight - scaledHeight) / 2);
        
        const background: Buffer = await sharp(buffer)
            .resize(targetWidth, targetHeight, {
                fit: 'cover'
            })
            .blur(20)
            .toBuffer();
            
        const processedImageBuffer: Buffer = await sharp(background)
            .composite([
                {
                    input: await image
                        .resize(scaledWidth, scaledHeight, {
                            fit: 'contain',
                            background: { r: 0, g: 0, b: 0, alpha: 0 }
                        })
                        .toBuffer(),
                    top,
                    left
                }
            ])
            .jpeg()
            .toBuffer();

        const base64Image = `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}`;
        return { url: base64Image };

    } catch (error) {
        console.error('Error processing image:', error);
        return { error: 'Error processing image' };
    }
}