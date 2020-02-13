import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    type: 'string',
    description: 'MQTT Username',
  })
  username?: string;

  @ApiProperty({
    type: 'string',
    description: 'MQTT Client ID',
  })
  clientid?: string;

  @ApiProperty({
    type: 'string',
    description: 'MQTT Password',
  })
  @IsString()
  password: string;
}
