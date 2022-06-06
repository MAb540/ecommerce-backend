import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { UserModule } from './modules/user.module';
import { HttpRequestLogger } from './middlewares/HttpLogging.middleware';
import { loggingConfigObj } from './configs/loggerConfigs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './configs/typeorm.config';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(loggingConfigObj),
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpRequestLogger).forRoutes('*');
  }
}
