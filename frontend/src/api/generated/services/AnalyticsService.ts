/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static analyticsControllerGetDashboardStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/stats',
        });
    }
    /**
     * @param period
     * @returns any
     * @throws ApiError
     */
    public static analyticsControllerGetRevenueData(
        period: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/revenue',
            query: {
                'period': period,
            },
        });
    }
    /**
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static analyticsControllerGetDriverPerformance(
        limit: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/driver-performance',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static analyticsControllerGetVehicleUtilization(
        limit: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/vehicle-utilization',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static analyticsControllerGetRealtimeStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/realtime-stats',
        });
    }
}
