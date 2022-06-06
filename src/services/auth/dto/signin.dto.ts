import { IsEmail, Matches } from 'class-validator';
import { regexPasswordPattern } from './signup.dto';

export class SignInDto {
  @IsEmail()
  email: string;

  @Matches(regexPasswordPattern, {
    message:
      'Password length must be between 8 and 256 characters, must contain both upper and lower case characters, at least one number and at least one non-alphanumeric character.',
  })
  password: string;
}
