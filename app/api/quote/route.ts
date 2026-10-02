export async function GET() {
  const res = await fetch("https://dummyjson.com/quotes/random");
  const data = await res.json();
  console.log("Fetched quote:", data);
  return Response.json(data);
}