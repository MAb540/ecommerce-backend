import { UUID } from '@fusionauth/typescript-client';
import { IsUUID } from 'class-validator';
export class UserDTO {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  userName: string;
}

export class userIdsDto {
  @IsUUID('4', {
    each: true,
  })
  userIds: Array<UUID>;
}
