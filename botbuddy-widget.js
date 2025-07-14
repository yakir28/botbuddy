(function () {
  let businessId = null;
  let botId = null;
  let initialized = false;

  function init(config) {
    if (initialized) return;
    initialized = true;

    businessId = config.businessId;
    botId = config.botId;

    if (!businessId || !botId) {
      console.error("❌ Missing businessId or botId in config.");
      return;
    }

    createWidget(businessId, botId);
  }

  async function createWidget(businessId, botId) {
    const businessApiUrl = `https://botbuddy-new.bubbleapps.io/api/1.1/obj/business/${businessId}`;
    const botApiUrl = `https://botbuddy-new.bubbleapps.io/api/1.1/obj/bot/${botId}`;

    try {
      console.log("🌐 Fetching business info:", businessApiUrl);
      const [businessRes, botRes] = await Promise.all([
        fetch(businessApiUrl).then(res => res.json()),
        fetch(botApiUrl).then(res => res.json()),
      ]);

      if (!businessRes.response || !botRes.response) {
        console.error("❌ Invalid business or bot data:", businessRes, botRes);
        return;
      }

      const bot = botRes.response;
      const chatUrl = `https://botbuddy-new.bubbleapps.io/embed_chat?business=${encodeURIComponent(businessId)}`;

      // Button style from bot config
      const buttonColor = bot.color || "#5454D4";
      const textColor = bot.textColor || "#ffffff";
      let position = bot.position || "bottom-right";

      const posStyles = {
        "bottom-right": { bottom: "20px", right: "20px" },
        "bottom-left": { bottom: "20px", left: "20px" },
        "top-right": { top: "20px", right: "20px" },
        "top-left": { top: "20px", left: "20px" },
      };

      // Override position on mobile to bottom-right 5px
      let buttonPos;
      if (window.innerWidth <= 768) {
        position = "bottom-right";
        buttonPos = { bottom: "5px", right: "5px" };
      } else {
        buttonPos = posStyles[position] || posStyles["bottom-right"];
      }

      // Create chat button
      const chatButton = document.createElement("button");
      Object.assign(chatButton.style, {
        position: "fixed",
        backgroundColor: buttonColor,
        color: textColor,
        border: "none",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        cursor: "pointer",
        zIndex: "9999",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0",
        ...buttonPos,
      });

      // Add SVG icon to button
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", "28");
      svg.setAttribute("height", "28");
      svg.setAttribute("fill", "currentColor");
      svg.setAttribute("viewBox", "0 0 16 16");

      const path1 = document.createElementNS(svgNS, "path");
      path1.setAttribute("d", "M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z");
      const path2 = document.createElementNS(svgNS, "path");
      path2.setAttribute("d", "M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0");

      svg.appendChild(path1);
      svg.appendChild(path2);
      chatButton.appendChild(svg);

      // Create iframe
      const chatIframe = document.createElement("iframe");
      chatIframe.src = chatUrl;
      Object.assign(chatIframe.style, {
        position: "fixed",
        width: "365px",
        height: "600px",
        padding:0;
        border: "none",
        overflow: "hidden",
        borderRadius: "12px",
        display: "none",
        zIndex: "9999",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
      ...buttonPos,             
        bottom: buttonPos.bottom ? `calc(${buttonPos.bottom} + 70px)` : undefined,
        top: buttonPos.top ? `calc(${buttonPos.top} + 70px)` : undefined,
      });
      

      chatButton.addEventListener("click", () => {
        chatIframe.style.display =
          chatIframe.style.display === "none" ? "block" : "none";
      });

      document.body.appendChild(chatButton);
      document.body.appendChild(chatIframe);
    } catch (err) {
      console.error("❌ Error fetching widget data:", err);
    }
  }

  // Define global function queue
  window.botbuddy =
    window.botbuddy ||
    function () {
      (window.botbuddy.q = window.botbuddy.q || []).push(arguments);
    };

  // Process queued calls
  if (window.botbuddy.q) {
    for (let i = 0; i < window.botbuddy.q.length; i++) {
      const args = window.botbuddy.q[i];
      if (args[0] === "init" && args[1]) {
        init(args[1]);
      }
    }
  }

  // Add Proxy for future direct function calls
  window.botbuddy = new Proxy(window.botbuddy, {
    apply(target, thisArg, args) {
      if (args[0] === "init" && args[1]) {
        init(args[1]);
      } else if (args[0] === "getState") {
        return initialized ? "initialized" : "not_initialized";
      }
      return target(...args);
    },
  });
})();
