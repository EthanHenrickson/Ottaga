import type { User } from '$lib/server/db/databaseTypes';

export class UserDTO {
	id: string = '';
	name: string = '';
	email: string = '';
	hashedPassword: string = '';
	created_at: Date = new Date();

	constructor(data: User) {
		this.id = data.id;
		this.name = data.name;
		this.email = data.email;
		this.hashedPassword = data.hashedPassword;
		this.created_at = data.created_at;
	}

	ToClientSafe() {
		this.hashedPassword = '';
	}
}

export class CreateUserDTO {
	name: string = '';
	email: string = '';
	password: string = '';

	constructor(name: string, email: string, password: string) {
		this.name = name;
		this.email = email;
		this.password = password;
	}
}

export class UpdateUserDTO {
	name?: string;
	email?: string;

	constructor(name?: string, email?: string) {
		if (name !== undefined) this.name = name;
		if (email !== undefined) this.email = email;
	}
}

export class DeleteUserDTO {
	id: string = '';

	constructor(id: string) {
		this.id = id;
	}
}
