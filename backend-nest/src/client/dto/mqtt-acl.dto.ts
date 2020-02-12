import { MQTTACLAccess } from 'src/support/enum';
import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MQTTACLDto {

    @ApiProperty({
        description: 'MQTT action access 1 = sub, 2 = pub',
    })
    @IsIn(['1', '2', 1, 2])
    access: MQTTACLAccess;


    @ApiProperty({
        description: 'MQTT access topic',
    })
    @IsNotEmpty({
        message: 'Topic can not be null',
    })
    topic: string;

    @ApiProperty()
    username: string;
    @ApiProperty()
    clientid: string;
    @ApiProperty()
    ipaddr: string;
    @ApiProperty()
    mountpoint: string;
}