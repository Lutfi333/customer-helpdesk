import { API, ServiceConfig } from "..";
import { CategoryListResponse } from "./types";

export const useCategoryList = <Res = CategoryListResponse>(
) => useHttp<Res>(API.CATEGORY.LIST, {
  params: {
    page: 1,
    limit: 100,
  }
});
