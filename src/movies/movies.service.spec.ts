import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { DatabaseService } from '../shared/db/db.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import axios from 'axios';

jest.mock('axios');

describe('MoviesService', () => {
  let service: MoviesService;
  let db: {
    movie: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const dbMock = {
      movie: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: DatabaseService, useValue: dbMock },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    db = module.get(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a movie', async () => {
    const dto: CreateMovieDto = {
      title: 'Test Movie',
      episodeId: 1,
      director: 'Lucas',
      producer: 'Kurtz',
      releaseDate: '1977-05-25',
      openingCrawl: 'A long time ago...',
    };

    const result = { ...dto, swapiId: 'manual-entry', id: 'abc123' };
    db.movie.create.mockResolvedValue(result);

    const movie = await service.create(dto);
    expect(db.movie.create).toHaveBeenCalledWith({
      data: { ...dto, swapiId: 'manual-entry' },
    });
    expect(movie).toEqual(result);
  });

  it('should list movies', async () => {
    const result = [{ id: '1' }, { id: '2' }];
    db.movie.findMany.mockResolvedValue(result);

    const movies = await service.listMovies();
    expect(db.movie.findMany).toHaveBeenCalledWith({
      orderBy: { episodeId: 'asc' },
    });
    expect(movies).toEqual(result);
  });

  it('should find a movie by id', async () => {
    const result = { id: '1', title: 'Test' };
    db.movie.findUnique.mockResolvedValue(result);

    const movie = await service.findById('1');
    expect(db.movie.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(movie).toEqual(result);
  });

  it('should update a movie', async () => {
    const dto: UpdateMovieDto = {
      title: 'Updated',
      episodeId: 2,
      director: 'Lucas',
      producer: 'McCallum',
      releaseDate: '1980-05-21',
      openingCrawl: 'It is a dark time...',
    };

    const result = { id: '1', ...dto };
    db.movie.update.mockResolvedValue(result);

    const movie = await service.update('1', dto);
    expect(db.movie.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: dto,
    });
    expect(movie).toEqual(result);
  });

  it('should delete a movie', async () => {
    const result = { id: '1', title: 'Deleted' };
    db.movie.delete.mockResolvedValue(result);

    const deleted = await service.delete('1');
    expect(db.movie.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(deleted).toEqual(result);
  });

  it('should sync movies from SWAPI', async () => {
    const swapiResponse = {
      data: {
        result: [
          {
            uid: '123',
            properties: {
              title: 'A New Hope',
              episode_id: 4,
              director: 'George Lucas',
              producer: 'Gary Kurtz',
              release_date: '1977-05-25',
              opening_crawl: 'It is a period of civil war...',
            },
          },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(swapiResponse);
    db.movie.findUnique.mockResolvedValue(null);
    db.movie.create.mockResolvedValue({ id: '123' });

    const response = await service.syncFromSwapi();

    expect(axios.get).toHaveBeenCalledWith('https://www.swapi.tech/api/films');
    expect(db.movie.create).toHaveBeenCalled();
    expect(response).toEqual({ message: 'Movies synced successfully' });
  });
});
