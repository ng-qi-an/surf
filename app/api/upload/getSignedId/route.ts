export async function GET(req: Request) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_QIAN_CDN_API_URL}/upload/createSignedID`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${process.env.QIAN_CDN_API_KEY}` },
    })
    const data = await response.json()
    console.log("Get signed ID response:", data)
    return Response.json(data)
}