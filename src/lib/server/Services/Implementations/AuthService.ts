import type { ServiceResult } from '$lib/types';
import argon2 from 'argon2';
import { UserServiceSingleton, type IUserService } from './UserService';
import { UserSettingsServiceSingleton, type IUserSettingsService } from './UserSettingsService';
import { CreateUserDTO } from '../DTOs/User';
import { CreateUserSettingsDTO } from '../DTOs/UserSettings';

export interface IAuthService {
	CreateAccount(email: string, password: string, name: string): Promise<ServiceResult<string>>;
	VerifyAccount(email: string, password: string): Promise<ServiceResult<string>>;
}

class AuthService implements IAuthService {
	private UserService: IUserService;
	private UserSettingsService: IUserSettingsService;
	constructor(userService: IUserService, userSettingsService: IUserSettingsService) {
		this.UserService = userService;
		this.UserSettingsService = userSettingsService;
	}

	async CreateAccount(
		email: string,
		password: string,
		name: string
	): Promise<ServiceResult<string>> {
		const isExistingUser = await this.UserService.GetByEmail(email);
		if (isExistingUser.success) {
			return {
				success: false,
				message: 'An account with that email already exists.'
			};
		}

		const CreateUserDTOValue = new CreateUserDTO(name, email, password);
		const UserServiceCreationResponse = await this.UserService.Create(CreateUserDTOValue);
		if (!UserServiceCreationResponse.success || !UserServiceCreationResponse.data) {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}
		const newUserUUID = UserServiceCreationResponse.data;

		const CreateUserSettingsDTOValue = new CreateUserSettingsDTO();
		const UserSettingCreationResponse = await this.UserSettingsService.Create(
			newUserUUID,
			CreateUserSettingsDTOValue
		);

		if (!UserSettingCreationResponse.success) {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}

		return {
			success: true,
			data: newUserUUID
		};
	}

	async VerifyAccount(email: string, password: string): Promise<ServiceResult<string>> {
		const UserRepositoryResponse = await this.UserService.GetByEmail(email);
		if (!UserRepositoryResponse.success || !UserRepositoryResponse.data) {
			return {
				success: false,
				message: 'Incorrect email or password'
			};
		}

		const isValidPassword = await argon2.verify(
			UserRepositoryResponse.data.hashedPassword,
			password
		);
		if (!isValidPassword) {
			return {
				success: false,
				message: 'Incorrect email or password'
			};
		}

		return {
			success: true,
			data: UserRepositoryResponse.data.id
		};
	}
}

export const AuthServiceSingleton = new AuthService(
	UserServiceSingleton,
	UserSettingsServiceSingleton
);
