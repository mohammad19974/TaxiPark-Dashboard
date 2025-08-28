/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSettingDto } from '../models/CreateSettingDto';
import type { UpdateSettingDto } from '../models/UpdateSettingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingsService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static settingsControllerCreate(
        requestBody: CreateSettingDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/settings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static settingsControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/settings',
        });
    }
    /**
     * @param key
     * @param parkId
     * @returns any
     * @throws ApiError
     */
    public static settingsControllerGetSettingValue(
        key: string,
        parkId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/settings/value/{key}',
            path: {
                'key': key,
            },
            query: {
                'parkId': parkId,
            },
        });
    }
    /**
     * @param key
     * @param parkId
     * @returns any
     * @throws ApiError
     */
    public static settingsControllerUpdateSettingValue(
        key: string,
        parkId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/settings/value/{key}',
            path: {
                'key': key,
            },
            query: {
                'parkId': parkId,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static settingsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/settings/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static settingsControllerUpdate(
        id: string,
        requestBody: UpdateSettingDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/settings/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static settingsControllerRemove(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/settings/{id}',
            path: {
                'id': id,
            },
        });
    }
}
