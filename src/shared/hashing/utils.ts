import crypto from "node:crypto";

function hashText(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export { hashText };
