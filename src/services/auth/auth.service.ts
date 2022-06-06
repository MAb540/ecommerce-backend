import { UUID } from '@fusionauth/typescript-client';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  cookieConstants,
  cookieOptions,
} from 'src/utils/auth-utils/cookie_utils';
import fusionAuthClientConfig from 'src/utils/auth-utils/fusion_auth_client';
import { UserMapper } from 'src/utils/mapper/user.mapper';
import { Logger } from 'winston';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  private readonly fusionAuthClient =
    fusionAuthClientConfig.getFusionAuthClient();

  private readonly fusionAuthApplicationId =
    fusionAuthClientConfig.getFusionAuthApplicationId();
  private readonly fusionAuthClientSecret =
    fusionAuthClientConfig.getFusionClientSecret();

  async signUpUser(res: Response, signUpDto: SignUpDto): Promise<UUID> {
    try {
      const userRegistration = await this.fusionAuthClient.register(undefined, {
        registration: {
          applicationId: this.fusionAuthApplicationId,
        },
        user: {
          firstName: signUpDto.firstName,
          lastName: signUpDto.lastName,
          username: signUpDto.userName,
          email: signUpDto.email,
          password: signUpDto.password,
        },
      });
      this.logger.info(
        `User = ${signUpDto.email} registered in fusionauth successfully`,
      );

      await this.userService.addUser(
        UserMapper.fromFusionAuthUserToUserEntity(
          userRegistration.response.user,
          userRegistration.response.registration,
        ),
      );
      this.logger.info(
        `User=${signUpDto.email} added in the table successfully.`,
      );

      const setCookieOptions = cookieOptions();
      res.cookie(
        cookieConstants.ACCESS_TOKEN,
        userRegistration.response.token,
        setCookieOptions,
      );
      res.cookie(
        cookieConstants.REFRESH_TOKEN,
        userRegistration.response.refreshToken,
        setCookieOptions,
      );

      return userRegistration.response.user.id;
    } catch (err) {
      this.logger.error(
        `Error occurred during user signing-up process. Error=${JSON.stringify(
          err,
        )}`,
      );

      // this err emits from FusionAuth.
      if (err.statusCode === 400) {
        throw new ConflictException(
          'User with these credentials already exist',
        );
      }

      // this err is generated by phone validator.
      if (err.status === 400) {
        throw err;
      }

      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async signInUser(res: Response, signInDto: SignInDto): Promise<UUID> {
    try {
      const userSignIn = await this.fusionAuthClient.login({
        applicationId: this.fusionAuthApplicationId,
        loginId: signInDto.email,
        password: signInDto.password,
      });
      this.logger.info(
        `User with email=${signInDto.email} signed in successfully.`,
      );
      const setCookieOptions = cookieOptions();
      res.cookie(
        cookieConstants.ACCESS_TOKEN,
        userSignIn.response.token,
        setCookieOptions,
      );
      res.cookie(
        cookieConstants.REFRESH_TOKEN,
        userSignIn.response.refreshToken,
        setCookieOptions,
      );
      return userSignIn.response.user.id;
    } catch (err) {
      this.logger.error(
        `Error occurred during user signing-in process. Error=${JSON.stringify(
          err,
        )}`,
      );
      console.log('error: ', err);
      if (err.statusCode === 404) {
        this.logger.error(
          `User with this email = ${signInDto.email} does not exist or password in incorrect`,
        );
        throw new NotFoundException(
          'User with given credentials does not exist',
        );
      }
      throw new InternalServerErrorException(
        'Something went wrong during user signin Process',
      );
    }
  }
}
