import { ApiService } from "./ApiService";
import { AuthService } from "./AuthService";

// TEACHERS
export const getTeachers = () =>
    ApiService.get("/panel/v1/teacher/read-teachers?PageNumber=1&PageSize=1000");

export const uploadTeachersExcel = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
        "https://backend.samaah.ir/api/panel/v1/teacher/upload-excel",
        {
            method: "POST",
            headers: {
                accept: "text/plain",
                Authorization: `Bearer ${AuthService.getAccessToken()}`,
            },
            body: formData,
        },
    );
    return response.json();
};

// USERS
interface CreateUserRequest {
    // Define the expected fields for creating a user
    [key: string]: unknown;
}
interface CreateUserResponse {
    // Define the expected response fields
    [key: string]: unknown;
}
export const createUser = (data: CreateUserRequest): Promise<CreateUserResponse> =>
    fetch("https://backend.samaah.ir/api/panel/v1/user/create", {
        method: "POST",
        headers: {
            accept: "text/plain",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());

export const getUsers = () =>
    ApiService.get("/panel/v1/user/getList?PageNumber=0&PageSize=250");

export const updateUserRole = (userId: string, role: string) =>
    ApiService.put(`/panel/v1/user/role/change?UserID=${userId}&RoleName=${role}`);

export const changePassword = (username: string, newPassword: string) =>
    fetch(`https://backend.samaah.ir/api/panel/v1/user/change-password?username=${encodeURIComponent(username)}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: "GET",
        headers: {
            Accept: "text/plain",
        },
    }).then((res) => res.text());

// AUTH
interface LoginRequest {
    // Define the expected fields for login
    [key: string]: unknown;
}
interface LoginResponse {
    // Define the expected response fields
    [key: string]: unknown;
}
export const login = (data: LoginRequest): Promise<LoginResponse> =>
    ApiService.post("/panel/v1/user/log-in", data);

// NOTIFICATIONS
export const getNotifications = () =>
    fetch("https://backend.samaah.ir/api/panel/v1/notification/list", {
        headers: { accept: "text/plain" },
    }).then((res) => res.json());

export const getNotificationDetail = (id: number) =>
    fetch(`https://backend.samaah.ir/api/panel/v1/notification/get?Id=${id}`, {
        headers: { accept: "text/plain" },
    }).then((res) => res.json());

export const updateNotification = (queryParams: string) =>
    fetch(
        `https://backend.samaah.ir/api/panel/v1/notification/update?${queryParams}`,
        {
            method: "PUT",
            headers: { accept: "text/plain" },
        },
    ).then((res) => res.json());

export const changeNotificationStatus = (id: number, isEnable: boolean) =>
    fetch(
        `https://backend.samaah.ir/api/panel/v1/notification/change-status?id=${id}&isEnable=${isEnable}`,
        {
            method: "GET",
            headers: { accept: "text/plain" },
        },
    ).then((res) => res.json());

interface CreateNotificationRequest {
    // Define the expected fields for creating a notification
    [key: string]: unknown;
}
interface CreateNotificationResponse {
    // Define the expected response fields
    [key: string]: unknown;
}
export const createNotification = (data: CreateNotificationRequest): Promise<CreateNotificationResponse> =>
    ApiService.post("/panel/v1/notification/create", data);

// TEACHER NOTIFICATIONS
export const getSentTeacherNotifications = (pageNumber: number, pageSize: number) =>
    fetch(`https://backend.samaah.ir/api/panel/v1/teacher-notification/teacher-notifications?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        {
            method: "POST",
            headers: { accept: "text/plain" },
            body: ""
        }
    ).then((res) => res.json());

// TEACHER NOTIFICATIONS (V2, POST, for SentNotificationsPanel)
export const getSentTeacherNotificationsV2 = (pageNumber: number, pageSize: number) =>
    fetch(`https://backend.samaah.ir/api/panel/v1/teacher-notification/teacher-notifications?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        {
            method: "POST",
            headers: { accept: "text/plain", "Content-Type": "application/json" },
            body: ""
        }
    ).then((res) => res.json()); 