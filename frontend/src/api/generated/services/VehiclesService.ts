/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateVehicleDto } from '../models/CreateVehicleDto';
import type { UpdateVehicleDto } from '../models/UpdateVehicleDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VehiclesService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static vehiclesControllerCreate(
        requestBody: CreateVehicleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/vehicles',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param status
     * @param type
     * @param parkId
     * @returns any
     * @throws ApiError
     */
    public static vehiclesControllerFindAll(
        status: string,
        type: string,
        parkId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vehicles',
            query: {
                'status': status,
                'type': type,
                'parkId': parkId,
            },
        });
    }
    /**
     * @param parkId
     * @returns any
     * @throws ApiError
     */
    public static vehiclesControllerFindByPark(
        parkId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vehicles/park/{parkId}',
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
    public static vehiclesControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vehicles/{id}',
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
    public static vehiclesControllerUpdate(
        id: string,
        requestBody: UpdateVehicleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/vehicles/{id}',
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
    public static vehiclesControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/vehicles/{id}',
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
    public static vehiclesControllerGetStats(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vehicles/{id}/stats',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param driverId
     * @returns any
     * @throws ApiError
     */
    public static vehiclesControllerAssignDriver(
        id: string,
        driverId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/vehicles/{id}/assign-driver/{driverId}',
            path: {
                'id': id,
                'driverId': driverId,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static vehiclesControllerUnassignDriver(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/vehicles/{id}/unassign-driver',
            path: {
                'id': id,
            },
        });
    }
}
