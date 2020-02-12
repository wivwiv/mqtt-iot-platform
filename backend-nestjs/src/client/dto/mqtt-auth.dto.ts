import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MQTTAuthDto {

    @ApiProperty({
        description: 'MQTT Username',
        type: 'string',
        required: false,
    })
    @IsString()
    username?: string;

    @ApiProperty({
        description: 'MQTT Client ID',
        type: 'string',
        required: false,
    })
    @IsString()
    clientid?: string;

    @ApiProperty({
        description: 'MQTT password',
        type: 'string',
        required: true,
    })
    @IsString()
    password: string;

    @ApiProperty({
        enum: ['true', 'false'],
        required: false,
        description: 'Is use username auth',
    })
    authUsername?: 'true' | 'false';
}