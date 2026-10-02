export default async function uploadFiles(formData: FormData): Promise<any> {
    try {
        const signedIdResponse = await fetch('/api/upload/getSignedId', {
            method: 'GET',
        });
        if (!signedIdResponse.ok) {
            const error = await signedIdResponse.json();
            throw new Error(`Failed to get signed ID: ${error.error}`);
        }
        const signedIdData = await signedIdResponse.json();
        const signedId = signedIdData.id;
        const response = await fetch(`${process.env.NEXT_PUBLIC_QIAN_CDN_API_URL}/upload/${signedId}`, {
            body: formData,
            method: 'POST',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to upload files: ${error.error}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('CDN upload failed', error);
        throw new Error('Unable to upload files');
    }
}