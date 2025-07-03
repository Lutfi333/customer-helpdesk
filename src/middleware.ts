import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_KEY,
  COMPANY_COLOR,
  COMPANY_DATA,
  COMPANY_SUBDOMAIN,
} from "./constants/auth";

export const config = {
  matcher: ["/", "/login"],
};

const excludedPaths = ["/error", "/not-found"];

export async function middleware(request: NextRequest) {
  // if (excludedPaths.includes(request.nextUrl.pathname)) {
  return NextResponse.next();
  //   }
  //   const host = request.headers.get("host");
  //   const originalUrl = host?.split(":")[0];

  //   const cookieToken = request.cookies.get(AUTH_KEY);
  //   const env = process.env.NEXT_PUBLIC_BASE_URL;
  //   const apiUrl = `${env}/customer/company/detail-by-domain/${originalUrl}`;
  //   // const apiUrl = `${env}/customer/company/detail-by-domain/sl-support.ticket-demo.solutionlab.id/`;

  //   try {
  //     const response = await fetch(apiUrl);
  //     const data = await response.json();

  //     if (data.status === 200) {
  //       const color = data.data.settings.colorMode.light.primary;
  //       const domain = data.data.settings.domain.fullUrl;

  //       const res = NextResponse.next();
  //       setCookies(res, color, domain, data.data);

  //       if (!cookieToken) {
  //         if (request.nextUrl.pathname == "/login") {
  //           setCookies(res, color, domain, data.data);
  //           return res;
  //         }
  //         return redirectWithCookies(
  //           res,
  //           "/login",
  //           color,
  //           domain,
  //           data.data,
  //           request.url,
  //         );
  //       }

  //       return res;
  //     } else {
  //       // return handleError("/not-found", request.url);
  //     }
  //   } catch (error) {
  //     console.error("Middleware error:", error);
  //     return handleError("/error", request.url);
  //   }
}

function setCookies(
  response: NextResponse,
  color: string,
  subdomain: string,
  data: any,
) {
  const options = {
    httpOnly: false,
    secure: false,
    path: "/",
    sameSite: "lax",
  };
  response.cookies.set(COMPANY_COLOR, color, options as any);
  response.cookies.set(COMPANY_SUBDOMAIN, subdomain, options as any);
  response.cookies.set(COMPANY_DATA, JSON.stringify(data), options as any);
}

function redirectWithCookies(
  response: NextResponse,
  path: string,
  color: string,
  subdomain: string,
  data: any,
  url: string,
) {
  const redirectResponse = NextResponse.redirect(new URL(path, url));
  setCookies(redirectResponse, color, subdomain, data);
  return redirectResponse;
}

function handleError(path: string, url: string) {
  const errorResponse = NextResponse.redirect(new URL(path, url));
  errorResponse.cookies.delete(COMPANY_COLOR);
  errorResponse.cookies.delete(COMPANY_SUBDOMAIN);
  errorResponse.cookies.delete(COMPANY_DATA);
  return errorResponse;
}
