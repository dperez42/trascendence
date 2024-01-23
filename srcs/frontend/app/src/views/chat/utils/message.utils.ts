export interface MessageData {
	id: string;
	command: string;
    type: string | null;
    target: string;
    reason: string | null;
    name: string | null;
    password: string | null;
    topic: string | null;
    user?: string;
    message: string;
}

export const generateMessageData = (messageData: MessageData) => {
	return {
		params: {
			id: messageData.id,
			command: messageData.command,
			type: messageData.type,
			target: messageData.target,
			reason: messageData.reason,
			name: messageData.name,
			password: messageData.password,
			topic: messageData.topic,
			user: messageData.user,
			message: messageData.message,
		},
		timestamp: null
	};
};

export type EmitMessageFunction = (messageToSend: ReturnType<typeof generateMessageData>) => void;
