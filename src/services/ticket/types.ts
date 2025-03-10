import { P, R } from "@/types/response";

export type PaginationParams = {
    page: Number,
    limit: Number,
    sort?: string,
    dir?: string,
    status?: string,
    subject?: string,
    code?: string,
    customerID?: string,
  
}

/**
 * ResponseListTicket
 */

export type ResponseListTicket = P<ListTicketDatum>;

export interface ListTicketDatum {
  id: string;
  company: Company;
  product: Company;
  customer: Customer;
  category: Category;
  subject: string;
  content: string;
  attachments: null;
  logTime: LogTime;
  priority: string;
  project: Company;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  closedAt: string | null;
  code: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Category {
  id: string
  name: string
}

export interface LogTime {
  startAt: string | null;
  endAt: string | null;
  durationInSeconds: number;
  status: string;
}

export interface Validation {}

/**
 * ResponseDetailTicket
 */

export type ResponseDetailTicket = R<DetailTicketData>;

export interface DetailTicketData {
  id:          string;
  company:     Company;
  product:     Company;
  customer:    Customer;
  category:    Category;
  subject:     string;
  content:     string;
  project: Company;
  attachments: Attachment[];
  logTime:     LogTime;
  priority:    string;
  status:      string;
  createdAt:   string;
  updatedAt:   string;
  closedAt:    string | null;
  code:        string;
}

export interface Category {
  id: string
  name: string
}

export interface Attachment {
  id:   string;
  name: string;
  size: number;
  url:  string;
  type:  string;
}

export interface Company {
  id:   string;
  name: string;
}

export interface Customer {
  id:   string;
  name: string;
  email: string;
}

/**
 * ResponseListComment
 */

export type ResponseListComment = P<ListCommentData>;

export interface ListCommentData {
  id: string;
  company: Agent;
  product: Agent;
  ticket: Ticket;
  agent: Agent;
  customer: Agent;
  sender: string;
  content: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}
export interface Agent {
  id?: string;
  name?: string;
}

export interface Ticket {
  id: string;
  subject: string;
}

/**
 * ResponseAttachment
 */

export type ResponseAttachment = R<Data>;

export interface Data {
  id: string;
  company: Company;
  name: string;
  provider: string;
  providerKey: string;
  type: string;
  size: number;
  url: string;
  expiredUrlAt: Date;
  isUsed: boolean;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ResponseUploadAttachment
 */


export type ResponseUploadAttachment = R<UploadAttachmentData>

export interface UploadAttachmentData {
  id:          string;
  company:     Company;
  name:        string;
  provider:    string;
  providerKey: string;
  type:        string;
  size:        number;
  url:         string;
  createdAt:   Date;
  updatedAt:   Date;
}

/**
 * ResponseListProductg
 */

export type ResponseListProduct = P<DataProduct>;

export interface DataProduct {
  id: string;
  company: Company;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}