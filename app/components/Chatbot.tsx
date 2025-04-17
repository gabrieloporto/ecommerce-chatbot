"use client";

import { useState, useRef, useEffect } from "react";
import { CloseIcon, MessageIcon, SendIcon } from "./Icons";

type Message = {
  from: "user" | "bot";
  text: string;
  loading?: boolean;
};

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { from: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Lo siento, hubo un error procesando tu consulta. Por favor intenta nuevamente.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat bubble button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all z-50 animate-bounce"
          aria-label="Abrir chat"
        >
          <MessageIcon size="28" />
        </button>
      )}

      {/* Chat window */}
      <div
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 bg-white border shadow-xl rounded-t-lg sm:rounded-lg flex flex-col transition-all duration-300 z-50 ${
          isOpen
            ? "h-[500px] max-h-[80vh]"
            : "h-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageIcon size="20" />
            <h3 className="font-medium">Asistente de Ventas</h3>
          </div>
          <button
            onClick={toggleChat}
            className="p-1 rounded-full hover:bg-indigo-700 transition-colors"
            aria-label="Cerrar chat"
          >
            <CloseIcon size="20" color="white" />
          </button>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2 font-medium">¡Bienvenido a nuestra tienda!</p>
              <p className="text-sm">¿En qué puedo ayudarte hoy?</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.from === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 shadow-sm rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 shadow-sm rounded-bl-none">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">Escribiendo...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              className="flex-1 border border-gray-300 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
              disabled={!input.trim() || isLoading}
              aria-label="Enviar mensaje"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
