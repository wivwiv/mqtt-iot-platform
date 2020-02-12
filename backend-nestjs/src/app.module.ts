import { ClientModule } from './client/client.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule, DatabaseModule, ClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
