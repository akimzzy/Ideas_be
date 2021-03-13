import {
  ArgumentMetadata,
  //   BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      //   console.log("IT'S EMPTY BRO => 2");
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        `Validation failed: ${JSON.stringify(this.formatErrors(errors))}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  //   private formatErrors(errors: ValidationError[]) {
  //     return errors.map((err) => {
  //       for (const property in err.constraints) {
  //         if (err.constraints.hasOwnProperty(property)) {
  //           console.log(property);

  //           return {
  //             path: err.property,
  //             message: err.constraints[property],
  //           };
  //         }
  //       }
  //     });
  //   }

  private formatErrors(errors: any[]) {
    return errors
      .map((err) => {
        for (const property in err.constraints) {
          return err.constraints[property];
        }
      })
      .join(', ');
  }

  private isEmpty(value: any) {
    // console.log("IT'S EMPTY BRO => 1");
    if (Object.keys(value).length > 0) {
      return false;
    }

    return true;
  }
}
