require('dotenv').config()
const {Bot, GrammyError, HttpError, Keyboard} = require('grammy');
const fs = require('fs');

const bot = new Bot(process.env.BOT_API_KEY)

class Player {
    constructor(ID, isCanPlay) {
        this.ID = ID;
        this.isCanPlay = isCanPlay;
    }
}

bot.api.setMyCommands([
    { command: 'hi', description: 'Say hello to the bot' },
    { command: 'game', description: 'Start choosing from three games' }
]);

bot.command('start', async (ctx) => {
    await ctx.reply(`Hello, ${ctx.from.first_name}👋`)
}) 

bot.command('game', async (ctx) => {

    let objects = [];
    if (fs.existsSync('players.json')) {
        let json = fs.readFileSync('players.json');
        objects = JSON.parse(json);
    }

    if (!objects.some(obj => obj.ID === ctx.from.id)) {
        let obj = new Player(ctx.from.id, true);
        objects.push(obj);
    } else {
        for (let obj of objects) {
            obj.isCanPlay = true
        }
    }

    let json = JSON.stringify(objects);
    fs.writeFileSync('players.json', json);

    const gameKeyboard = new Keyboard()
    .text('Dice 🎲').row()
    .text('Basketball 🏀').row()
    .text('Darts 🎯').resized().oneTime();
    await ctx.reply("Choose a game", {
        reply_markup: gameKeyboard
    })
})

bot.hears(/🎲/, async (ctx) => {

    let json = fs.readFileSync('players.json');
    let objects = JSON.parse(json);

    for (let obj of objects) {
        if (obj.ID === ctx.from.id && obj.isCanPlay === true) {
            obj.isCanPlay = false
            const diceMessage = await ctx.replyWithDice('🎲');
            const diceValue = diceMessage.dice.value;
            if (diceValue === 6) {
                await ctx.reply(`Dice Roll Result: Critical Success! Wow`);
            } else if (diceValue === 1) {
                await ctx.reply(`Dice Roll Result: Critical Failure`);
            } else {
                await ctx.reply(`Dice Roll Result: ${diceValue}`);
            }
            fs.writeFileSync('players.json', JSON.stringify(objects));
        }
    }
})

bot.hears(/🏀/, async (ctx) => {

    let json = fs.readFileSync('players.json');
    let objects = JSON.parse(json);
    
    for (let obj of objects) {
        if (obj.ID === ctx.from.id && obj.isCanPlay === true) {
            obj.isCanPlay = false
            const diceMessage = await ctx.replyWithDice('🏀');
            const diceValue = diceMessage.dice.value;
            if (diceValue === 1) {
                await ctx.reply(`Ball throw result: You missed`);
            } else if (diceValue === 2) {
                await ctx.reply(`Ball throw result: Close, but you still missed`);
            } else if (diceValue === 3) {
                await ctx.reply(`Result of throwing the ball: Unpleasant situation, looks like I need to find a long stick`);
            } else if (diceValue === 4) {
                await ctx.reply(`Result of throwing the ball: Hit. Excellent result!`);
            } else if (diceValue === 5) {
                await ctx.reply(`Result of throwing the ball: Clean hit, looks like we've found the next Michael Jordan`);
            }
            fs.writeFileSync('players.json', JSON.stringify(objects));
        } else {
            await ctx.reply(`If you want to play, write the command /start or click on it`);
        }
    }
})

bot.hears(/🎯/, async (ctx) => {

    let json = fs.readFileSync('players.json');
    let objects = JSON.parse(json);
    
    for (let obj of objects) {
        if (obj.ID === ctx.from.id && obj.isCanPlay === true) {
            obj.isCanPlay = false
            const diceMessage = await ctx.replyWithDice('🎯');
            const diceValue = diceMessage.dice.value;
            if (diceValue === 1) {
                await ctx.reply(`Dart Throw Result: You Missed`);
            } else if (diceValue === 6) {
                await ctx.reply(`Dart throw result: Right on the bull's eye🍎`);
            } else {
                await ctx.reply(`Dart Throw Result: Not a bad result`);
            }
            fs.writeFileSync('players.json', JSON.stringify(objects));
        }
    }
})


bot.catch((err) => { const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`); const e = err.error;
    if (e instanceof GrammyError) {
     console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) { console.error('Could not contact Telegram:', e);
    } else {
    console.error('Unknown error:', e);
    }
});

bot.start();