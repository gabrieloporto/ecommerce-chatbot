import { Pinecone } from "@pinecone-database/pinecone";
import { products } from "../app/data/products";
import { HfInference } from "@huggingface/inference";

const HF_KEY = process.env.HUGGINGFACE_API_KEY!;
const PC_KEY = process.env.PINECONE_API_KEY!;

const hf = new HfInference(HF_KEY);
const pc = new Pinecone({
  apiKey: PC_KEY,
});

async function main() {
  const indexName = "products";
  const indexList = await pc.listIndexes();

  if (!indexList.indexes?.find((i) => i.name === indexName)) {
    await pc.createIndex({
      name: indexName,
      dimension: 384,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });

    console.log(`Índice ${indexName} creado`);
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }

  const index = pc.index(indexName);

  for (const product of products) {
    // Incluir precio y stock en el texto para mejorar la búsqueda
    const text = `Nombre: ${product.name}\nDescripción: ${
      product.description
    }\nCategoría: ${product.category}\nPrecio: $${product.price}\nStock: ${
      product.stock || 0
    }`;

    const embedding = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    await index.upsert([
      {
        id: product.id.toString(),
        values: embedding as number[],
        metadata: {
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price.toString(), // Convertir a string para consistencia
          stock: (product.stock || 0).toString(), // Añadir stock y convertir a string
        },
      },
    ]);
  }

  console.log("Embeddings subidos exitosamente!");
}

main().catch(console.error);
