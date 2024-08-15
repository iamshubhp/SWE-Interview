import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const data = await req.json();

  const hfApiUrl =
    "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"; 
  const hfApiKey = process.env.HF_API_KEY; 

  try {
    const response = await axios.post(
      hfApiUrl,
      {
        inputs: data.map((msg) => msg.content).join("\n"),
      },
      {
        headers: {
          Authorization: `Bearer ${hfApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data[0]?.generated_text;

    if (!responseData) {
      throw new Error("No generated text in response");
    }

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const text = encoder.encode(responseData);
        controller.enqueue(text);
        controller.close();
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error from Hugging Face API:", error.message);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch response from Hugging Face" }),
      { status: 500 }
    );
  }
}
