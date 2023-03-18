import { Controller, Get, Param } from '@nestjs/common';
import { FavouriteTracksService } from './favourite-tracks.service';

@Controller('favourite-tracks')
export class FavouriteTracksController {
  constructor(
    private readonly favouriteTracksService: FavouriteTracksService,
  ) {}

  @Get(':user_id')
  async getTracksForUser(@Param('user_id') user_id: string) {
    return this.favouriteTracksService.findOne(user_id);
  }
}
