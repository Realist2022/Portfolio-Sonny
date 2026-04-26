export interface Message {
	id: number;
	message: string;
	sender: "user" | "bot";
}

export interface LLMResponse {
	reply: string;
}
