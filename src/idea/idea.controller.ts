import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from 'src/user/user.decorator';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea/idea.service';

@Controller('api/ideas')
export class IdeaController {
  private logger = new Logger();

  private logData(options: any) {
    options.userId &&
      this.logger.log('USER_ID => ' + JSON.stringify(options.userId));
    options.data && this.logger.log('IDEA => ' + JSON.stringify(options.data));
    options.id && this.logger.log('IDEA_ID => ' + JSON.stringify(options.id));
  }
  constructor(private ideaService: IdeaService) {}

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(ValidationPipe)
  createIdea(@User('id') userId: string, @Body() data: IdeaDTO) {
    this.logData({ userId, data });
    return this.ideaService.create(userId, data);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(ValidationPipe)
  updateIdea(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() data: Partial<IdeaDTO>,
  ) {
    this.logData({ userId, data, id });
    return this.ideaService.update(id, data, userId);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyIdea(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, userId });
    return this.ideaService.destroy(id, userId);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmarkIdea(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, userId });
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  unbookmarkIdea(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, userId });
  }
}
