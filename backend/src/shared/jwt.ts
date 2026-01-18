const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Encode data using base64url (RFC 7515).
 */
function base64urlEncode(input: ArrayBuffer | string): string {
  const bytes =
    typeof input === "string"
      ? encoder.encode(input)
      : new Uint8Array(input);

  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Decode base64url string into ArrayBuffer.
 */
function base64urlDecode(input: string): ArrayBuffer {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");

  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

/**
 * Sign a JWT using HMAC SHA-256.
 */
export async function signJWT(
  payload: Record<string, unknown>,
  secret: string,
  expiresInSeconds: number
): Promise<string> {
  const header = base64urlEncode(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  );

  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body = base64urlEncode(JSON.stringify({ ...payload, exp }));

  const data = `${header}.${body}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );

  return `${data}.${base64urlEncode(signature)}`;
}

/**
 * Verify a JWT and return its payload if valid.
 */
export async function verifyJWT(
  token: string,
  secret: string
): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const data = `${header}.${payload}`;

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlDecode(signature),
      encoder.encode(data)
    );

    if (!valid) return null;

    const decoded = JSON.parse(
      decoder.decode(base64urlDecode(payload))
    ) as Record<string, unknown>;

    const exp = decoded.exp as number | undefined;
    if (!exp || exp < Math.floor(Date.now() / 1000)) return null;

    return decoded;
  } catch {
    return null;
  }
}
