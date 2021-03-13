import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
// import { User } from './user.decorator';
import { UserDTO } from './user.dto';
import { UserService } from './user/user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @Get('api/users')
  @UseGuards(new AuthGuard())
  showAllUsers() {
    return this.userService.showAllUsers();
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}
