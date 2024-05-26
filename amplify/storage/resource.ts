import { defineStorage } from "@aws-amplify/backend";
import { sayHello } from "../functions/say-hello/resource";

export const storage = defineStorage({
  name: "songzy-files",
  triggers: {
    onUpload: sayHello,
  },
  access: (allow) => ({
    "image/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
      allow.resource(sayHello).to(["read", "write", "delete"]),
    ],
    "audio/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});
