import {
  User as FusionAuthUser,
  UserRegistration,
} from '@fusionauth/typescript-client';
import { UserEntity } from 'src/models/user.entity';
import { UserDTO } from 'src/services/user/dto/user.dto';
import fusionAuthClientConfig from '../auth-utils/fusion_auth_client';
import { UserRole } from '../enum/user.enum';

export class UserMapper {
  static fromFusionAuthUserToUserEntity(
    user: FusionAuthUser,
    userRegistration: UserRegistration,
  ): UserEntity {
    const userEntity = new UserEntity();
    userEntity.id = user.id;
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.email = user.email;
    userEntity.username = user.username;
    userEntity.updatedBy = user.email;
    userEntity.role = ((userRegistration) => {
      if (
        userRegistration.applicationId ===
        fusionAuthClientConfig.getFusionAuthApplicationId()
      ) {
        return UserRole[userRegistration.roles[0]];
      }
      return UserRole['user'];
    })(userRegistration);

    return userEntity;
  }

  static fromEntitytoDTO(user: UserEntity): UserDTO {
    if (!user) {
      return;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.username,
    };
  }
}
