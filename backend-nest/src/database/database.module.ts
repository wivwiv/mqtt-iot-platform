import { ConfigModule } from './../config/config.module';
import { DatabaseService } from "./database.service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    imports: [ConfigModule],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {
};