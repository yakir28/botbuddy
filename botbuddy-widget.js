(function () {
  function init(config) {
    console.log("🟣 BotBuddy init called with config:", config);

    const businessId = config.businessId || null;
    const botId = config.botId || null;

    if (businessId && botId) {
      console.log("Using provided businessId and botId directly.");
      createWidget({ businessId, botId });
      return;
    }

    if (botId) {
      const botApiUrl = `https://botbuddy-new.bubbleapps.io/api/1.1/obj/bot/${botId}`;
      console.log("Fetching bot from:", botApiUrl);

      fetch(botApiUrl)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const bot = data.response;
          const businessId = typeof bot.business === "object" ? bot.business._id : bot.business;
          createWidget({
            businessId,
            botId,
            buttonColor: bot.button_color || "#5454D4",
            textColor: bot.text_color || "#ffffff",
            position: bot.position || "bottom-right",
          });
        })
        .catch((err) => {
          console.error("❌ Error fetching bot:", err);
        });
    } else if (businessId) {
      const businessApiUrl = `https://botbuddy-new.bubbleapps.io/api/1.1/obj/business/${businessId}`;
      console.log("Fetching business from:", businessApiUrl);

      fetch(businessApiUrl)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const business = data.response;
          const botId = typeof business.bot === "object" ? business.bot._id : business.bot;
          createWidget({
            businessId,
            botId,
            buttonColor: business.color || "#5454D4",
            textColor: business.text_color || "#ffffff",
            position: business.position || "bottom-right",
          });
        })
        .catch((err) => {
          console.error("❌ Error fetching business:", err);
        });
    } else {
      console.error("❌ You must provide either botId or businessId");
    }
  }

  function createWidget({
    businessId,
    botId = null,
    buttonColor = "#5454D4",
    textColor = "#ffffff",
    position = "bottom-right",
  }) {
    const chatUrl = `https://botbuddy-new.bubbleapps.io/embed_chat?business=${encodeURIComponent(businessId)}`;
    console.log("🧩 Creating widget with chat URL:", chatUrl);

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

  // preload queue (for early calls)
  window.botbuddy =
    window.botbuddy ||
    function () {
      (window.botbuddy.q = window.botbuddy.q || []).push(arguments);
    };

  // process preload
  if (window.botbuddy.q) {
    for (const args of window.botbuddy.q) {
      if (args[0] === "init" && args[1]) {
        init(args[1]);
      }
    }
  }

  // live support
  window.botbuddy = new Proxy(window.botbuddy, {
    apply(_, __, args) {
      if (args[0] === "init" && args[1]) {
        init(args[1]);
      }
    },
  });

  console.log("✅ BotBuddy widget script loaded");
})();
