import type { Cookie } from '$lib/server/db/databaseTypes';

export class CookieDTO {
	cookieID: string = '';
	FK_userID: string = '';
	expireTime: Date = new Date();

	constructor(data: Cookie) {
		this.cookieID = data.id;
		this.FK_userID = data.FK_userID;
		this.expireTime = data.expireTime;
	}
}

export class CreateCookieDTO {
	constructor() {}
}

export class UpdateCookieDTO {
	cookieID: string = '';

	constructor(cookieID: string) {
		this.cookieID = cookieID;
	}
}

export class DeleteCookieDTO {
	cookieID: string = '';

	constructor(cookieID: string) {
		this.cookieID = cookieID;
	}
}
