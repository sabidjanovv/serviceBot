import { Table, Model, Column, DataType } from 'sequelize-typescript';

interface IClientCreationAttr {
  user_id: number;
  name: string;
  phone_number: string;
  last_state: string;
}

@Table({ tableName: 'client' })
export class Client extends Model<Client, IClientCreationAttr> {
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
  name: string;

  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  last_state: string;
}
