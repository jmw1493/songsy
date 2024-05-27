import { defineStorage } from "@aws-amplify/backend";
import { compressImage } from "../functions/compress-image/resource";

export const storage = defineStorage({
  name: "songzy-files",
  triggers: {
    onUpload: compressImage,
  },
  access: (allow) => ({
    "image/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
      allow.resource(compressImage).to(["read", "write", "delete"]),
    ],
    "audio/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});
