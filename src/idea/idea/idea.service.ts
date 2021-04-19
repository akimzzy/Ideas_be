import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { IdeaDTO, ideaRO } from '../idea.dto';
import { IdeaEntity } from '../idea.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(idea: IdeaEntity): ideaRO {
    return {
      ...idea,
      author: idea.author.toResponseObject(false),
      upvotes: idea.upvotes.length,
      downvotes: idea.downvotes.length,
      // upvotes: idea.upvotes.length,
      // downvotes: idea.downvotes.length,
    };
  }

  private updateDeleteGuard(idea: IdeaEntity, userId: string) {
    if (!idea) {
      throw new HttpException(`Idea doesn't exist`, HttpStatus.NOT_FOUND);
    }
    if (idea.author.id !== userId) {
      throw new HttpException(
        `This Idea is not yours`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async showAll(): Promise<ideaRO[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes'],
    });
    return ideas.map((idea) => this.toResponseObject(idea));
  }

  async create(userId: string, data: IdeaDTO): Promise<ideaRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(idea);
    return this.toResponseObject(idea);
  }

  async read(id: string): Promise<ideaRO> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });
    if (!idea) {
      throw new HttpException(`Idea doesn't exist`, HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(idea);
  }

  async update(
    id: string,
    data: Partial<IdeaDTO>,
    userId: string,
  ): Promise<ideaRO> {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });

    this.updateDeleteGuard(idea, userId);

    await this.ideaRepository.update({ id }, data);
    idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });
    return this.toResponseObject(idea);
  }

  async destroy(id: string, userId: string): Promise<ideaRO> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });

    this.updateDeleteGuard(idea, userId);

    await this.ideaRepository.delete({ id });
    return this.toResponseObject(idea);
    // return { deleted: true, idea: this.toResponseObject(idea) };
  }

  // async bookmark(id: string, userId: string) {
  //   const idea = await this.ideaRepository.findOne({ where: id });
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['bookmarks'],
  //   });

  //   if (
  //     user.bookmarks.filter((bookmark) => bookmark.id === idea.id).length < 1
  //   ) {

  //   }
  // }
}
