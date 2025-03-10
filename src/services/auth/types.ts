import { R } from "@/types/response";

export type ResponseLogin = R<{
  token: string;
  user: User;
}>;

export interface User {
  id: string;
  company: Company;
  companyProduct?: Company;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  bio?: string;
  profilePicture?: ProfilePicture
}

export interface ProfilePicture {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
  isPrivate: boolean;
  providerKey: string;
}

export interface Company {
  id: string;
  name: string;
  image?: string;
  code?: string;
}

export interface Validation {}
