import { API, Err, ServiceConfig, ServiceMutationConfig } from "@/services";
import { R } from "@/types/response";
import { ResponseLogin, User } from "./types";

export const useSendEmailResetPassword = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.AUTH.FORGOT_PASSWORD.EMAIL, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useResetPassword = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.AUTH.FORGOT_PASSWORD.PASSWORD, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useAuthMe = <Res = R<User>>(config?: ServiceConfig) =>
  useHttp<Res>(API.AUTH.ME, {
    httpOptions: config?.axios,
  });

export const useLogin = <Res = ResponseLogin>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.AUTH.LOGIN, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useRegister = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.AUTH.REGISTER, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });
