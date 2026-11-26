import { useState, useCallback } from "react";
import type { ChatHistoryMessage, Message } from "@/src/types/chat";
import { sendMessageToLLM } from "@/src/lib/chat.api";

export function useChat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const sendMessage = useCallback(async (text: string) => {
		if (!text.trim()) return;

		const userMessage: Message = {
			id: Date.now(),
			message: text,
			sender: "user",
		};

		// Earlier turns, so follow-up questions keep their context. The backend
		// keeps only the most recent ones.
		const history: ChatHistoryMessage[] = messages.map((m) => ({
			role: m.sender === "user" ? "user" : "assistant",
			content: m.message,
		}));

		setMessages((prev) => [...prev, userMessage]);
		setLoading(true);
		setError(null);

		try {
			const data = await sendMessageToLLM(text, history);

			const botMessage: Message = {
				id: Date.now() + 1,
				message: data.reply,
				sender: "bot",
			};

			setMessages((prev) => [...prev, botMessage]);
		} catch (err) {
			// Show the backend's own wording when it sent one (for example the
			// rate-limit message); otherwise a general one.
			const message =
				err instanceof Error &&
				err.name === "ChatApiError" &&
				err.message !== "Something went wrong"
					? err.message
					: "Failed to send message. Please try again.";
			setError(message);
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, [messages]);

	return { messages, loading, error, sendMessage };
}
