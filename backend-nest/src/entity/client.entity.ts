import { DeviceOnlineState } from './../support/enum';
import { Model, Table, DataType, Column } from 'sequelize-typescript';

@Table({
  tableName: 'client',
  indexes: [
    {
      fields: ['clientid'],
    },
    {
      fields: ['username'],
    },
    {
      fields: ['password'],
    },
  ],
})
export class Client extends Model<Client> {
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

  @Column({
    type: DataType.STRING(255),
    comment: 'MQTT Username',
  })
  username?: string;

  @Column({
    type: DataType.STRING(255),
    comment: 'MQTT Password',
  })
  password?: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: DeviceOnlineState.OFFLINE,
    comment: 'Device Online State',
  })
  onlineState: DeviceOnlineState;

  @Column({
    defaultValue: false,
    comment: 'Is banned',
  })
  banned: boolean;

  @Column({
    comment: 'Device last active At',
  })
  lastActiveAt?: Date;

  @Column({
    comment: 'Device last active reason',
  })
  lastActiveReason?: string;

  @Column({
    comment: 'Device last connect ipaddress',
  })
  ipAddress?: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @Column
  version: number;
}

export default Client;
