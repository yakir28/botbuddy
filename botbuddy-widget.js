(function () {
  let businessId = null;

  // Fetch business by ID, then fetch bot by botId
  function init(config) {
    businessId = config.businessId;

    // Step 1: Fetch business object to get bot ID
    const businessApiUrl = `https://botbuddy-new.bubbleapps.io/api/1.1/obj/business/${businessId}`;

    fetch(businessApiUrl)
      .then((res) => res.json())
      .then((businessData) => {
        const business = businessData.response;
        if (!business || !business.bot) {
          throw new Error("No bot linked to this business");
        }
        const botId = business.bot._id || business.bot;

        // Step 2: Fetch bot config by bot ID
        const botApiUrl = `https://botbuddy-new.bubbleapps.io/api/1.1/obj/bot/${botId}`;

        return fetch(botApiUrl)
          .then((res) => res.json())
          .then((botData) => {
            const bot = botData.response;
            if (!bot) throw new Error("Bot not found");

            // Use bot config to create widget
            createWidget({
              businessId,
              botId,
              buttonColor: bot.color || "#5454D4",
              textColor: bot.text_color || "#ffffff",
              position: bot.position || "bottom-right",
            });
          });
      })
      .catch((err) => {
        console.error("Error fetching bot config:", err);
        createWidget({ businessId }); // fallback with default styling
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
