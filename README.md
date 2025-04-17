# 🛍️ Ecommerce Chatbot con RAG + IA

Este proyecto es una aplicación fullstack de un ecommerce con un chatbot inteligente integrado. El asistente es capaz de responder preguntas sobre los productos, como precios, stock y descripciones, utilizando únicamente información real extraída desde una base vectorial (RAG: Retrieval-Augmented Generation).

---

## 🚀 Características principales

- **Búsqueda semántica**: Utiliza Pinecone para encontrar productos relevantes en base al significado de la consulta del usuario.
- **Chatbot con IA**: Genera respuestas naturales y precisas con el modelo `Qwen2-7B-Instruct` de DeepInfra.
- **Embeddings con HuggingFace**: Usa el modelo `sentence-transformers/all-MiniLM-L6-v2` para convertir texto en vectores.
- **Arquitectura RAG**: Recupera contexto relevante y lo combina con generación de texto.
- **Desplegable fácilmente**: Preparado para ambientes de producción.

---

## 🛠️ Tecnologías usadas

| Función                  | Tecnología                           |
| ------------------------ | ------------------------------------ |
| FullStack                | Next.js (App Router) + React         |
| Base vectorial           | Pinecone                             |
| Generación de texto      | DeepInfra (modelo Qwen2-7B-Instruct) |
| Generación de embeddings | HuggingFace Inference API            |

---

## 🧠 ¿Cómo funciona?

1. **Entrada del usuario**: El cliente hace una pregunta (por ejemplo: _"¿Hay stock de zapatillas Nike?"_).
2. **Embeddings**: La pregunta se convierte en un vector numérico con HuggingFace.
3. **Búsqueda en Pinecone**: Ese vector se compara con vectores de productos para encontrar los más relevantes.
4. **Contexto generado**: Se construye un texto descriptivo con los productos encontrados.
5. **Generación de respuesta**: DeepInfra genera una respuesta en lenguaje natural basada únicamente en ese contexto.
6. **Respuesta al usuario**: El chatbot devuelve la respuesta final en el frontend.

## 🧱 Construcción paso a paso

1. Definición del objetivo: Crear un asistente que responda dudas de clientes usando datos reales del ecommerce.

2. Creación del backend con Next.js API Routes para manejar la lógica RAG.

3. Uso de HuggingFace para generar embeddings de texto.

4. Indexado de productos en Pinecone usando vectores extraídos desde los datos.

5. Integración con DeepInfra para generar respuestas naturales con el modelo Qwen2-7B-Instruct.

6. Renderizado en el frontend (en progreso o ya listo, según tu avance).

7. Pruebas locales y optimización del prompt para asegurar respuestas precisas y útiles.

## 🙌 Autor

Desarrollado por Gabriel Oporto

📫 Contacto: [gabrieloporto.dev@gmail.com]()
