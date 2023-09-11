// export const serverURL = 'https://VUE_SERVER_URL'
// export const serverURL = 'https://VUE_CHAT_URL'
const serverURL = "https://api.tochka-remonta.site";
const chatURL = "https://chat.tochka-remonta.site";

const userProfileFullnessLimit = 80;
const makerProfileFullnessLimit = 80;

// const userProfileFullnessLimit = 10;
// const makerProfileFullnessLimit = 10;

const socialsArray = [
  {
    name: "WhatsApp",
    keywords: ["ватсап", "вотсап", "воцап", "watsap", "whatsapp"],
    imageName: "whatsapp_icon.png",
    hrefBuilder: (id) => (id.includes("wa.me") ? id : `https://wa.me/${id}`),
  },
  {
    name: "Одноклассники",
    keywords: ["одноклассники", "ок", "ok", "odnoklassniki", "odnoklasniki"],
    imageName: "ok.png",
    hrefBuilder: (id) => (id.includes("ok.ru") ? id : `https://ok.ru/${id}`)
  },
  {
    name: "Вконтакте",
    keywords: ["вк", "вконтакте", "vk", "vkontakte"],
    imageName: "vk_icon.png",
    hrefBuilder: (id) => (id?.includes("vk.com") ? id : `https://vk.com/${id}`),
  },
  {
    name: "Telegram",
    keywords: ["телега", "телеграм", "telegram", "тг"],
    imageName: "telegram_icon.png",
    hrefBuilder: (id) => (id.includes("t.me") ? id : `https://t.me/${id}`),
  },
  {
    name: "Instagram",
    keywords: ["инст", "инста", "инстаграм", "instagram"],
    imageName: "instagram_icon.png",
    hrefBuilder: (id) => (id.includes("instagram.com") ? id : `https://www.instagram.com/${id}`)
  },
];

export {
  serverURL,
  chatURL,
  socialsArray,
  userProfileFullnessLimit,
  makerProfileFullnessLimit
};
