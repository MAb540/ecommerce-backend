import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AuthService } from 'src/services/auth/auth.service';
import { Logger } from 'winston';

import { SignUpDto } from 'src/services/auth/dto/signup.dto';
import { Response } from 'express';
import { SignInDto } from 'src/services/auth/dto/signin.dto';
@Controller('/auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async signUp(@Res() res: Response, @Body() signUpDto: SignUpDto) {
    const userId = await this.authService.signUpUser(res, signUpDto);

    return res.status(201).send({
      success: true,
      response: {
        id: userId,
        message: 'Email Verification required',
      },
    });
  }

  @Post('/signin')
  async singIn(@Res() res: Response, @Body() signInDto: SignInDto) {
    const userId = await this.authService.signInUser(res, signInDto);

    return res.status(200).json({
      success: true,
      response: {
        id: userId,
      },
    });
  }
}
