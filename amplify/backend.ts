import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { compressImage } from "./functions/compress-image/resource";

defineBackend({
  auth,
  data,
  storage,
  compressImage,
});
