import { PaginationParams } from "@/types/payload";
import { ProjectDetailResponse, ProjectListResponse } from "./types";
import { API, Err, ServiceConfig, ServiceMutationConfig } from "..";
import { R } from "@/types/response";

export const useProjectList = <Res = ProjectListResponse>(
  params: PaginationParams,
) => useHttp<Res>(API.PROJECT.LIST, { params: params });

export const useProjectDetail = <Res = ProjectDetailResponse>(
  id: string,
  config?: ServiceConfig,
) =>
  useHttp<Res>(API.PROJECT.DETAIL(id), {
    httpOptions: config?.axios,
  });

export const useCreateProject = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.PROJECT.CREATE, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useUpdateProject = <Res = R<any>>(
  id: string,
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.PROJECT.UPDATE(id), {
    method: "PUT",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

  export const useDeleteProject = <Res = R<any>>(
    id: string,
    config?: ServiceMutationConfig<Res>,
  ) =>
    useHttpMutation<Res, Err>(API.PROJECT.DELETE(id), {
      method: "DELETE",
      httpOptions: config?.axios,
      queryOptions: config?.query,
    });
