export interface IConfig {
  base: {
      HOST: string;
      PORT: number;
      BASIC_API_PATH: string;
  };
  sequelize: {
      DB_DIALECT: 'mysql' | 'sqlite';
      DB_STORAGE?: string;
      DB_HOST?: string;
      DB_PORT?: number;
      DB_USERNAME?: string;
      DB_PASSEORD?: string;
      DB_DATABASE: string;
      DB_TIMEZONE?: string;
  };
  emqx: {
      ALLOW_ANONYMOUS: boolean;
      ACL_NOMATCH: 'allow' | 'deny';
  };
}
