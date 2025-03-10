import {
  DefaultError,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface Err extends AxiosResponse<DefaultError> {}

export interface ValidationError {
  [key: string]: string;
}

export interface ExtendedErrorData extends DefaultError {
  status?: number;
  message: string;
  validation?: ValidationError;
  [key: string]: any;
}

export interface ExtendedError extends AxiosResponse {
  data: ExtendedErrorData;
}

export interface ServiceMutationConfig<Res = unknown, Var = unknown> {
  axios?: AxiosRequestConfig;
  query?: UseMutationOptions<Res, Err, Var>;
}

export interface ServiceConfig<Res = unknown> {
  axios?: AxiosRequestConfig;
  query?: UseQueryOptions<Res, Err>;
}

export const API = {
  AUTH: {
    FORGOT_PASSWORD: {
      EMAIL: "/customer/auth/request-password-reset",
      PASSWORD: `/customer/auth/password-reset`,
    },
    LOGIN: "/customer/auth/login",
    REGISTER: "/customer/auth/register",
    ME: "/customer/auth/me",
  },
  DASHBOARD: {
    TOTAL_TICKET: "/customer/dashboard/total-ticket",
    DATA: "/customer/dashboard",
    AVERAGE_DURATION: "/customer/dashboard/average-duration",
  },
  TICKET: {
    LIST: "/customer/ticket/list",
    DETAIL: (id: string) => `/customer/ticket/detail/${id}`,
    SUBMIT: "/customer/ticket/create",
    CLOSE: "/customer/ticket/close",
    CANCEL: "/customer/ticket/cancel",
    REOPEN: "/customer/ticket/reopen",
    ATTACHMENT_DETAIL: (id: string) => `/customer/attachment/detail/${id}`,
    ATTACHMENT_UPLOAD: "/customer/attachment/upload",
  },
  COMMENT: {
    LIST: (id: string) => `/customer/ticket/comments/list/${id}`,
    SUBMIT: "/customer/ticket/comments/add",
  },
  USER: {
    LIST: "/customer/user/list",
    CREATE: "/customer/user/create",
    DETAIL: (id: string) => `/customer/user/detail/${id}`,
    UPDATE: (id: string) => `/customer/user/update/${id}`,
    DELETE: (id: string) => `/customer/user/delete/${id}`,
  },
  PROJECT: {
    LIST: "/customer/project/list",
    CREATE: "/customer/project/create",
    DETAIL: (id: string) => `/customer/project/detail/${id}`,
    UPDATE: (id: string) => `/customer/project/update/${id}`,
    DELETE: (id: string) => `/customer/project/delete/${id}`,
  },
  CATEGORY: {
    LIST: "/customer/ticket-category/list"
  },
  COMPANY: {
    DETAIL: (domain: string) => `/customer/company/detail-by-domain/${domain}`,
  },
  SETTING: {
    UPDATE_PASSWORD: `/customer/setting/change-password`,
  },
};
