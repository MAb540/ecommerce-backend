import { UUID } from '@fusionauth/typescript-client';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UserEntity } from 'src/models/user.entity';
import fusionAuthClientConfig from 'src/utils/auth-utils/fusion_auth_client';
import {
  DbException,
  DBExceptionHandler,
} from 'src/utils/exceptions/db-exception';
import { UserMapper } from 'src/utils/mapper/user.mapper';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private readonly fusionAuthClient =
    fusionAuthClientConfig.getFusionAuthClient();

  async addUser(user: UserEntity): Promise<void> {
    try {
      const insertedUser = await this.userRepository.save(user);
      this.logger.info(`User = ${insertedUser.id} insert successfully in db`);
    } catch (err) {
      this.logger.error(`Not able to insert new user=${user.email} in
      the db. Error: ${JSON.stringify(err)}`);

      switch (DBExceptionHandler.handleError(err)) {
        case DbException.UniqueViolation:
          throw new ConflictException(
            'User with these credentials already exist',
          );

        default:
          throw new InternalServerErrorException('Some Error Occurred');
      }
    }
  }

  async getUser(userId: string): Promise<UserDTO> {
    try {
      if (!userId) {
        this.logger.info(`Invalid getUser() param, userId is undefined`);
        throw new UnprocessableEntityException(
          'Invalid query parameters/arguments',
        );
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('Invalid user id.');
      }
      return UserMapper.fromEntitytoDTO(user);
    } catch (err) {
      this.logger.error(
        `Error occurred while fetching user details. Error=${JSON.stringify(
          err,
        )}`,
      );
      throw new HttpException(
        {
          status: err.status,
          message: err.message,
          error: err.name,
        },
        err.statusCode,
      );
    }
  }

  async findAllUsers(): Promise<UserEntity[]> {
    this.logger.info('findAllUsers has been called');
    return this.userRepository.find();
  }

  async deleteUsers(userIds: Array<UUID>): Promise<number> {
    try {
      const deletedUsers = await this.fusionAuthClient.deleteUsersByQuery({
        dryRun: false,
        hardDelete: true,
        userIds,
      });
      this.logger.info(
        `User with given ids = ${userIds} deleted in fusionauth successfully`,
      );
      const { total, userIds: fusionAuthUserIds } = deletedUsers.response;

      if (deletedUsers.statusCode === 200 && total > 0) {
        this.userRepository
          .createQueryBuilder()
          .delete()
          .from(UserEntity)
          .where('id IN(:...userIds)', {
            userIds: fusionAuthUserIds,
          })
          .execute();
        this.logger.info(
          `User with given ids = ${fusionAuthUserIds} deleted from local db`,
        );
      }

      return total;
    } catch (err) {
      console.log(err);

      this.logger.error(
        `Error occurred during user signing-in process. Error=${JSON.stringify(
          err,
        )}`,
      );
      throw new InternalServerErrorException(
        'Something went wrong during user deleting Process',
      );
    }
  }
}
