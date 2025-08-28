/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateParkDto } from '../models/CreateParkDto';
import type { UpdateParkDto } from '../models/UpdateParkDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ParksService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static parksControllerCreate(
        requestBody: CreateParkDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/parks',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param status
     * @returns any
     * @throws ApiError
     */
    public static parksControllerFindAll(
        status: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/parks',
            query: {
                'status': status,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static parksControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/parks/{id}',
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
    public static parksControllerUpdate(
        id: string,
        requestBody: UpdateParkDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/parks/{id}',
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
    public static parksControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/parks/{id}',
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
    public static parksControllerGetStats(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/parks/{id}/stats',
            path: {
                'id': id,
            },
        });
    }
}
