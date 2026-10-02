import { generateId } from "ai";

const CDN_UPLOAD_URL = 'https://cdn.hackclub.com/api/v4/uploads';

export async function POST(request: Request) {
  const apiKey = process.env.HACKCLUB_CDN_API_KEY;
  try {
    const incoming = await request.formData();
    const files = incoming.getAll('files[]').filter((value): value is File => value instanceof File);
    if (files.length === 0) {
      return Response.json(
        { error: 'At least one file is required in the files[] field' },
        { status: 400 },
      );
    }
    const outgoing = new FormData();
    for (const file of files) {
      const filename = file.name;
      outgoing.append('files[]', file, filename);
    }

    const response = await fetch(CDN_UPLOAD_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: outgoing,
    });
    const data = await response.json()
    console.log("[uploads]", data.uploads)
    const combinedUploads = [...data.uploads.map((upload: any) => ({...upload, status: "uploaded"})), ...data.failed.map((failed: any) => ({...failed, status: "failed"}))];
    const finalUploads = combinedUploads.map((upload: any) => ({
      fileName: upload.filename,
      status: upload.status,
      size: upload.size,
      contentType: upload.content_type,
      url: upload.url,
      createdAt: new Date(upload.createdAt)
    }))
    return Response.json({
      status: "success",
      files: finalUploads
    })
  } catch (error) {
    console.error('CDN upload failed', error);
    return Response.json({ error: 'Unable to upload files' }, { status: 502 });
  }
}
