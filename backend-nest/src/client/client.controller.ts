import { ConnectResult, ACLResult } from 'src/support/enum';
import { CreateClientDto } from './dto/create-client.dto';
import { ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import {
  Query,
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { MQTTACLDto } from './dto/mqtt-acl.dto';
import { MQTTAuthDto } from './dto/mqtt-auth.dto';

@Controller('client')
@ApiTags('Client Management and Auth/ACL')
export class ClientController {
  constructor(readonly clientService: ClientService) {}

  @Get('')
  async findAllClient() {
    return this.clientService.findAllClient();
  }

  @Post('')
  async createClient(@Body() client: CreateClientDto) {
    return this.clientService.createClient(client);
  }

  @Post('/mqtt/auth')
  @HttpCode(200)
  async auth(@Body() data: MQTTAuthDto) {
    let authResult: ConnectResult = ConnectResult.SUCCESS;
    if (data.authUsername === 'true') {
      authResult = await this.clientService.connectAuthByUsername(data);
    } else {
      authResult = await this.clientService.connectAuthByClientId(data);
    }
    // success 200 && ignore
    if (authResult === ConnectResult.NOT_FOUND) {
      return 'ignore';
    }
    if (authResult !== ConnectResult.SUCCESS) {
      throw new UnauthorizedException({
        result: authResult,
      });
    }
    return {
      result: authResult,
    };
  }

  @Get('/mqtt/acl')
  async checkACL(@Query() data: MQTTACLDto) {
    const authResult: ACLResult = await this.clientService.checkACL(data);
    if (authResult === ACLResult.NOT_FOUND) {
      return 'ignore';
    }
    if (authResult === ACLResult.DENY) {
      throw new UnauthorizedException({
        result: ACLResult.DENY,
      });
    }
    return {
      result: ACLResult.ALLOW,
    };
  }
}
