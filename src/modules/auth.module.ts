import { Module } from '@nestjs/common';
import { AuthController } from 'src/controller/auth.controller';
import { AuthService } from 'src/services/auth/auth.service';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
