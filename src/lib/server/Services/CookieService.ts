import type { CreateCookie, UpdateCookie } from '$lib/server/db/databaseTypes';
import {
	CookieDatabaseRepository,
	type ICookieRepository
} from '$lib/server/db/Repository/CookieRespository';
import type { ServiceResult } from '$lib/types';
import { v7 } from 'uuid';
import { CookieDTO } from '../../client/DTOs/Cookie';

/**
 * Service interface for managing user authentication cookies
 */
export interface ICookieService {
	/**
	 * Creates a new authentication cookie for a user
	 * @param userID - The unique identifier of the user
	 * @returns Promise resolving to a ServiceResult containing the created CookieDTO
	 */
	CreateCookie(userID: string): Promise<ServiceResult<CookieDTO>>;

	/**
	 * Updates the expiration time of an existing cookie to extend its validity
	 * @param cookieID - The unique identifier of the cookie to update
	 * @returns Promise resolving to a ServiceResult indicating success or failure
	 */
	UpdateCookieByID(cookieID: string): Promise<ServiceResult>;

	/**
	 * Deletes a cookie by its unique identifier
	 * @param cookieID - The unique identifier of the cookie to delete
	 * @returns Promise resolving to a ServiceResult indicating success or failure
	 */
	DeleteCookieByID(cookieID: string): Promise<ServiceResult>;

	/**
	 * Retrieves a cookie by its unique identifier
	 * @param cookieID - The unique identifier of the cookie to retrieve
	 * @returns Promise resolving to a ServiceResult containing the CookieDTO if found
	 */
	GetCookieByID(cookieID: string): Promise<ServiceResult<CookieDTO>>;
}

class CookieService implements ICookieService {
	private CookieRepository: ICookieRepository;
	constructor(CookieRepository: ICookieRepository) {
		this.CookieRepository = CookieRepository;
	}

	async CreateCookie(userID: string): Promise<ServiceResult<CookieDTO>> {
		const uuid = v7();
		const futureExpireTime = new Date(Date.now() + 30 * 60 * 1000);

		const dbValues: CreateCookie = {
			id: uuid,
			FK_userID: userID,
			expireTime: futureExpireTime
		};

		const dbResponse = await this.CookieRepository.Create(dbValues);
		if (dbResponse.success) {
			return {
				success: true,
				data: new CookieDTO(dbValues)
			};
		} else {
			return {
				success: false
			};
		}
	}

	async UpdateCookieByID(cookieID: string): Promise<ServiceResult> {
		const futureExpireTime = new Date(Date.now() + 30 * 60 * 1000);

		const dbValues: UpdateCookie = {
			expireTime: futureExpireTime
		};

		const dbResponse = await this.CookieRepository.UpdateCookieTime(cookieID, dbValues);

		if (dbResponse.success) {
			return {
				success: true
			};
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}
	}

	async DeleteCookieByID(cookieID: string): Promise<ServiceResult> {
		const dbResponse = await this.CookieRepository.Delete(cookieID);

		if (dbResponse.success) {
			return {
				success: true
			};
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}
	}

	async GetCookieByID(cookieID: string): Promise<ServiceResult<CookieDTO>> {
		const dbResponse = await this.CookieRepository.GetByID(cookieID);
		if (dbResponse.success) {
			return {
				success: true,
				data: new CookieDTO(dbResponse.data)
			};
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}
	}
}

export const CookieServiceSingleton = new CookieService(CookieDatabaseRepository);
