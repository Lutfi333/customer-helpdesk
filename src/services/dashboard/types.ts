import { R } from "@/types/response";

export type ResponseDashboard = R<Data>;

export interface Data {
  totalTicket: number;
  totalTicketClosed: number;
  totalTicketOpen: number;
  totalTicketInProgress: number;
}

export interface Validation {}

/**
 * ResponseDashboardChart
 */

export type ResponseDashboardChart = R<Data>;

export interface Data {
  friday: Day;
  monday: Day;
  saturday: Day;
  thursday: Day;
  tuesday: Day;
  wednesday: Day;
}

export interface Day {
  close: number;
  open: number;
  in_progress: number;
  dayName: string;
}

/**
 * ResponseDashboardBarchart
 */

export type ResponseDashboardBarchart = R<Data[]>;

export interface Data {
  month: string;
  averageDuration: number;
  date: string;
}