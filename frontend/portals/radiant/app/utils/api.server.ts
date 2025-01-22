import { OccurrencesApi } from "@/api/api";
import { getSessionAccessToken } from "./auth.server";
import { Configuration } from "@/api/configuration";

export const getApiConfig = async (
  request: Request
): Promise<Configuration> => {
  const accessToken = await getSessionAccessToken(request);

  if (!accessToken) {
    throw new Error("Access token not found. User may not be authenticated.");
  }

  return new Configuration({
    basePath: process.env.API_HOST,
    accessToken,
  });
};

export const getOccurrencesApi = async (
  request: Request
): Promise<OccurrencesApi> => new OccurrencesApi(await getApiConfig(request));
