import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './shared/db/db.module';
import { MoviesModule } from './movies/movies.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, MoviesModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
