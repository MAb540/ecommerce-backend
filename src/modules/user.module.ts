import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/user.controller';
import { UserService } from 'src/services/user/user.service';

@Module({
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
