import { R } from "@/types/response";
import { API, Err, ServiceMutationConfig } from "..";
import {
  PaginationParams,
  ResponseListTicket,
  ResponseDetailTicket,
  ResponseAttachment,
  ResponseListComment,
  ResponseUploadAttachment,
} from "./types";
import { pagination } from "@heroui/theme";
import { config } from "process";

export const useTicketList = <Res = ResponseListTicket>(
  params: PaginationParams,
) => useHttp<Res>(API.TICKET.LIST, { params: params });

export const useTicketDetail = <Res = ResponseDetailTicket>(id: string) =>
  useHttp<Res>(API.TICKET.DETAIL(id));

export const useSubmitTicket = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.TICKET.SUBMIT, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useTicketClose = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.TICKET.CLOSE, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useTicketCancel = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.TICKET.CANCEL, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useTicketReopen = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.TICKET.REOPEN, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useDetailAttachment = <Res = ResponseAttachment>(
  id: string,
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.TICKET.ATTACHMENT_DETAIL(id), {
    method: "GET",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useCommentList = <Res = ResponseListComment>(
  id: string,
  pagination: PaginationParams,
) =>
  useHttp<Res>(API.COMMENT.LIST(id), {
    params: pagination,
  });

export const useSubmitComment = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.COMMENT.SUBMIT, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useUploadAttachment = <Res = ResponseUploadAttachment>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.TICKET.ATTACHMENT_UPLOAD, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });
