import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.onText(/\/gpt (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci/jobs",
      {
        prompt: input,
        max_tokens: 100,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    bot.sendMessage(chatId, response.data.choices[0].text);
  } catch (error) {
    bot.sendMessage(chatId, "Ocorreu um erro ao processar sua requisição");
  }
});
