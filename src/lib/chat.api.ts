import type { ChatHistoryMessage, ChatSource } from "@/src/types/chat";

export interface ChatResult {
	reply: string;
	sources: ChatSource[];
}

/** An error whose message was written for the visitor (e.g. the rate limit). */
function visitorError(message: string): Error {
	const error = new Error(message);
	error.name = "ChatApiError";
	return error;
}

/**
 * Send a message to this site's /api/chat route and read its server-sent
 * events: `onDelta` gets the reply as it is written, and the promise resolves
 * with the full reply and the sources it cited.
 */
export async function streamChat(
	message: string,
	history: ChatHistoryMessage[],
	onDelta: (text: string) => void,
): Promise<ChatResult> {
	const response = await fetch("/api/chat", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message, history }),
	});

	if (!response.ok || !response.body) {
		let detail = "Something went wrong";
		try {
			const data = await response.json();
			if (typeof data?.detail === "string") detail = data.detail;
		} catch {
			// keep the generic message
		}
		throw visitorError(detail);
	}

	const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
	let buffer = "";
	for (;;) {
		const { value, done } = await reader.read();
		if (done) break;
		buffer += value;
		// Events end with a blank line; keep any partial one for the next read.
		const events = buffer.split("\n\n");
		buffer = events.pop() ?? "";
		for (const raw of events) {
			const line = raw.split("\n").find((l) => l.startsWith("data: "));
			if (!line) continue;
			const event = JSON.parse(line.slice(6));
			if (event.type === "delta") onDelta(event.text);
			else if (event.type === "done") return { reply: event.reply, sources: event.sources ?? [] };
			else if (event.type === "error") throw visitorError(event.message);
		}
	}
	throw new Error("The reply ended early.");
}
