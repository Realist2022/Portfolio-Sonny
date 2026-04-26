import { useState, useCallback } from "react";
import type { Message } from "@/src/types/chat";
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

		setMessages((prev) => [...prev, userMessage]);
		setLoading(true);
		setError(null);

		try {
			const data = await sendMessageToLLM(text);

			const botMessage: Message = {
				id: Date.now() + 1,
				message: data.reply,
				sender: "bot",
			};

			setMessages((prev) => [...prev, botMessage]);
		} catch (err) {
			setError("Failed to send message. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	return { messages, loading, error, sendMessage };
}
