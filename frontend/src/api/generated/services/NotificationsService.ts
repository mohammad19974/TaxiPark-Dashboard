/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateNotificationDto } from '../models/CreateNotificationDto';
import type { UpdateNotificationDto } from '../models/UpdateNotificationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerCreate(
        requestBody: CreateNotificationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerGetMyNotifications(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications/my-notifications',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerGetUnreadCount(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications/unread-count',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerMarkAllAsRead(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/mark-all-read',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerSendBulkNotification(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/bulk-send',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerSendSystemNotification(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/system-notification',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications/{id}',
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
    public static notificationsControllerUpdate(
        id: string,
        requestBody: UpdateNotificationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/notifications/{id}',
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
    public static notificationsControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/notifications/{id}',
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
    public static notificationsControllerMarkAsRead(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/notifications/{id}/mark-read',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerNotifyBookingCreated(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/booking-created',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerNotifyDriverAssigned(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/driver-assigned',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerNotifyStatusChange(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/status-change',
        });
    }
}
