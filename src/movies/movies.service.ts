import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../shared/db/db.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import axios from 'axios';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private db: DatabaseService) {}

  async syncFromSwapi() {
    const response = await axios.get('https://www.swapi.tech/api/films');
    const films = response.data.result || response.data.results;

    if (!films || !Array.isArray(films)) {
      throw new Error('Unexpected SWAPI format');
    }

    for (const film of films) {
      const { uid, properties } = film;

      const existing = await this.db.movie.findUnique({
        where: { swapiId: uid },
      });

      if (!existing) {
        await this.db.movie.create({
          data: {
            swapiId: uid,
            title: properties.title,
            episodeId: properties.episode_id,
            director: properties.director,
            producer: properties.producer,
            releaseDate: properties.release_date,
            openingCrawl: properties.opening_crawl,
          },
        });
      }
    }

    return { message: 'Movies synced successfully' };
  }

  async create(dto: CreateMovieDto) {
    return this.db.movie.create({
      data: {
        ...dto,
        swapiId: 'manual-entry',
      },
    });
  }

  async listMovies() {
    return this.db.movie.findMany({
      orderBy: {
        episodeId: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.db.movie.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateMovieDto) {
    return this.db.movie.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    return this.db.movie.delete({
      where: { id },
    });
  }
}
