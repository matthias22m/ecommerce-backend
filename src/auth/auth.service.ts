import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

type userInput = {
  email: string;
  password: string;
};

type userType = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}


  async validateUser(input: userInput): Promise<userType | null> {
    const user = await this.usersService.findOneByEmail(input.email);
    
    if (user && await bcrypt.compare( input.password,user.password)) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(input: userInput): Promise<any> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return { access_token: this.jwtService.sign(payload)}
  }
}
