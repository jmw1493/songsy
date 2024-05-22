import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "songzy-files",
  access: (allow) => ({
    "images/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
    "audio/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});