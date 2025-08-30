export type DatabaseResponse = {
	success: boolean;
	message: string;
};

export type DatabaseDataResponse<T> =
	| {
			success: true;
			message: string;
			data: T;
	  }
	| {
			success: false;
			message: string;
	  };

export interface ServiceResult<T = null> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export type Role = 'user' | 'assistant' | 'system';

export type ChatMessage = {
	role: Role;
	content: string;
};

export type LLMConfig = {
	baseUrl: string;
	apiKey: string;
	model: string;
	systemPrompt: string;
	temperature: number;
	maxTokens: number;
};

export type MaliciousLLMResponse = {
	isMalicious: boolean;
	messageResponse: string;
};

export type CompletionResponse<T> =
	| {
			success: boolean;
			data: T;
	  }
	| {
			success: false;
	  };

export type StreamingResponse<T> =
	| {
			success: boolean;
			data: T;
	  }
	| {
			success: false;
	  };
