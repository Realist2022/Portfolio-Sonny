"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@/src/hooks/useChat";

export default function AiChatBot() {
	const [isOpen, setIsOpen] = useState(false);
	const { messages, loading, error, sendMessage } = useChat();
	const [inputValue, setInputValue] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, loading]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim() && !loading) {
			sendMessage(inputValue);
			setInputValue("");
		}
	};

	return (
		<>
			{/* Chat Panel */}
			{isOpen && (
				<div className="fixed right-6 bottom-24 z-50 flex h-[560px] w-[360px] flex-col overflow-hidden rounded-3xl border border-[rgba(255,75,31,0.35)] bg-[#09090b] shadow-[0_24px_80px_rgba(0,0,0,0.7)] sm:w-[400px]">
					{/* Header */}
					<header className="flex items-center justify-between border-b border-[rgba(255,75,31,0.2)] p-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,75,31,0.3)] bg-[rgba(255,75,31,0.1)]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="h-5 w-5 text-[#ff4b1f]"
								>
									<path
										fillRule="evenodd"
										d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div>
								<h2 className="font-semibold text-[#f5ece7]">
									Sonny&apos;s AI Assistant
								</h2>
								<div className="flex items-center gap-1.5">
									<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
									<p className="text-xs text-[rgba(245,236,231,0.5)]">Online</p>
								</div>
							</div>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							className="flex h-8 w-8 items-center justify-center rounded-full text-[rgba(245,236,231,0.5)] transition hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f5ece7]"
							aria-label="Close chat"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								className="h-4 w-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18 18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</header>

					{/* Messages */}
					<main className="flex-1 overflow-y-auto p-4 [scrollbar-color:rgba(255,75,31,0.3)_transparent] [scrollbar-width:thin]">
						{messages.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center gap-3">
								<div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(255,75,31,0.2)] bg-[rgba(255,75,31,0.08)]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="h-7 w-7 text-[#ff4b1f]"
									>
										<path
											fillRule="evenodd"
											d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<p className="text-center text-sm text-[rgba(245,236,231,0.4)]">
									Start the conversation by typing a message below.
								</p>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								{messages.map((msg) => (
									<div
										key={msg.id}
										className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
									>
										<p
											className={`mb-1 text-xs ${
												msg.sender === "user"
													? "mr-3 text-[#ff4b1f]"
													: "ml-3 text-[rgba(245,236,231,0.4)]"
											}`}
										>
											{msg.sender === "user" ? "You" : "Sonny Bot"}
										</p>
										<div
											className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
												msg.sender === "user"
													? "bg-[#ff4b1f] text-white"
													: "border border-[rgba(255,75,31,0.2)] bg-[rgba(255,75,31,0.06)] text-[#f5ece7]"
											}`}
										>
											<p
												className={
													msg.sender !== "user" ? "whitespace-pre-wrap" : ""
												}
											>
												{msg.message}
											</p>
										</div>
									</div>
								))}

								{/* Loading indicator */}
								{loading && (
									<div className="flex flex-col items-start">
										<p className="mb-1 ml-3 text-xs text-[rgba(245,236,231,0.4)]">
											Sonny Bot
										</p>
										<div className="rounded-2xl border border-[rgba(255,75,31,0.2)] bg-[rgba(255,75,31,0.06)] px-4 py-3">
											<div className="flex items-center gap-1.5">
												<span className="h-2 w-2 animate-bounce rounded-full bg-[#ff4b1f] [animation-delay:0ms]" />
												<span className="h-2 w-2 animate-bounce rounded-full bg-[#ff4b1f] [animation-delay:150ms]" />
												<span className="h-2 w-2 animate-bounce rounded-full bg-[#ff4b1f] [animation-delay:300ms]" />
											</div>
										</div>
									</div>
								)}

								<div ref={messagesEndRef} />
							</div>
						)}
					</main>

					{/* Input */}
					<footer className="border-t border-[rgba(255,75,31,0.2)] p-4">
						<form onSubmit={handleSubmit} className="flex items-center gap-2">
							<input
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder="Type your message..."
								disabled={loading}
								className="flex-1 rounded-full border border-[rgba(255,75,31,0.2)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-sm text-[#f5ece7] placeholder:text-[rgba(245,236,231,0.3)] transition focus:border-[rgba(255,75,31,0.6)] focus:outline-none disabled:opacity-50"
							/>
							<button
								type="submit"
								disabled={!inputValue.trim() || loading}
								aria-label="Send message"
								className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff4b1f] text-white transition hover:bg-[#ff5a37] disabled:cursor-not-allowed disabled:opacity-40"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="h-4 w-4"
								>
									<path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
								</svg>
							</button>
						</form>

						{error && (
							<p className="mt-2 text-center text-xs text-red-400">{error}</p>
						)}
					</footer>
				</div>
			)}

			{/* Toggle Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				aria-label={isOpen ? "Close chat" : "Open AI chat"}
				className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff4b1f] shadow-[0_8px_32px_rgba(255,75,31,0.4)] transition hover:-translate-y-0.5 hover:bg-[#ff5a37]"
			>
				<span className="splash-ring" style={{ animationDelay: "7.35s" }} />
				<span className="splash-ring" style={{ animationDelay: "17.4s" }} />
				<span className="splash-ring" style={{ animationDelay: "27.45s" }} />
				{isOpen ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2.5}
						className="h-5 w-5 text-white"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18 18 6M6 6l12 12"
						/>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="h-6 w-6 text-white"
					>
						<path
							fillRule="evenodd"
							d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
							clipRule="evenodd"
						/>
					</svg>
				)}
			</button>
		</>
	);
}
