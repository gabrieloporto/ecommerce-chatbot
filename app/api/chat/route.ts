import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { createDeepInfra } from "@ai-sdk/deepinfra";
import { generateText } from "ai";
import { HfInference } from "@huggingface/inference";

const HF_KEY = process.env.HUGGINGFACE_API_KEY!;
const PC_KEY = process.env.PINECONE_API_KEY!;
const DF_KEY = process.env.DEEPINFRA_API_KEY!;

const hf = new HfInference(HF_KEY);
const pc = new Pinecone({
  apiKey: PC_KEY,
});

const deepinfra = createDeepInfra({
  apiKey: DF_KEY,
});

// Modelo para embeddings
const EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    // 1. Embedear la pregunta
    const queryEmbedding = await hf.featureExtraction({
      model: EMBED_MODEL,
      inputs: message,
    });

    // 2. Buscar en Pinecone
    const index = pc.index("products");
    const results = await index.query({
      vector: queryEmbedding as number[],
      topK: 3,
      includeMetadata: true,
    });

    // 3. Construir contexto
    const context = results.matches
      .map((match) => {
        // Formatear precio con símbolo de moneda si existe
        const price = match.metadata?.price
          ? `$${match.metadata.price}`
          : "No disponible";

        // Formatear stock con unidades si existe
        const stock = match.metadata?.stock
          ? `${match.metadata.stock} unidades`
          : "No disponible";

        return `Producto: ${match.metadata?.name}
Descripción: ${match.metadata?.description}
Categoría: ${match.metadata?.category}
Precio: ${price}
Stock: ${stock}`;
      })
      .join("\n\n");

    // 4. Generar respuesta usando DeepInfra
    const { text } = await generateText({
      model: deepinfra("Qwen/Qwen2-7B-Instruct"),
      system:
        "Eres un asistente de ventas experto. Responde a la pregunta usando SOLO la información del contexto proporcionado. Si te preguntan sobre precios, interpreta los valores correctamente. Si te preguntan sobre stock, indica las unidades disponibles. Si la información no está en el contexto, indica claramente que no tienes esa información.",
      prompt: `Contexto sobre productos:\n${context}\n\nPregunta del cliente: ${message}`,
      temperature: 0.7,
      maxTokens: 500,
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error detallado:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      raw: error,
    });
    return NextResponse.json(
      {
        error:
          "Error procesando tu consulta: " +
          (error instanceof Error ? error.message : "Error desconocido"),
      },
      { status: 500 }
    );
  }
}
