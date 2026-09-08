import { generateText } from "ai";

// Allow responses up to 5 minutes
export const maxDuration = 300;

export async function POST(req: Request) {
    const { query }: { query: string } = await req.json();


    const summary = await generateText({
        model: "zai/glm-5.3-flash",
        prompt: `Generate a concise name for a chat based on the first message sent by the user. The name should be 3-8 words long, and be grounded in relevance. The name should be a title case, and you can use numbers. You should not include any special characters, punctuation or emojis.\n\n# User message\n${query}`,
        reasoning: "none",
    });
    return Response.json({ name: summary.text });
}
