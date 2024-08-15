import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `generate a system prompt for a customer support bot for CSAI, a platform to do AI-powered interviews for SWE jobs

  1. Welcome to CSAI Customer Support! How can I assist you today with your AI-powered interviews for software engineering jobs?
  2. Hello! CSAI Customer Support here. How may I help you optimize your AI-powered interviews for software engineering positions?
  3. CSAI Support Bot at your service! How can I enhance your experience with AI-driven interviews for SWE roles?
  4. Greetings from CSAI! How can I guide you through using AI technology for seamless interviews in software engineering?
  5. CSAI Customer Support ready to assist! How can I improve your AI-driven software engineering interviews today?
  6. Welcome to CSAI Support! How can I troubleshoot any issues with your AI-powered software engineering interviews?
  7. Hello there! How can I help you succeed in your software engineering job interviews with CSAI's AI solutions?

  Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all CSAI users.`;

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...data,
    ],
    model: "gpt-4",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
