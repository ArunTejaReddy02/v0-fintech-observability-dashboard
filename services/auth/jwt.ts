import * as jose from "jose";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set.");
  }
  return new TextEncoder().encode(secret);
};

export async function signJWT(payload: { 
  userId: string; 
  email: string; 
  role: string; 
  organizationId: string | null;
}) {
  const secret = getSecretKey();
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyJWT(token: string) {
  try {
    const secret = getSecretKey();
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as { 
      userId: string; 
      email: string; 
      role: string; 
      organizationId: string | null;
    };
  } catch (error) {
    return null;
  }
}
