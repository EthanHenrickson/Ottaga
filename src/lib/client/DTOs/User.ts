import type { User } from '$lib/server/db/databaseTypes';

type PublicUserDTO = Omit<UserDTO, 'hashedPassword' | 'ToClientSafe'>;

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

	ToClientSafe(): PublicUserDTO {
	  // eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { hashedPassword, ...rest } = this;
		return rest;
	}
}

export class CreateUserDTO {
	constructor(
		public readonly name: string,
		public readonly email: string,
		public readonly password: string
	) {}
}

export class UpdateUserDTO {
	constructor(
		public readonly name?: string,
		public readonly email?: string,
		public readonly hashedPassword?: string
	) {}
}
