import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetCurriculumDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}