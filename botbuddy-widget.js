(function () {
  let businessId = null;

  function init(config) {
    businessId = config.businessId;

    // Fetch the business object including its linked bot
    const apiUrl = `https://botbuddy-new.bubbleapps.io/api/1.1/obj/business/${businessId}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const business = data.response;
        if (!business || !business.bot) {
          throw new Error("Bot not found for business");
        }

        const bot = business.bot;

        const botId = bot._id;
        const buttonColor = bot.color || "#5454D4";
        const textColor = bot.text_color || "#ffffff";
        const position = bot.position || "bottom-right";

        createWidget({ businessId, botId, buttonColor, textColor, position });
      })
      .catch((err) => {
        console.error("Failed to fetch bot config:", err);
        // fallback widget with default styles and no botId
        createWidget({ businessId });
      });
  }

  function createWidget({
    businessId,
    botId = null,
    buttonColor = "#5454D4",
    textColor = "#ffffff",
    position = "bottom-right",
  }) {
    const chatParam = botId || businessId;
    const chatUrl = `https://botbuddy-new.bubbleapps.io/embed_chat?bot=${encodeURIComponent(chatParam)}`;

    const positionStyles = {
      "top-left": { top: "20px", left: "20px" },
      "top-right": { top: "20px", right: "20px" },
      "bottom-left": { bottom: "20px", left: "20px" },
      "bottom-right": { bottom: "20px", right: "20px" },
    };

    const pos = positionStyles[position] || positionStyles["bottom-right"];

    const chatButton = document.createElement("button");
    chatButton.innerHTML = "💬";
    Object.assign(chatButton.style, {
      position: "fixed",
      backgroundColor: buttonColor,
      color: textColor,
      fontSize: "24px",
      border: "none",
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      cursor: "pointer",
      zIndex: "9999",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
      ...pos,
    });

    const chatIframe = document.createElement("iframe");
    chatIframe.src = chatUrl;
    Object.assign(chatIframe.style, {
      position: "fixed",
      width: "360px",
      height: "520px",
      border: "none",
      borderRadius: "12px",
      display: "none",
      zIndex: "9999",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
      ...pos,
    });

    chatButton.addEventListener("click", () => {
      chatIframe.style.display =
        chatIframe.style.display === "none" ? "block" : "none";
    });

    document.body.appendChild(chatButton);
    document.body.appendChild(chatIframe);
  }

  window.botbuddy =
    window.botbuddy ||
    function () {
      (window.botbuddy.q = window.botbuddy.q || []).push(arguments);
    };

  if (window.botbuddy.q) {
    for (let i = 0; i < window.botbuddy.q.length; i++) {
      const args = window.botbuddy.q[i];
      if (args[0] === "init" && args[1]) {
        init(args[1]);
      }
    }
  }

  window.botbuddy = new Proxy(window.botbuddy, {
    apply(target, thisArg, args) {
      if (args[0] === "init" && args[1]) {
        init(args[1]);
      }
      return target(...args);
    },
  });
})();
