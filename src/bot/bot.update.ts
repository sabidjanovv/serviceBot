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

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}
  @Start()
  async oneStart(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
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

  @Hears('Bekor qilish❌')
  async cancelMasters(@Ctx() ctx: Context) {
    await this.botService.cancelMasters(ctx);
  }

  @Hears('Tasdiqlash✅')
  async adminCheckingMasterInfo(@Ctx() ctx: Context) {
    await this.botService.adminCheckingMasterInfo(ctx);
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
