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
import { searchWebTool } from '@/lib/tools/searchWeb';

const hackclub = createOpenRouter({
  apiKey: process.env.HACKCLUB_AI_API_KEY,
  baseUrl: 'https://ai.hackclub.com/proxy/v1',
});

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? '',
});


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const model = "deepseek/deepseek-v4.1-flash";
  const modelObject = (await (gateway.getAvailableModels())).models.find((m) => m.name === "google/gemma-4-31b-it");

  const result = streamText({
    model: hackclub(model),
    stopWhen: stepCountIs(5),
    system: `You are a helpful assistant that can answer questions and provide information based on the user's input. Use as friendly tone, break down concepts, topics, into multiple bullet points, blockquotes, etc for readibility. Try to be more conversational. Refrain from using collapsible lists. You have access to a web search tool to find relevant information when needed. Since you live on a new-tab page, use the search tool (only once per turn) unless for general knowledge questions you are certain of. Your country of origin is Singapore, and your name is Surf.\n\nContextual information: The date today is ${new Date().toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. The time now is ${new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}.`,
    tools: {
        searchWeb: searchWebTool
    },
    messages: await convertToModelMessages(messages),
    onEnd: ({usage})=>{
        
    }
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}