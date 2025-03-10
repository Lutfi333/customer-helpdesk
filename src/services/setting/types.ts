import { R } from "@/types/response";

export type ResponseChangePassword = R<UploadAttachmentData>;

export interface UploadAttachmentData {
  id: string;
  company: Company;
  name: string;
  provider: string;
  providerKey: string;
  type: string;
  size: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Validation {}

export type Company = {
  id: string;
  name: string;
  type: string;
};
