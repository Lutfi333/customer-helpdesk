import {
  API,
  ExtendedError,
  ServiceMutationConfig,
} from "..";
import { ResponseChangePassword } from "./types";

export const useChangePassword = (config?: ServiceMutationConfig) =>
  useHttpMutation<ResponseChangePassword, ExtendedError>(
    API.SETTING.UPDATE_PASSWORD,
    {
      method: "POST",
      httpOptions: config?.axios,
    },
  );
