import type { UserSettings } from '$lib/server/db/databaseTypes';

export class UserSettingsDTO {
	theme: string;
	receiveCommunityDigest: boolean;
	saveConversations: boolean;
	simplifiedLanguage: boolean;
	reduceMotion: boolean;

	constructor(data: UserSettings) {
		this.theme = data.theme;
		this.receiveCommunityDigest = data.receiveCommunityDigest;
		this.saveConversations = data.saveConversations;
		this.simplifiedLanguage = data.simplifiedLanguage;
		this.reduceMotion = data.reduceMotion;
	}
}

export class CreateUserSettingsDTO {
	theme: string;
	receiveCommunityDigest: boolean;
	saveConversations: boolean;
	simplifiedLanguage: boolean;
	reduceMotion: boolean;

	constructor(
		theme: string = 'light',
		receiveCommunityDigest: boolean = true,
		saveConversations: boolean = true,
		simplifiedLanguage: boolean = false,
		reduceMotion: boolean = false
	) {
		this.theme = theme;
		this.receiveCommunityDigest = receiveCommunityDigest;
		this.saveConversations = saveConversations;
		this.simplifiedLanguage = simplifiedLanguage;
		this.reduceMotion = reduceMotion;
	}
}

export class UpdateUserSettingsDTO {
	theme?: string;
	receiveCommunityDigest?: boolean;
	saveConversations?: boolean;
	simplifiedLanguage?: boolean;
	reduceMotion?: boolean;

	constructor(
		theme?: string,
		receiveCommunityDigest?: boolean,
		saveConversations?: boolean,
		simplifiedLanguage?: boolean,
		reduceMotion?: boolean
	) {
		if (theme !== undefined) this.theme = theme;
		if (receiveCommunityDigest !== undefined) this.receiveCommunityDigest = receiveCommunityDigest;
		if (saveConversations !== undefined) this.saveConversations = saveConversations;
		if (simplifiedLanguage !== undefined) this.simplifiedLanguage = simplifiedLanguage;
		if (reduceMotion !== undefined) this.reduceMotion = reduceMotion;
	}
}
