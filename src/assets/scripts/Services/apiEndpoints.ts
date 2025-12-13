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

// Get all faculties
interface FacultiesResponse {
    data: string[];
    error: boolean;
    message: string[];
}
export const getFaculties = (): Promise<FacultiesResponse> =>
    ApiService.get<FacultiesResponse>("/panel/v1/teacher/faculties");

// Get groups for a specific faculty
interface FacultyGroupsResponse {
    data: string[];
    error: boolean;
    message: string[];
}
export const getFacultyGroups = async (facultyName: string): Promise<FacultyGroupsResponse> => {
    // The API endpoint uses faculty ID 1, and the body contains the faculty name
    return ApiService.post<FacultyGroupsResponse>(
        "/panel/v1/teacher/faculties/1",
        facultyName
    );
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


// FORGOT PASSWORD FLOW
export const requestPasswordReset = async (username: string) => {
    console.log(`🔍 Starting password reset for username: ${username}`);

    // فقط با پارامتر userName درخواست ارسال شود
    const endpoints = [
        `/panel/v1/user/forget-password?userName=${encodeURIComponent(username)}`
    ];

    let lastError: any = null;

    for (const endpoint of endpoints) {
        try {
            console.log(`🔄 Trying endpoint: ${endpoint}`);
            const response: any = await ApiService.get(endpoint);
            console.log(`✅ Response from ${endpoint}:`, response);

            if (!response.error) {
                console.log(`🎉 Success with endpoint: ${endpoint}`);
                return response;
            } else {
                console.log(`❌ Error response from ${endpoint}:`, response);
                lastError = response;
            }
        } catch (error) {
            console.log(`💥 Exception from ${endpoint}:`, error);
            lastError = error;
            continue;
        }
    }

    console.error(`🚨 All endpoints failed. Last error:`, lastError);
    throw new Error(`همه endpoint های بازیابی رمز عبور ناموفق بودند. آخرین خطا: ${lastError?.message || 'نامشخص'}`);
};

export const validateVerificationCode = async (username: string, code: string) => {
    // Try different parameter names
    const endpoints = [
        `/panel/v1/user/forget-password/verificationcode-validation?userName=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}`,
        `/panel/v1/user/forget-password/verificationcode-validation?username=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}`,
        `/panel/v1/user/forget-password/verificationcode-validation?phoneNumber=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}`,
        `/panel/v1/user/forget-password/verificationcode-validation?phone=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}`
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Trying validation endpoint: ${endpoint}`);
            const response: any = await ApiService.get(endpoint);
            if (!response.error) {
                return response;
            }
        } catch (error) {
            console.log(`Validation endpoint ${endpoint} failed:`, error);
            continue;
        }
    }

    throw new Error("همه endpoint های تایید کد ناموفق بودند");
};

export const changePasswordWithCode = async (username: string, code: string, newPassword: string) => {
    // Try different parameter names
    const endpoints = [
        `/panel/v1/user/change-password?userName=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}&newPassword=${encodeURIComponent(newPassword)}`,
        `/panel/v1/user/change-password?username=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}&newPassword=${encodeURIComponent(newPassword)}`,
        `/panel/v1/user/change-password?phoneNumber=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}&newPassword=${encodeURIComponent(newPassword)}`,
        `/panel/v1/user/change-password?phone=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}&newPassword=${encodeURIComponent(newPassword)}`
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Trying change password endpoint: ${endpoint}`);
            const response: any = await ApiService.get(endpoint);
            if (!response.error) {
                return response;
            }
        } catch (error) {
            console.log(`Change password endpoint ${endpoint} failed:`, error);
            continue;
        }
    }

    throw new Error("همه endpoint های تغییر رمز عبور ناموفق بودند");
};

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