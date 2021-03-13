import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }
    request.user = await this.validateTokem(request.headers.authorization);
    return true;
  }

  async validateTokem(auth: string) {
    const bearer_token = auth.split(' ');

    if (bearer_token[0] !== 'Bearer' || !bearer_token[1]) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    try {
      const decoded = jwt.verify(bearer_token[1], process.env.SECRET);
      return decoded;
    } catch (err) {
      const message = err.message || err.name;
      throw new HttpException('Token error: ' + message, HttpStatus.FORBIDDEN);
    }
  }
}
