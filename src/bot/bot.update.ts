import {
  Ctx,
  On,
  Start,
  Update,
  Hears,
  Command,
  Action,
} from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { BotService } from './bot.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { TelegrafExceptionFilter } from '../filters/telegraf-exception.filter';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}
  @Start()
  async oneStart(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  @UseFilters(TelegrafExceptionFilter)
  @UseGuards(AdminGuard)
  @Command('admin')
  async onAdminCommand(@Ctx() ctx: Context) {
    await this.botService.admin_menu(ctx, `Xush kelibsiz, ADMIN`);
  }

  @On('contact')
  async onContact(@Ctx() ctx: Context) {
    await this.botService.onContact(ctx);
  }

  @Command('stop')
  async onStop(@Ctx() ctx: Context) {
    await this.botService.onStop(ctx);
  }

  @Action('register')
  async onClickRegister(@Ctx() ctx: Context) {
    await this.botService.onClickRegister(ctx);
  }

  @Hears('Master')
  async showCategory(@Ctx() ctx: Context) {
    await this.botService.showCategory(ctx);
  }

  @Action('cancel_master')
  async cancelMasters(@Ctx() ctx: Context) {
    await this.botService.cancelMasters(ctx);
  }

  @Hears('Adminga yuborish✅')
  async adminCheckingMasterInfo(@Ctx() ctx: Context) {
    await this.botService.adminCheckingMasterInfo(ctx);
  }

  @Action('confirm_master')
  async adminCheckedMaster(@Ctx() ctx: Context) {
    await this.botService.adminCheckedMaster(ctx);
  }

  @Action(/category_+\d/)
  async onClickAnyCategory(@Ctx() ctx: Context) {
    await this.botService.onClickAnyCategory(ctx);
  }

  @Hears('Client')
  async addNewClient(@Ctx() ctx: Context) {
    await this.botService.addNewClient(ctx);
  }

  @On('location')
  async onLocation(@Ctx() ctx: Context) {
    await this.botService.onLocation(ctx);
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    await this.botService.onText(ctx);
  }
}
