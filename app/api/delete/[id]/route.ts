const CDN_UPLOAD_URL = 'https://cdn.hackclub.com/api/v4/upload';

export async function GET(req: Request, {params}: {params: Promise<{id: string}>}) {
    const { id } = await params;
    const apiKey = process.env.HACKCLUB_CDN_API_KEY;
    console.log("Deleting file with ID:", id);
    try {
        const response = await fetch(`${CDN_UPLOAD_URL}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${apiKey}` },
        });
        console.log(response)
        if (!response.ok) {
            return Response.json({ error: 'Unable to delete file' }, { status: 502 });
        } else {
            return Response.json({ status: 'success' });
        }
    } catch (error) {
        console.error('CDN delete failed', error);
        return Response.json({ error: 'Unable to delete file' }, { status: 502 });
    }
}