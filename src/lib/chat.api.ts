import type { LLMResponse } from "@/src/types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function sendMessageToLLM(message: string): Promise<LLMResponse> {
	const response = await fetch(`${API_URL}/api/chat`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ message }),
	});

	if (!response.ok) {
		let errorMessage = "Something went wrong";

		try {
			const errorData = await response.json();
			errorMessage = errorData?.error || errorData?.message || errorMessage;
		} catch {
			errorMessage = "Server error occurred";
		}

		throw new Error(errorMessage);
	}

	return response.json() as Promise<LLMResponse>;
}
