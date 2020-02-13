import * as path from 'path';
import { ConfigService } from '../config/config.service';
import { Logger, Injectable, Global } from '@nestjs/common';
import * as fs from 'fs';
import { Sequelize } from 'sequelize-typescript';

const sequelizeLogger = new Logger('Sequelize');
const logger = new Logger('Common');

@Injectable()
@Global()
export class DatabaseService {
  public sequelize: Sequelize;
  constructor(private readonly configService: ConfigService) {
    this.initDB();
  }
  async initDB() {
    const modelPath = path.join(__dirname, '../entity/**/**.entity.{ts,js}');
    const option = this.configService.option.sequelize;
    this.sequelize = new Sequelize({
      dialect: option.DB_DIALECT || 'mysql',
      storage: option.DB_STORAGE,
      dialectOptions: { decimalNumbers: true },
      host: option.DB_HOST,
      port: option.DB_PORT || 3306,
      username: option.DB_USERNAME,
      password: option.DB_PASSEORD,
      database: option.DB_DATABASE,
      pool: {
        max: 10,
        min: 0,
        acquire: 20000,
        idle: 20000,
      },
      modelPaths: [modelPath],
      benchmark: option.BENCHMARK,
      logging(...args) {
        const used = typeof args[1] === 'number' ? `[${args[1]}ms]` : '';
        sequelizeLogger.log(`${used} ${args[0]}`);
      },
      define: {
        freezeTableName: false,
        underscored: true,
        version: true,
      },
    });
    try {
      await this.sequelize.query('SELECT 1 + 1 as result');
      logger.log('Sequelize Ready');
    } catch (e) {
      throw new Error(
        `Database ${option.DB_DIALECT} connect error ${e.message}`,
      );
    }
    // sqlite3 auto create and sync
    if (option.DB_DIALECT === 'sqlite' && !fs.existsSync(option.DB_STORAGE)) {
      logger.log('sqlite3 auto create and sync...');
      await this.sync();
    }
    return this;
  }
  sync(alert = true) {
    if (alert) {
      return this.sequelize.sync({ alter: true });
    }
    return this.sequelize.sync({ force: true });
  }
  get models() {
    return this.sequelize.models;
  }
}
