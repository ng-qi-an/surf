import { tool } from "ai";
import z from "zod/v3";

export const searchWebTool = tool({
    description: 'Get information from webpages on the web',
    inputSchema: z.object({
        query: z.string().describe("A search query to find relevant information on the web. Be specific about your search subject, contain as much keywords of the user necessary to complete the request, while still being concise. For example, should the user ask about the latest McDonald's menu, you should search 'latest McDonald's menu in Singapore' instead of just 'McDonald's'."),
    }),
    execute: async ({ query }) => {
        const response = await fetch('https://ai.hackclub.com/proxy/v1/exa/search', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + process.env.HACKCLUB_AI_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                contents: { highlights: true },
                userLocation: "SG",
                type: "fast",
                numResults: 5,
            }),
        });
        const data = await response.json();
        return {results: data.results.map((result: any) => ({
            title: result.title,
            url: result.url,
            publishedDate: result.publishedDate,
            favicon: result.favicon || result.image,
            highlights: result.highlights,
        }))};
    },
})