import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

interface DBConfig {
    type: 'mysql' | 'mariadb' | 'postgres' | 'cockroachdb' | 'sqlite' | 'mssql' | 'sap' | 'oracle' | 'cordova' | 'nativescript' | 'react-native' | 'sqljs' | 'mongodb' | 'aurora-mysql' | 'aurora-postgres' | 'expo' | 'better-sqlite3' | 'capacitor' | 'spanner';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
}

const dbConfig: DBConfig = config.get<DBConfig>('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type as any, 
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT ? parseInt(process.env.RDS_PORT, 10) : dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: process.env.TYPEORM_SYNC ? process.env.TYPEORM_SYNC === 'true' : dbConfig.synchronize,
};
