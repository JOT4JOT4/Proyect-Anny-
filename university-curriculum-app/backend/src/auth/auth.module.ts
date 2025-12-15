import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Credential, CredentialSchema } from '../schemas/credential.schema';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{ name: Credential.name, schema: CredentialSchema }])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}