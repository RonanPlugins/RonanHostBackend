import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['name'])
export class PageEntity {
  @PrimaryGeneratedColumn()
  @IsOptional()
  @ApiProperty({ description: 'The ID of the page.', required: false })
  id: number;

  @Column()
  @IsString()
  @ApiProperty({ description: 'The name of the page.', required: true })
  name: string;

  @Column()
  @IsString()
  @ApiProperty({ description: 'The content of the page.', required: true })
  content: string;

  @Column()
  @IsString()
  @ApiProperty({ description: 'The title of the page.', required: true })
  title: string;
}
