export type userSettings = {
    preferences: {
        theme: "Dark" | "Light",
        language: string,
        receiveCommunityDigest: boolean
    },
    accessibility: {
        simplifiedLanguage: boolean,
        reduceMotion: boolean,
        // colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia'
    },
    privacy: {
        saveConversations: boolean,
        //encryption: {
        //    encryptDatabaseData: boolean,
        //    hashedKey: string
        //}
    },
}

export let userSettings: userSettings = $state({
    preferences: {
        theme: "Light",
        language: "EN",
        receiveCommunityDigest: true
    },
    accessibility: {
        simplifiedLanguage: false,
        reduceMotion: false,
        // colorBlindMode: 'none'
    },
    privacy: {
        saveConversations: true,
        //allowDataExport: true,
        //encryption: {
        //    encryptDatabaseData: false,
        //    hashedKey: ""
        //}
    },
})

export function getUserSettings(): userSettings {
    return userSettings
}

export function setUserSettings(newSettings: userSettings){
    userSettings = userSettings
}
