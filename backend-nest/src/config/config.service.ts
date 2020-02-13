import * as dotenv from 'dotenv';
import * as path from 'path';

import { IConfig } from './interface/config.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  public option: IConfig;
  private config: any = {};

  constructor(configFilePath = '.env') {
    this.config = dotenv.config({
      path: configFilePath,
    }).parsed || {};
    this.option = {
      base: {
        HOST: this.getString('HOST', 'localhost'),
        PORT: this.getNumber('PORT', 3000),
        BASIC_API_PATH: this.getString('BASIC_API_PATH', '/api'),
      },
      sequelize: {
        BENCHMARK: this.getBoolean('BENCHMARK', process.env.NODE_ENV !== 'production'),
        DB_DIALECT: this.getString('DB_DIALECT', 'mysql') as any,
        DB_STORAGE: this.getString(
          'DB_STORAGE',
          path.join(__dirname, '../../nest-mqtt.db'),
        ),
        DB_HOST: this.getString('DB_HOST', 'localhost'),
        DB_PORT: this.getNumber('DB_HOST', 3306),
        DB_USERNAME: this.getString('DB_USERNAME', 'root'),
        DB_PASSEORD: this.getString('DB_PASSEORD', ''),
        DB_DATABASE: this.getString('DB_DATABASE', 'nest-mqtt'),
        DB_TIMEZONE: this.getString('DB_TIMEZONE', ''),
      },
      emqx: {
        ALLOW_ANONYMOUS: this.getBoolean('ALLOW_ANONYMOUS', true),
        ACL_NOMATCH: this.getString('ACL_NOMATCH', 'deny') as any,
      },
    };
  }
  getString(key: string, defaultValue = ''): string {
    return this.config[key] || defaultValue;
  }
  getNumber(key: string, defaultValue = 0): number {
    const val = this.getString(key);
    return val ? parseFloat(val) : defaultValue;
  }
  getBoolean(key: string, defaultValue = true): boolean {
    const val = this.getString(key);
    if (!val) {
      return defaultValue;
    }
    return ['true', 'TRUE'].includes(val);
  }
}
