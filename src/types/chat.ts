/** A passage the bot's reply cited as [n]. */
export interface ChatSource {
	n: number;
	title: string;
	heading: string;
	url: string;
}

export interface Message {
	id: number;
	message: string;
	sender: "user" | "bot";
	sources?: ChatSource[];
}

// One earlier turn, in the shape the chat backend expects.
export interface ChatHistoryMessage {
	role: "user" | "assistant";
	content: string;
}
