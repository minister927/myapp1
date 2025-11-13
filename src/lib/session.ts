// import 'server-only';
// import { SignJWT, jwtVerify } from 'jose';

// const secret = process.env.SESSION_SECRET;
// if (!secret) throw new Error('缺少 SESSION_SECRET');

// const encodedKey = new TextEncoder().encode(secret);

// export async function encrypt(userId: string) {
//   return new SignJWT({ userId })
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('7d')
//     .sign(encodedKey);
// }

// export async function decrypt(token: string) {
//   const { payload } = await jwtVerify(token, encodedKey);
//   return payload.userId as string;
// }


import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';

const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error('缺少 SESSION_SECRET');

const encodedKey = new TextEncoder().encode(secret);

// 定义 payload 类型
export interface UserPayload extends JWTPayload {
  admin_id: string;
  admin_username: string;
}

// 加密：登录成功后调用
export async function encrypt(payload: Omit<UserPayload, 'iat' | 'exp' | 'iss'>) {
  return new SignJWT(payload)  // ✅ 直接传入 payload，不要 {payload}
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

// 解密：验证 token 并返回完整 payload
export async function decrypt(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    return payload as UserPayload; // ✅ 返回完整对象，不要只返回 username
  } catch (error) {
    console.error('Token 验证失败:', error);
    return null;
  }
}