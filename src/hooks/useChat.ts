import { useState, useCallback } from "react";
import type { ChatHistoryMessage, Message } from "@/src/types/chat";
import { streamChat } from "@/src/lib/chat.api";

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

		// The bot's message appears with the first words of the reply and grows
		// as the rest streams in; until then the typing dots show.
		const botId = Date.now() + 1;
		const showReply = (text: string, sources?: Message["sources"]) => {
			const bot: Message = { id: botId, message: text, sender: "bot", sources };
			// Decided inside the updater: React may run it after later deltas.
			setMessages((prev) =>
				prev.some((m) => m.id === botId)
					? prev.map((m) => (m.id === botId ? bot : m))
					: [...prev, bot],
			);
			setLoading(false);
		};

		try {
			let written = "";
			const result = await streamChat(text, history, (delta) => {
				written += delta;
				showReply(written);
			});
			showReply(result.reply, result.sources);
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
