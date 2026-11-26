export interface Message {
	id: number;
	message: string;
	sender: "user" | "bot";
}

export interface LLMResponse {
	reply: string;
}

// One earlier turn, in the shape the chat backend expects.
export interface ChatHistoryMessage {
	role: "user" | "assistant";
	content: string;
}
