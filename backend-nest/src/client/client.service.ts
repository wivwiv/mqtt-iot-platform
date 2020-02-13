import { MQTTAuthDto } from './dto/mqtt-auth.dto';
import { MQTTACLDto } from './dto/mqtt-acl.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from '../entity/client.entity';
import { Op } from 'sequelize';
import {
  ConnectResult,
  MQTTACLAccess,
  ACLResult,
  MQTTACLAlow,
} from '../support/enum';
import mqttMatch = require('mqtt-match');
import { ACL } from '../entity/acl.entity';

export class ClientService {
  async createClient(client: CreateClientDto): Promise<Client> {
    return Client.create(client);
  }

  async findAllClient(): Promise<Client[]> {
    return Client.findAll({
      attributes: {
        exclude: ['password'],
      },
      order: [['id', 'DESC']],
    });
  }

  async connectAuthByUsername(data: MQTTAuthDto): Promise<ConnectResult> {
    const client = await Client.findOne({
      where: {
        username: data.username,
      },
      attributes: ['id', 'clientid', 'username', 'password'],
    });
    let authResult: ConnectResult = ConnectResult.SUCCESS;
    if (!client) {
      authResult = ConnectResult.NOT_FOUND;
    } else if (client.password !== data.password) {
      authResult = ConnectResult.PASSEORD_ERROR;
    } else if (client.banned) {
      authResult = ConnectResult.BANNED;
    }
    return authResult;
  }

  async connectAuthByClientId(data: MQTTAuthDto): Promise<ConnectResult> {
    const client = await Client.findOne({
      where: {
        clientid: data.clientid,
      },
      attributes: ['id', 'clientid', 'username', 'password'],
    });
    let authResult = ConnectResult.SUCCESS;
    if (!client) {
      authResult = ConnectResult.NOT_FOUND;
    } else if (client.password !== data.password) {
      authResult = ConnectResult.PASSEORD_ERROR;
    } else if (client.banned) {
      authResult = ConnectResult.BANNED;
    }
    return authResult;
  }

  async checkACL(data: MQTTACLDto): Promise<ACLResult> {
    const where: any = {
      [Op.or]: [],
    };
    // username client ==> or
    if (data.username && data.username !== 'undefined') {
      where[Op.or].push({ username: data.username });
    }
    if (data.clientid && data.clientid !== 'undefined') {
      where[Op.or].push({ clientid: data.clientid });
    }
    const access = parseInt(data.access.toString(), 10);
    where.access = {
      [Op.in]: [access, MQTTACLAccess.PUB_SUB],
    };
    const aclList = await ACL.findAll({
      where,
      attributes: [
        'clientid',
        'username',
        'access',
        'topic',
        'allow',
        'ipAddress',
        'rank',
        'version',
      ],
      order: [['rank', 'DESC']],
    });
    const firstMatchedACL = aclList.find($ => {
      const currentTopic = $.topic
        .replace(/\%c/gim, data.clientid)
        .replace(/\%u/gim, data.username);
      const topicMatch = mqttMatch(currentTopic, data.topic);
      if (topicMatch) {
        return true;
      }
      return false;
    });
    let aclResult: ACLResult = ACLResult.NOT_FOUND;
    if (!firstMatchedACL) {
      return aclResult;
    }
    aclResult =
      firstMatchedACL.access === MQTTACLAlow.ALLOW
        ? ACLResult.ALLOW
        : ACLResult.DENY;
    return aclResult;
  }
}
