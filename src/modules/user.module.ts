import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controller/user.controller';
import { UserEntity } from 'src/models/user.entity';
import { RolesGuard } from 'src/services/auth/guards/roles.guard';
import { AccessTokenStrategy } from 'src/services/auth/passport-strategies/jwt-token.strategy';
import { UserService } from 'src/services/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, AccessTokenStrategy, RolesGuard],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
