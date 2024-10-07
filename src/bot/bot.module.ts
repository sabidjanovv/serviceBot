import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { Client } from './models/client.model';
import { Master } from './models/master.model';
import { BotUpdate } from './bot.update';
import { Category } from './models/category.model';

@Module({
  imports: [SequelizeModule.forFeature([Bot, Client, Master, Category])],
  providers: [BotService, BotUpdate],
  exports: [BotService],
})
export class BotModule {}
