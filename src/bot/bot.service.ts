import { Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { Master } from './models/master.model';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf, Markup } from 'telegraf';
import { BOT_NAME } from '../app.constants';
import { Category } from './models/category.model';
import { Client } from './models/client.model';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private botModel: typeof Bot,
    @InjectModel(Master) private masterModel: Master,
    @InjectModel(Category) private categoryModel: typeof Category,
    @InjectBot(BOT_NAME) private bot: Telegraf<Context>,
  ) {}
  async start(ctx: Context) {
    const userId = ctx.from.id;
    const user = await this.botModel.findByPk(userId);
    if (!user) {
      await this.botModel.create({
        user_id: userId,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        lang: ctx.from.language_code,
      });
      await ctx.reply(
        `Iltimos, <b>"📱 Telefon raqamni yuboring" tugmasini bosing</b>`,
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('📱 Telefon raqamni yuboring')],
          ])
            .resize()
            .oneTime(),
        },
      );
    } else if (!user.status) {
      await ctx.reply(
        `Iltimos, <b>"📱 Telefon raqamni yuboring" tugmasini bosing</b>`,
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('📱 Telefon raqamni yuboring')],
          ])
            .resize()
            .oneTime(),
        },
      );
    } else {
      await ctx.reply(
        `Bu bot Master'lar qo'shish va ularni bro'n qilish uchun ishlatilinadi`,
        {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        },
      );
    }
  }

  async onContact(ctx: Context) {
    if ('contact' in ctx.message) {
      const userId = ctx.from.id;
      const user = await this.botModel.findByPk(userId);
      if (!user) {
        await ctx.reply(`Iltimos, Start tugmasini bosing`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']])
            .resize()
            .oneTime(),
        });
      } else if (ctx.message.contact.user_id != userId) {
        await ctx.reply(`Iltimos, O'zingizni telefon raqamingizni yuboring!`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('📱 Telefon raqamni yuboring')],
          ])
            .resize()
            .oneTime(),
        });
      } else {
        await this.botModel.update(
          {
            phone_number: ctx.message.contact.phone_number,
            status: true,
          },
          {
            where: { user_id: userId },
          },
        );
        await this.bot.telegram.sendChatAction(user.user_id, 'typing');
        await ctx.reply(`Tabriklayman siz faollashtirildingiz`, {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        });

        await this.bot.telegram.sendChatAction(user.user_id, 'typing');
        await ctx.replyWithHTML(`<b>Bot'dan ro'yxattan o'ting: </b>`, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Ro'yxattan o'tish",
                  callback_data: `register`,
                },
              ],
            ],
          },
        });
      }
    }
  }

  async onStop(ctx: Context) {
    const userId = ctx.from.id;
    const user = await this.botModel.findByPk(userId);
    if (!user) {
      await ctx.reply(`Siz avval ro'yxattan o'tmagansiz`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([['/start']])
          .resize()
          .oneTime(),
      });
    } else if (user.status) {
      await this.botModel.update(
        { status: false, phone_number: null },
        { where: { user_id: userId } },
      );
      await this.bot.telegram.sendChatAction(user.user_id, 'typing');
      await ctx.reply(`Siz botdan chiqdingiz`, {
        parse_mode: 'HTML',
        ...Markup.removeKeyboard(),
      });
    }
  }

  async onClickRegister(ctx: Context) {
    await ctx.reply(`Categoriyani tanlang:`, {
      parse_mode: 'HTML',
      ...Markup.keyboard([['Master', 'Client']])
        .resize()
        .oneTime(),
    });
  }

  async showCategory(ctx: Context) {
    const categories = await this.categoryModel.findAll({
      include: { all: true },
    });

    const inlineKeyboard = categories.map((category) => [
      {
        text: `${category.name}`,
        callback_data: `category_${category.id}`,
      },
    ]);

    await ctx.replyWithHTML('Kategoriyalardan birini tanlang:', {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  }

  async onClickAnyCategory(ctx: Context) {
    const userId = ctx.from.id;
    const actText: String = ctx.callbackQuery['data'];
    const category_id = Number(actText.split('_')[1]);
    const category = await this.categoryModel.findByPk(category_id);
    await Master.create({
      user_id: userId,
      category_name: category.name,
      last_state: 'name',
    });
    await ctx.reply(`Ismingizni kiriting:`, {
      parse_mode: 'HTML',
      ...Markup.removeKeyboard(),
    });
  }

  async addNewMaster(ctx: Context) {
    const userId = ctx.from.id;
    const user = await this.botModel.findByPk(userId);
    if (!user) {
      await ctx.reply(`Siz avval ro'yxattan o'tmagansiz`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([['/start']])
          .resize()
          .oneTime(),
      });
    }
  }

  async addNewClient(ctx: Context) {
    const userId = ctx.from.id;
    const user = await this.botModel.findByPk(userId);
    if (!user) {
      await ctx.reply(`Siz avval ro'yxattan o'tmagansiz`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([['/start']])
          .resize()
          .oneTime(),
      });
    } else {
      await Master.create({
        user_id: userId,
        last_state: 'name',
      });
      await ctx.reply(`Ismingizni kiriting:`, {
        parse_mode: 'HTML',
        ...Markup.removeKeyboard(),
      });
    }
  }

  async onText(ctx: Context) {
    if ('text' in ctx.message) {
      const userId = ctx.from.id;
      const user = await this.botModel.findByPk(userId);
      if (!user) {
        await ctx.reply(`Siz avval ro'yxattan o'tmagansiz`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']])
            .resize()
            .oneTime(),
        });
      } else {
        const master = await Master.findOne({
          where: { user_id: userId },
          order: [['id', 'DESC']],
        });
        if (master) {
          if (master.last_state === 'name') {
            master.name = ctx.message.text;
            master.last_state = 'phone_number';
            await master.save();
            console.log(master.last_state);

            await ctx.reply(
              `Telefon raqamingizni kiriting yoki qo'shimcha raqam kiriting:`,
              {
                parse_mode: 'HTML',
                ...Markup.removeKeyboard(),
              },
            );
          } else if (master.last_state === 'phone_number') {
            master.phone_number = ctx.message.text;
            master.last_state = 'work_place_name';
            await master.save();
            await ctx.reply(`Ish joyingiz nomini kiriting:`, {
              parse_mode: 'HTML',
              ...Markup.removeKeyboard(),
            });
          } else if (master.last_state === 'work_place_name') {
            master.work_place_name = ctx.message.text;
            master.last_state = 'address_name';
            await master.save();
            await ctx.reply(`Manzil nomini kiriting:`, {
              parse_mode: 'HTML',
              ...Markup.removeKeyboard(),
            });
          } else if (master.last_state === 'address_name') {
            master.address_name = ctx.message.text;
            master.last_state = 'address';
            await master.save();
            await ctx.reply(`Manzilni kiriting:`, {
              parse_mode: 'HTML',
              ...Markup.removeKeyboard(),
            });
          } else if (master.last_state === 'address') {
            master.address = ctx.message.text;
            master.last_state = 'location';
            await master.save();
            await ctx.reply(`Manzilingiz lokatsiyasini yuboring:`, {
              parse_mode: 'HTML',
              ...Markup.keyboard([
                [Markup.button.locationRequest('Lokatsiyani yuborish')],
              ])
                .resize()
                .oneTime(),
            });
          } else if (master.last_state === 'start_time') {
            master.start_time = ctx.message.text;
            master.last_state = 'end_time';
            await master.save();
            await ctx.reply(`Ish vaqtingiz tugash vaqtini kiriting(18:00):`, {
              parse_mode: 'HTML',
              ...Markup.removeKeyboard(),
            });
          } else if (master.last_state === 'end_time') {
            master.end_time = ctx.message.text;
            master.last_state = 'avg_time_client';
            await master.save();
            await ctx.reply(
              `Har bir mijozga qancha vaqt ajratishingizni daqiqada kiriting:(30)`,
              {
                parse_mode: 'HTML',
                ...Markup.removeKeyboard(),
              },
            );
          } else if (master.last_state === 'avg_time_client') {
            master.avg_time_client = ctx.message.text;
            master.last_state = 'finish';
            await master.save();
            await ctx.reply(`Ma'lumotlarni tasdiqlaysizmi?: `, {
              parse_mode: 'HTML',
              ...Markup.keyboard([['Adminga yuborish✅', 'Bekor qilish❌']])
                .resize()
                .oneTime(),
            });
          }
        }
      }
    }
  }

  async cancelMasters(ctx: Context) {
    const userId = ctx.from.id;
    const master = await Master.findOne({
      where: { user_id: userId },
      order: [['id', 'DESC']],
    });
    if (master) {
      await Master.destroy({
        where: { user_id: userId },
      });
      await ctx.telegram.sendMessage(
        master.user_id,
        `Ma'lumotlaringiz layoqli deb topilmadi!`,
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']])
            .resize()
            .oneTime(),
        },
      );
    }
  }

  //ORIGINAL
  async adminCheckingMasterInfo(ctx: Context) {
    const userId = ctx.from.id;
    const master = await Master.findOne({
      where: { user_id: userId },
      order: [['id', 'DESC']],
    });

    if (master) {
      const masterData = `
      <b>Master Info:</b>
      User ID: ${master.user_id}
      Name: ${master.name}
      Phone Number: ${master.phone_number}
      Work Place: ${master.work_place_name}
      Address Name: ${master.address_name}
      Address: ${master.address}
      Location: ${master.location}
      Start Time: ${master.start_time}
      End Time: ${master.end_time}
      Avg Time per Client: ${master.avg_time_client}
    `;
      const groupChatId = '-1002491862389';
      await ctx.telegram.sendMessage(
        groupChatId,
        masterData,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✅Tasdiqlash',
                  callback_data: `confirm_master`,
                },
                {
                  text: 'Bekor qilish❌',
                  callback_data: `cancel_master`,
                },
              ],
            ],
          },
        },
      );
    } else {
      await ctx.reply(`Master information not found.`);
    }
  }

  async adminCheckedMaster(ctx: Context) {
    const userId = ctx.from.id;
    const master = await Master.findOne({
      where: { user_id: userId },
      order: [['id', 'DESC']],
    });
    if (master) {
      master.is_active = true;
      await master.save();

      await ctx.telegram.sendMessage(
        master.user_id,
        `Ma'lumotlaringiz <b>Admin</b> tomondan tekshirildi va muvaffaqiyatli tasdiqlandi!☺️`,
        {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        },
      );
    }
    // CONTINUE
  }

  async onLocation(ctx: Context) {
    if ('location' in ctx.message) {
      const userId = ctx.from.id;
      const user = await this.botModel.findByPk(userId);
      if (!user) {
        await ctx.reply(`Siz avval ro'yxattan o'tmagansiz`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']])
            .resize()
            .oneTime(),
        });
      } else {
        const master = await Master.findOne({
          where: { user_id: userId },
          order: [['id', 'DESC']],
        });
        if (master) {
          if (master.last_state == 'location') {
            master.location = `${ctx.message.location.latitude},${ctx.message.location.longitude}`;
            master.last_state = 'start_time';
            await master.save();
            await ctx.reply(`Ish qabul qilingan vaqtni kiriting(09:00):`, {
              parse_mode: 'HTML',
              ...Markup.removeKeyboard(),
            });
          }
        }
      }
    }
  }

  async admin_menu(ctx: Context, menu_text = `<b>Admin menyusi</b>`) {
    try {
      await ctx.reply(menu_text, {
        parse_mode: 'HTML',
        ...Markup.keyboard([['Master', 'Client']])
          .oneTime()
          .resize(),
      });
    } catch (error) {
      console.log('Admin menyusida xatolik', error);
    }
  }
}
