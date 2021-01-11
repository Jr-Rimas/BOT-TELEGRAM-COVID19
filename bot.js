require('dotenv').config({path: '.env'});
const { Telegraf } = require('telegraf');
const api = require('novelcovid');
const Markup = require('telegraf/markup');

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

bot.start((ctx) =>
  ctx.reply(
    `Привет, ${ctx.message.from.first_name}! Введи название страны на английском, что бы узнать статистику по COVID19, списко стран доступен 
    по команде /help`,
    Markup.keyboard([
      ['Russia', 'USA', 'Belarus'],
      ['Ukraine', '/help'],
    ])
      .resize()
      .extra()
  )
);

bot.help(async (ctx) => {
  let allCountries = {};
    allCountries = await api.countries();
    let countries = '';
    for (let i = 0; i < allCountries.length; i += 1) {
      countries += `${allCountries[i].country}, `;
    }
    ctx.reply(countries);
});

bot.on('text', async (ctx) => {
  try {
    const userText = {
      country: ctx.message.text,
    };
  
    let data = {};
    data = await api.countries(userText);
    if (data.country === undefined) {
      ctx.reply(
        'Такой страны не существует, воспользуйтесь командой /help, для правильного ввода страны.'
      );
    } else {
      const formatData = `
    страна: ${data.country} 
    заражений всего: ${data.cases}
    заражений сегодня: ${data.todayCases}
    смертей всего: ${data.deaths}
    смертей сегодня: ${data.todayDeaths}
    выздоровело всего: ${data.recovered}
    выздоровело сегодня: ${data.todayRecovered}
    флаг страны: ${data.countryInfo.flag}
        `;
      ctx.reply(formatData);
    }
  } catch {
    ctx.reply('Такой команды не существует')
  }
});

bot.launch();
