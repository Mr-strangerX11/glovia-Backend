import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateDeliverySettingsDto {
  @ApiProperty({ description: 'Delivery charge in NPR' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  charge: number;
}
