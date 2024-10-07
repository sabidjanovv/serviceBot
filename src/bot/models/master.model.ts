import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Category } from './category.model';

interface IMasterCreationAttr {
  user_id: number;
  category_name: string;
  name: string;
  phone_number: string;
  work_place_name: string;
  address_name: string;
  address: string;
  location: string;
  start_time: string;
  end_time: string;
  avg_time_client: string;
  last_state: string;
  is_active: boolean;
}

@Table({ tableName: 'master' })
export class Master extends Model<Master, IMasterCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
  })
  category_name: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  work_place_name: string;


  @Column({
    type: DataType.STRING,
  })
  address_name: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  location: string;

  @Column({
    type: DataType.STRING,
  })
  start_time: string;

  @Column({
    type: DataType.STRING,
  })
  end_time: string;

  @Column({
    type: DataType.STRING,
  })
  avg_time_client: string;

  @Column({
    type: DataType.STRING,
  })
  last_state: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;
}
