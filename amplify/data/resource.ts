import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The authorization rule below specifies that any user authenticated via an API key can "create", "read", "update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Song: a
    .model({
      title: a.string().required(),
      songUrl: a.string().required(),
      coverArtUrl: a.string().required(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      // Allow anyone auth'd with an API key to read everyone's posts.
      // allow.publicApiKey().to(["read"]),
      // Allow signed-in user to create, read, update,
      // and delete their __OWN__ posts.
      allow.owner(),
    ]),

  Like: a
    .model({
      songId: a.string().required(),
      userId: a.string().required(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["create", "read"]),
      allow.owner().to(["update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool", // Authenticated users upload songs
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
