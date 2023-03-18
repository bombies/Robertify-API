import { Module } from '@nestjs/common';
import { FavouriteTracksService } from './favourite-tracks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FavouriteTracksSchema } from './favourite-tracks.schema';
import { FavouriteTracksController } from './favourite-tracks.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'favouritetracks', schema: FavouriteTracksSchema },
    ]),
  ],
  providers: [FavouriteTracksService],
  controllers: [FavouriteTracksController],
  exports: [FavouriteTracksService],
})
export class FavouriteTracksModule {}
