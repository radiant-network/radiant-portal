import type {Route} from "./+types/proxy";
import axios, {AxiosError, HttpStatusCode} from "axios";
import {getSessionAccessToken} from "~/utils/auth.server";
import * as process from "node:process";

export function action({request}: Route.ActionArgs) {
    return proxyApi(request);
}

function transformUrl(url: string): string {
    const parsedUrl = new URL(url);

    // Extract the path after `/api/`
    const match = parsedUrl.pathname.match(/^\/api\/(.*)$/);

    if (match) {
        return `${process.env.API_HOST}/${match[1]}`;
    }

    // Return original URL if it doesn't match the expected pattern
    return url;
}

const proxyApi = async (request: Request) => {

    try {
        const transformedUrl = transformUrl(request.url);
        const accessToken = await getSessionAccessToken(request);
        const body = await request.json();
        const response = await axios({
            method: request.method,
            url: transformedUrl,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            data: body
        });
        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return new Response(JSON.stringify(error.response?.data), {
                status: error.response?.status || HttpStatusCode.InternalServerError,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } else {
            return new Response(JSON.stringify(error), {
                status: HttpStatusCode.InternalServerError,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    }
};
