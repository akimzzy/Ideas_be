import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { UserEntity } from 'src/user/user.entity';
import { IdeaController } from './idea.controller';
import { IdeaEntity } from './idea.entity';
import { IdeaService } from './idea/idea.service';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],
  controllers: [IdeaController],
  providers: [
    IdeaService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class IdeaModule {}
