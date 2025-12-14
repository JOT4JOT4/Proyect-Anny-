import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MallasModule } from './mallas/mallas.module';

@Module({
  imports: [ AuthModule, MallasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}