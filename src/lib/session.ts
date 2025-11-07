import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error('缺少 SESSION_SECRET');

const encodedKey = new TextEncoder().encode(secret);

export async function encrypt(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, encodedKey);
  return payload.userId as string;
}