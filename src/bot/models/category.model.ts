import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface ICategoryCreationAttr {
  name: string;
}

@Table({ tableName: 'category', timestamps:false })
export class Category extends Model<Category, ICategoryCreationAttr> {
  @ApiProperty({
    example: 1,
    description: 'Unique ID of the category (auto increment)',
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Football',
    description: 'Name of the category',
  })
  @Column({
    type: DataType.STRING,
  })
  name: string;
}
