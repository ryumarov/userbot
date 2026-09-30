const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram/tl");
const input = require("input");

// API Ma'lumotlari
const apiId = 32945158;
const apiHash = "732d5426af5af558f60f03b6829edb6d";

// Dastlabki ishga tushirishda bo'sh turadi. Logindan so'ng string chiqqach shu yerga qo'yiladi.
const stringSession = new StringSession("1BQANOTEuMTA4LjU2LjEzMQG7Az6OF4kvbGGniaWErrIQyrll8QOfVYNQSzR1EDs1S0wg/LUuDhLr8uOmnwYR+us9k5h7Nz7gPMkxCH40sf+RhzgqngXBvgevNgooiox9fBRLD5vTpzXYcbe2s3v7f9f47aYTU/JiUQI6NTYPK3EYsc7sYq94oT/TVDCb2fKFBLYGOhV/M5VJEUAcoXeRPX0cnDvcA1aj+bJvDKyJzYgFIgWde0T1GPf/B2VEC9lOj23qUTtLvQSvEcVj9PrLRkZpVMCNjTbWsGejRtGM9ZbJZt9gz02A4COrdCbPAn8xDCOhe+xMUlhhlAOPzkazuGuXtCY4v99kKNDxGk08FtUrAw==");

const CHAT_IDS = [-876863896, 8869891925];

const ACTIONS = [
  new Api.SendMessageTypingAction(),
  new Api.SendMessageRecordAudioAction(),
  new Api.SendMessageRecordRoundAction(),
  new Api.SendMessageUploadVideoAction({ progress: 0 }),
];

(async () => {
  console.log("[+] Telegramga ulanmoqda...");

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  // Birinchi marta telefon raqam va kod so'raydi
  await client.start({
    phoneNumber: async () => await input.text("Telefon raqamingiz (+998...): "),
    password: async () => await input.text("2-bosqichli parol (agar bo'lsa): "),
    phoneCode: async () => await input.text("Telegramga kelgan kod: "),
    onError: (err) => console.log(err),
  });

  console.log("[+] Muvaffaqiyatli kirildi!");
  
  // Bulutli serverlarga joylash uchun Session stringini konsolga chiqaradi
  console.log("\n=== SIZNING SESSION STRINGINGIZ (Saqlab qo'ying) ===");
  console.log(client.session.save());
  console.log("===================================================\n");

  // Har 2 soniyada navbatma-navbat action yuborish
  while (true) {
    for (const actionObj of ACTIONS) {
      for (const chatId of CHAT_IDS) {
        try {
          await client.invoke(
            new Api.messages.SetTyping({
              peer: chatId,
              action: actionObj,
            })
          );
        } catch (err) {
          // Xatoliklarni jim o'tkazib yuborish
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
})();