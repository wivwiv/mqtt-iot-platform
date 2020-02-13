import { MQTTACLAccess } from 'src/support/enum';
import { MQTTACLAlow } from './../support/enum';
import {
  Table,
  Model,
  BelongsTo,
  Column,
  DataType,
} from 'sequelize-typescript';
import { Client } from './client.entity';

@Table({
  tableName: 'acl',
  indexes: [
    {
      fields: ['clientid'],
    },
    {
      fields: ['username'],
    },
    {
      fields: ['ip_address'],
    },
    {
      fields: ['topic'],
    },
    {
      fields: ['allow'],
    },
    {
      fields: ['rank'],
    },
  ],
})
export class ACL extends Model<ACL> {
  @Column({
    type: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    comment: 'MQTT Client ID',
  })
  clientid?: string;

  @BelongsTo(() => Client, {
    foreignKey: 'clientid',
    targetKey: 'id',
    constraints: false,
  })
  client?: Client;

  @BelongsTo(() => Client, {
    foreignKey: 'username',
    targetKey: 'id',
    constraints: false,
  })
  clientRefUsername?: Client;

  @Column({
    type: DataType.STRING(255),
    comment: 'MQTT Username',
  })
  username?: string;

  @Column({
    allowNull: false,
    comment: 'ACL Topic, using +、# and Variables: %u: username, %c: clientid',
  })
  topic: string;

  @Column({
    comment: 'Current ipaddress',
  })
  ipAddress?: string;

  @Column({
    comment: 'ACL allow 0: deny, 1: allow',
    defaultValue: MQTTACLAlow.ALLOW,
  })
  allow: MQTTACLAlow;

  @Column({
    comment: 'ACL access 1: subscribe, 2: publish, 3: pubsub',
    defaultValue: MQTTACLAccess.PUB_SUB,
  })
  access: MQTTACLAccess;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 100,
    comment: 'ACL rank, 100 > 99',
  })
  rank: number;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @Column
  version: number;
}

export default ACL;
