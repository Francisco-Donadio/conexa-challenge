import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Roles } from 'src/decorators/role.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
export class MoviesController {
  logger: any;
  constructor(private readonly moviesService: MoviesService) {}

  @Post('sync')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Sync movies from SWAPI' })
  sync() {
    return this.moviesService.syncFromSwapi();
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiBody({ type: CreateMovieDto })
  create(@Body() body: CreateMovieDto) {
    return this.moviesService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all movies' })
  list() {
    return this.moviesService.listMovies();
  }

  @Get(':id')
  @Roles('USER')
  @ApiOperation({ summary: 'Get a movie by ID' })
  findById(@Param('id') id: string) {
    return this.moviesService.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a movie by ID' })
  @ApiBody({ type: UpdateMovieDto })
  update(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    return this.moviesService.update(id, body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a movie by ID' })
  delete(@Param('id') id: string) {
    return this.moviesService.delete(id);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncCron() {
    try {
      await this.moviesService.syncFromSwapi();
      this.logger.log('Movie sync completed successfully.');
    } catch (err) {
      this.logger.error('Movie sync failed', err);
    }
  }
}
