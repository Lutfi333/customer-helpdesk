import { API, Err, ServiceConfig, ServiceMutationConfig } from "..";
import { R } from "@/types/response";
import { CompanyDetailResponse } from "./types";

export const useDetailCompany = <Res = CompanyDetailResponse>(
  domain?: string,
  config?: ServiceConfig,
) =>
  useHttp<Res>(API.COMPANY.DETAIL(domain ?? ""), {
    httpOptions: config?.axios,
  });