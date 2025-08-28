/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDriverDto } from '../models/CreateDriverDto';
import type { UpdateDriverDto } from '../models/UpdateDriverDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DriversService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static driversControllerCreate(
        requestBody: CreateDriverDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/drivers',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param status
     * @param licenseClass
     * @param parkId
     * @returns any
     * @throws ApiError
     */
    public static driversControllerFindAll(
        status: string,
        licenseClass: string,
        parkId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/drivers',
            query: {
                'status': status,
                'licenseClass': licenseClass,
                'parkId': parkId,
            },
        });
    }
    /**
     * @param parkId
     * @returns any
     * @throws ApiError
     */
    public static driversControllerFindByPark(
        parkId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/drivers/park/{parkId}',
            path: {
                'parkId': parkId,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static driversControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/drivers/{id}',
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
    public static driversControllerUpdate(
        id: string,
        requestBody: UpdateDriverDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/drivers/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static driversControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/drivers/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static driversControllerGetStats(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/drivers/{id}/stats',
            path: {
                'id': id,
            },
        });
    }
}
