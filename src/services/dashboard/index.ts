import { API, ServiceConfig } from "..";
import {
  ResponseDashboard,
  ResponseDashboardBarchart,
  ResponseDashboardChart,
} from "./types";

export const useDashboard = <Res = ResponseDashboard>(config?: ServiceConfig) =>
  useHttp<Res>(API.DASHBOARD.TOTAL_TICKET, {
    httpOptions: config?.axios,
  });

export const useDashboardChart = <Res = ResponseDashboardChart>(
  config?: ServiceConfig,
) =>
  useHttp<Res>(API.DASHBOARD.DATA, {
    httpOptions: config?.axios,
  });

export const useDashboardBarChart = <Res = ResponseDashboardBarchart>(
  params: any,
  config?: ServiceConfig,
) =>
  useHttp<Res>(API.DASHBOARD.AVERAGE_DURATION, {
    params: params,
    httpOptions: config?.axios,
  });
