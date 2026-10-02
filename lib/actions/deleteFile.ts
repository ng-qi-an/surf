export default async function deleteFile(fileUrl: string){
    const fileId = fileUrl.split("/")[3];
    console.log("Deleting file with URL:", fileUrl);
    console.log("Deleting file with ID:", fileId);
    const response = await fetch(`/api/delete/${fileId}`, {
        method: 'GET'
    });
    if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
    } else {
        return true;
    }
}