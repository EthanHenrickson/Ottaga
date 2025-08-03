export type userSettings = {
	//preferences
	// 'deuteranopia' | 'protanopia' | 'tritanopia'
	theme: string;
	receiveCommunityDigest: boolean;
	//Accessability
	simplifiedLanguage: boolean;
	reduceMotion: boolean;
	//Privacy
	saveConversations: boolean;
	//LLM Memory: boolean
	//encryption: {
	//    encryptDatabaseData: boolean,
	//    hashedKey: string
	//}
};

let userSettings: userSettings = $state({
	theme: 'Light',
	receiveCommunityDigest: true,
	simplifiedLanguage: false,
	reduceMotion: false,
	saveConversations: true
});

export function getUserSettings(): userSettings {
	return userSettings;
}

export function setUserSettings(newSettings: userSettings) {
	userSettings = newSettings;
}
