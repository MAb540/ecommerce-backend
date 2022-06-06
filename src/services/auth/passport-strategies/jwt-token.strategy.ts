import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { fusionAuth } from 'src/utils/constants';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req || !req.cookies['access_token']) {
          console.log('no access token with request: ', req.cookies);
          return null;
        }
        return req.cookies['access_token'];
      },
      algorithm: ['HS256'],
      secretOrKey:
        process.env.BACKEND_ENV === 'development'
          ? fusionAuth.FUSION_AUTH_JWT_PUBLIC_KEY
          : process.env.FUSION_AUTH_JWT_PUBLIC_KEY,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      authenticationType: payload.authenticationType,
    };
  }
}
