import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { JWT_SECRET } from 'src/configs/jwt_secret';
import { UpdateUserDto } from './dto/update-user.dto';

type userInput = {
  email: string;
  password: string;
};

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private authService: AuthService,
  ) {}
  
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const {password, ...result} = await this.userService.create(createUserDto);
    return result
  }

  @Post('login')
  async login(@Body() input: userInput) {
    return this.authService.login(input);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() request){
    return request.user
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() request, @Body() updateUserDto: UpdateUserDto){
    const user = request.user
    await this.userService.update(user.id,updateUserDto)
    const {password, ...result} = await this.userService.findOneByEmail(user.email)
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() request){
    const user = request.user
    await this.userService.remove(user.id)
  }

}
