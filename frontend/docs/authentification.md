# Authentification

## Code architecture

![authentification](./media/authentification.png)

## Proxy API

### The proxy API is to be used by apps

##### Adding a GET request endpoint

```typescript
/**
 * loader func handles GET requests
 */
export async function loader({ request }: Route.LoaderArgs) {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

##### Adding a PUT, PATCH, POST or DELETE endpoint

```typescript
/**
 * action func handles everything else
 */
export function action({ request }: Route.ActionArgs) {
  switch (request.method) {
    case "PUT":
      return Response.json({
        message: "PUT",
      });
    case "PATCH":
      return Response.json({
        message: "PATCH",
      });
    case "POST":
      return Response.json({
        message: "POST",
      });
    case "DELETE":
      return Response.json({
        message: "DELETE",
      });
  }
}
```

#### Making the endpoint avaiable

In order to make the endpoint available, add it to the `PROXY_API` (or create a sibling `PROXY_<NAME>`) in `portals/radiant/config/routes.module.ts`, then make sure every theme that needs it spreads the group in its `routes.<theme>.ts`.

see: `portals/radiant/config/routes.module.ts` and the composition files under `portals/radiant/config/routes.*.ts`.
