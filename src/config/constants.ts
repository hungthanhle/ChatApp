import * as dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/.env' });
export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.JWT_EXPIRE_TIME,
};
