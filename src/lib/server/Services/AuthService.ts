import type { ServiceResult } from '$lib/types';
import argon2 from 'argon2';
import { UserServiceSingleton, type IUserService } from './UserService';
import { UserSettingsServiceSingleton, type IUserSettingsService } from './UserSettingsService';
import { CreateUserDTO } from '../../client/DTOs/User';
import { CreateUserSettingsDTO } from '../../client/DTOs/UserSettings';

/**
 * Interface defining authentication service operations for user account management
 */
export interface IAuthService {
	/**
	 * Creates a new user account with default settings
	 * @param email - User's email address
	 * @param password - User's plain text password (will be hashed)
	 * @param name - User's display name
	 * @returns Promise resolving to service result with new user ID
	 */
	CreateAccount(email: string, password: string, name: string): Promise<ServiceResult<string>>;

	/**
	 * Verifies user credentials for authentication
	 * @param email - User's email address
	 * @param password - User's plain text password
	 * @returns Promise resolving to service result with user ID if valid
	 */
	VerifyAccount(email: string, password: string): Promise<ServiceResult<string>>;
}

/**
 * Service class for authentication operations including account creation and verification
 */
class AuthService implements IAuthService {
	private UserService: IUserService;
	private UserSettingsService: IUserSettingsService;
	
	/**
	 * Creates a new AuthService instance
	 * @param userService - Service for user data operations
	 * @param userSettingsService - Service for user settings operations
	 */
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
