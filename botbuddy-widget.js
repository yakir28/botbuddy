(function () {
  let businessId = null;
  let initialized = false;

  function init(config) {
    if (initialized) return;
    initialized = true;

    businessId = config.businessId || "default-business-id";
    createWidget(businessId);
  }

  function createWidget(businessId) {
    const businessApiUrl = `https://botbuddy-new.bubbleapps.io/api/1.1/obj/business/${businessId}`;

    console.log("🌐 Fetching business info:", businessApiUrl);

    fetch(businessApiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!data.response || !data.response._id) {
          console.error("❌ Business not found or invalid response:", data);
          return;
        }

        console.log("✅ Business loaded:", data.response);

        const chatUrl = `https://botbuddy-new.bubbleapps.io/embed_chat?business=${encodeURIComponent(businessId)}`;

        // Create chat button
        const chatButton = document.createElement("button");
        Object.assign(chatButton.style, {
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#5454D4",
          color: "#fff",
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
        });

        // Add SVG icon to button
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "28");
        svg.setAttribute("height", "28");
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("viewBox", "0 0 16 16");

        const path1 = document.createElementNS(svgNS, "path");
        path1.setAttribute(
          "d",
          "M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
        );
        const path2 = document.createElementNS(svgNS, "path");
        path2.setAttribute(
          "d",
          "M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
        );

        svg.appendChild(path1);
        svg.appendChild(path2);
        chatButton.appendChild(svg);

        // Create iframe
        const chatIframe = document.createElement("iframe");
        chatIframe.src = chatUrl;
        Object.assign(chatIframe.style, {
          position: "fixed",
          bottom: "90px",
          right: "20px",
          width: "360px",
          height: "650px",
          border: "none",
          borderRadius: "12px",
          display: "none",
          zIndex: "9999",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#fff",
        });

        // Toggle iframe
        chatButton.addEventListener("click", () => {
          chatIframe.style.display =
            chatIframe.style.display === "none" ? "block" : "none";
        });

        document.body.appendChild(chatButton);
        document.body.appendChild(chatIframe);
      })
      .catch((err) => {
        console.error("❌ Error fetching business data:", err);
      });
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
