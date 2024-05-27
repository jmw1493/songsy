import { defineFunction } from "@aws-amplify/backend";

export const compressImage = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: "compress-image",
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: "./handler.ts",
  timeoutSeconds: 60,
  memoryMB: 1024,
});
