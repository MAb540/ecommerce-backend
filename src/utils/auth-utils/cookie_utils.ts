import { cookieDomain } from '../constants';
import { CookieOptions } from 'express';

export const cookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    domain:
      process.env.BACKEND_ENV === 'development'
        ? cookieDomain.DEV_DOMAIN
        : cookieDomain.PROD_DOMAIN,
    maxAge: 24 * 60 * 60 * 1000, // maxAge will get currentTime by default and add our given milliseconds to it
    sameSite: 'none',
  };
};

export const cookieConstants = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};
