// Signed admin session tokens. Uses Web Crypto so the same code runs in the
// Edge middleware and in Node route handlers.

export const ADMIN_COOKIE = "adminToken";

const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Fails closed: without a strong secret no session can be issued or verified
async function getSigningKey(): Promise<CryptoKey | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signAdminSession(adminId: string): Promise<string> {
  const key = await getSigningKey();
  if (!key) {
    throw new Error("ADMIN_SESSION_SECRET is not configured on the server (min 32 characters).");
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = toBase64Url(encoder.encode(JSON.stringify({ adminId, exp })));
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));

  return `${payload}.${toBase64Url(signature)}`;
}

export async function verifyAdminSession(token: string | undefined): Promise<{ adminId: string } | null> {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;

  const key = await getSigningKey();
  if (!key) return null;

  try {
    // crypto.subtle.verify compares the HMAC in constant time
    const valid = await crypto.subtle.verify("HMAC", key, fromBase64Url(signature), encoder.encode(payload));
    if (!valid) return null;

    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    if (typeof data?.adminId !== "string" || typeof data?.exp !== "number") return null;
    if (data.exp < Math.floor(Date.now() / 1000)) return null;

    return { adminId: data.adminId };
  } catch {
    return null;
  }
}
