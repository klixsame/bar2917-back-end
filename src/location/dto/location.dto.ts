import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class LocationDto {
  @IsNumber()
  id: number;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  phone: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
