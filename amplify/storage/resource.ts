import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "songzy-files",
  access: (allow) => ({
    "images/*": [allow.authenticated.to(["read", "write", "delete"])],
    "audio/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
