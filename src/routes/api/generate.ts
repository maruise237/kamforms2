import { createOpenAI } from "@ai-sdk/openai";
import { createFileRoute } from '@tanstack/react-router'
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { streamObject } from "ai";
import { aiFormSchema } from "@/form-builder/lib/ai-form-schema";

const deepseek = createOpenAI({
	apiKey: process.env.DEEPSEEK_API_KEY,
	baseURL: process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/v1',
})

const hasUpstashRestConfig =
	!!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

const ratelimit = hasUpstashRestConfig
	? new Ratelimit({
			redis: new Redis({
				url: process.env.UPSTASH_REDIS_REST_URL!,
				token: process.env.UPSTASH_REDIS_REST_TOKEN!,
			}),
			limiter: Ratelimit.slidingWindow(10, "10 s"),
			analytics: true,
		})
	: null

const responseHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Content-Type': 'text/plain; charset=utf-8',
}

export const Route = createFileRoute('/api/generate')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          let prompt = '';
          
          // Try to get prompt from body first (useObject sends data via submit())
          try {
            const body = await request.json();
            prompt = body.prompt || '';
          } catch (bodyError) {
            // Body might not be JSON or might be empty
            console.warn('Could not parse request body:', bodyError);
          }
          
          // Fallback to query params if body didn't have prompt
          if (!prompt) {
            const url = new URL(request.url);
            prompt = url.searchParams.get('prompt') || '';
          }

          if (!prompt.trim()) {
            return new Response(
              JSON.stringify({ error: 'Prompt is required' }),
              {
                status: 400,
                headers: {
                  ...responseHeaders,
                  'Content-Type': 'application/json',
                },
              }
            );
          }

          // Rate limiting only runs when Upstash REST credentials are configured.
          if (process.env.NODE_ENV !== "development" && ratelimit) {
            try {
              const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
              const { success, limit, reset, remaining } = await ratelimit.limit(ip);

              if (!success) {
                return new Response(
                  JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
                  {
                    status: 429,
                    headers: {
                      ...responseHeaders,
                      'Content-Type': 'application/json',
                      "X-RateLimit-Limit": limit.toString(),
                      "X-RateLimit-Remaining": remaining.toString(),
                      "X-RateLimit-Reset": reset.toString(),
                    },
                  }
                );
              }
            } catch (rateLimitError) {
              console.error('Rate limit error:', rateLimitError);
              // Continue without rate limiting if Redis fails
            }
          }

          // Check for DeepSeek API key
          if (!process.env.DEEPSEEK_API_KEY) {
            console.error('DEEPSEEK_API_KEY is not set');
            return new Response(
              JSON.stringify({ error: 'DeepSeek API key is not configured' }),
              {
                status: 500,
                headers: {
                  ...responseHeaders,
                  'Content-Type': 'application/json',
                },
              }
            );
          }

          const res = streamObject({
											// @ts-expect-error - error message is verbose and messy, type mismatch between AI SDK versions
											model: deepseek.chat(process.env.DEEPSEEK_MODEL ?? 'deepseek-chat'),
											schema: aiFormSchema,
											prompt: prompt,
											system:
												'You are an expert form generator. Your task is to convert natural language form descriptions into structured JSON that matches the provided Zod schema.\n\n' +
												'Key instructions:\n' +
												"- Generate form elements (fields) based on the user's natural language description\n" +
												'- The schema supports both interactive input fields (Input, Select, Checkbox, etc.) and static text elements (H1, H2, H3, Paragraph)\n' +
												'- Use text elements (H1, H2, H3, Paragraph) to add titles, descriptions, and section headers as needed\n' +
												'- Ignore submit buttons, action buttons, or any form submission controls in the output\n' +
												'- Ensure all generated JSON strictly adheres to the provided Zod schema structure\n' +
												'- Include all required fields (id, name, label, fieldType, etc.) for each element\n' +
												'- Generate unique IDs for each form element\n' +
												"- Interpret the user's requirements comprehensively and include all necessary form fields",
											maxRetries: 2,
											onError: (event) => {
												console.error('Stream error:', event.error)
											},
											output: 'object',
										})
          
          return res.toTextStreamResponse();
        } catch (error) {
          console.error('API error:', error);
          return new Response(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'An unexpected error occurred',
            }),
            {
              status: 500,
              headers: {
                ...responseHeaders,
                'Content-Type': 'application/json',
              },
            }
          );
        }
      }
    }
  }
})
