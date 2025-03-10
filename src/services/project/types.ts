import { P, R } from "@/types/response";

export type ProjectListResponse = P<ProjectList>

export interface ProjectList {
  id:             string;
  company:        Company;
  companyProduct: Company;
  name:           string;
  description:    string;
  createdAt:      string;
  updatedAt:      string;
}

export interface Company {
  id:   string;
  name: string;
}

export interface Validation {
}

/**
 * DETAIL PROJECT
 */

export type ProjectDetailResponse = R<ProjectDetailData>

export interface ProjectDetailData {
  id:             string;
  company:        Company;
  companyProduct: Company;
  name:           string;
  description:    string;
  createdAt:      string;
  updatedAt:      string;
}

