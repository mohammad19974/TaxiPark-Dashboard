/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateBookingDto } from '../models/CreateBookingDto';
import type { UpdateBookingDto } from '../models/UpdateBookingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BookingsService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bookingsControllerCreate(
        requestBody: CreateBookingDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/bookings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param status
     * @param parkId
     * @param customerId
     * @param driverId
     * @param startDate
     * @param endDate
     * @returns any
     * @throws ApiError
     */
    public static bookingsControllerFindAll(
        status: string,
        parkId: string,
        customerId: string,
        driverId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bookings',
            query: {
                'status': status,
                'parkId': parkId,
                'customerId': customerId,
                'driverId': driverId,
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * @param parkId
     * @returns any
     * @throws ApiError
     */
    public static bookingsControllerGetStats(
        parkId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bookings/stats',
            query: {
                'parkId': parkId,
            },
        });
    }
    /**
     * @param parkId
     * @returns any
     * @throws ApiError
     */
    public static bookingsControllerFindByPark(
        parkId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bookings/park/{parkId}',
            path: {
                'parkId': parkId,
            },
        });
    }
    /**
     * @param customerId
     * @returns any
     * @throws ApiError
     */
    public static bookingsControllerFindByCustomer(
        customerId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bookings/customer/{customerId}',
            path: {
                'customerId': customerId,
            },
        });
    }
    /**
     * @param driverId
     * @returns any
     * @throws ApiError
     */
    public static bookingsControllerFindByDriver(
        driverId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bookings/driver/{driverId}',
            path: {
                'driverId': driverId,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static bookingsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bookings/{id}',
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
    public static bookingsControllerUpdate(
        id: string,
        requestBody: UpdateBookingDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/bookings/{id}',
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
    public static bookingsControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/bookings/{id}',
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
    public static bookingsControllerAssignDriver(
        id: string,
        driverId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/bookings/{id}/assign-driver/{driverId}',
            path: {
                'id': id,
                'driverId': driverId,
            },
        });
    }
    /**
     * @param id
     * @param vehicleId
     * @returns any
     * @throws ApiError
     */
    public static bookingsControllerAssignVehicle(
        id: string,
        vehicleId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/bookings/{id}/assign-vehicle/{vehicleId}',
            path: {
                'id': id,
                'vehicleId': vehicleId,
            },
        });
    }
    /**
     * @param id
     * @param status
     * @returns any
     * @throws ApiError
     */
    public static bookingsControllerUpdateStatus(
        id: string,
        status: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/bookings/{id}/status/{status}',
            path: {
                'id': id,
                'status': status,
            },
        });
    }
    /**
     * @param id
     * @param paymentStatus
     * @returns any
     * @throws ApiError
     */
    public static bookingsControllerUpdatePaymentStatus(
        id: string,
        paymentStatus: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/bookings/{id}/payment-status/{paymentStatus}',
            path: {
                'id': id,
                'paymentStatus': paymentStatus,
            },
        });
    }
}
