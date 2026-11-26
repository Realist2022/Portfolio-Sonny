import type { ChatHistoryMessage, LLMResponse } from "@/src/types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function sendMessageToLLM(
	message: string,
	history: ChatHistoryMessage[] = [],
): Promise<LLMResponse> {
	const response = await fetch(`${API_URL}/api/chat`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ message, history }),
	});

	if (!response.ok) {
		let errorMessage = "Something went wrong";

		try {
			const errorData = await response.json();
			// FastAPI puts its message in `detail`; a validation error makes that a list.
			const detail =
				typeof errorData?.detail === "string" ? errorData.detail : undefined;
			errorMessage =
				detail || errorData?.error || errorData?.message || errorMessage;
		} catch {
			errorMessage = "Server error occurred";
		}

		const error = new Error(errorMessage);
		// Marks a message written by the backend, safe to show the visitor.
		error.name = "ChatApiError";
		throw error;
	}

	return response.json() as Promise<LLMResponse>;
}
