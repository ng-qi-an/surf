export default async function uploadFiles(formData: FormData): Promise<any> {
    const response = await fetch('/api/upload', {
        body: formData,
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error(`Failed to upload files: ${response.statusText}`);
    } else {
        const data = await response.json();
        return data;
    }
}