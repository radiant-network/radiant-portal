import { getOccurrencesApi } from "~/utils/api.server";
import type { Route } from "./+types/occurrences";

export function action({ request }: Route.ActionArgs) {
  switch (request.method) {
    case "POST":
      return fetchOccurences(request);
  }
}

const fetchOccurences = async (request: Request) => {
  const body = await request.json();
  const occurenceApi = await getOccurrencesApi(request);

  try {
    const response = await occurenceApi.listOccurrences(
      body.seqId,
      body.listBody
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
