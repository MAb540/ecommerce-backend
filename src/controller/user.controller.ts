import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenAuthGuard } from 'src/services/auth/guards/access-token-auth-guard';
import { Roles } from 'src/services/auth/guards/roles.decorator';
import { RolesGuard } from 'src/services/auth/guards/roles.guard';
import { userIdsDto } from 'src/services/user/dto/user.dto';
import { UserService } from 'src/services/user/user.service';
import { UserRole } from 'src/utils/enum/user.enum';
import { ApiResponse } from 'src/utils/general-utils/ApiResponse';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile/:userId')
  @Roles(UserRole.admin)
  @UseGuards(AccessTokenAuthGuard, RolesGuard)
  async findUser(
    @Req() req: Request,
    @Param('userId') userId: string,
  ): Promise<ApiResponse> {
    const user = await this.userService.getUser(userId);
    return new ApiResponse(true, { user: user });
  }

  @Delete('')
  // @UseGuards(AccessTokenAuthGuard) userIdsDto
  async deleteUsers(@Body() body: userIdsDto) {
    console.log('delete users: ', body);

    const totalDeleted = await this.userService.deleteUsers(body.userIds);

    return new ApiResponse(true, {
      message: `${totalDeleted} users has been deleted `,
      total: totalDeleted,
    });
  }
}
