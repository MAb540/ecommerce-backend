import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export const regexPasswordPattern = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,256})',
);

const regexUsernamePattern = new RegExp(/^[A-Za-z0-9\s]+$/);

export class SignUpDto {
  @IsString()
  @Length(3, 100, {
    message: 'First name length should be between 3 and 100 characters',
  })
  firstName: string;

  @IsString()
  @Length(3, 100, {
    message: 'Last name length should be between 3 and 100 characters',
  })
  lastName: string;

  @IsString()
  @Length(3, 100, {
    message: 'Username length should be between 3 and 100 characters',
  })
  @Matches(regexUsernamePattern, {
    message: 'Username shoud be alphabetic or alphabetic characters',
  })
  userName: string;

  @IsEmail()
  email: string;

  @Matches(regexPasswordPattern, {
    message:
      'Password length must be between 8 and 256 characters, must contain both upper and lower case characters, at least one number and at least one non-alphanumeric character.',
  })
  password: string;
}
