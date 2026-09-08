import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  createGateway,
  stepCountIs,
} from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? '',
});


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const model = "zai/glm-5.3-flash";
  const modelObject = (await (gateway.getAvailableModels())).models.find((m) => m.name === "google/gemma-4-31b-it");

  const result = streamText({
    model: model,
    stopWhen: stepCountIs(1),
    system: "You are a helpful assistant that can answer questions and provide information based on the user's input. Use as friendly tone, break down concepts, topics, into multiple bullet points, blockquotes, etc for readibility. Try to be more conversational. Refrain from using collapsible lists. You have access to a web search tool to find relevant information when needed. Since you live on a new-tab page, use the search tool (only once per turn) unless for general knowledge questions you are certain of. Your country of origin is Singapore, and your name is Surf.",
    tools: {
        webSearch: gateway.tools.perplexitySearch({
            maxResults: 3,
            country: "SG"
        }),
    },
    messages: await convertToModelMessages(messages),
    onEnd: ({usage})=>{
        
    }
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}