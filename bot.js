const { Telegraf } = require('telegraf');
require("dotenv").config()
const text = require('./const')
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Hello there!"));
bot.help((ctx) => ctx.reply(text.commands))


bot.command('buttons', (ctx) => {
    ctx.reply('some', {reply_markup: {keyboard: [[{text: 'button1', callback_data: 'button1'}],[{text: 'button2', callback_data: 'button2'}], [{text: 'button3', callback_data: 'button3'}]]}})
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));