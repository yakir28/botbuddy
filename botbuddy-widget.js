(function(){
  let businessId = null;

  function init(config) {
    businessId = config.businessId || "default-business-id";

    createWidget(businessId);
  }

  function createWidget(businessId) {
    const chatUrl = `https://botbuddy-new.bubbleapps.io/embed_chat?business=${encodeURIComponent(businessId)}`;

    const chatButton = document.createElement("button");
    chatButton.innerHTML = "💬";
    Object.assign(chatButton.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "#5454D4",
      color: "#fff",
      fontSize: "24px",
      border: "none",
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      cursor: "pointer",
      zIndex: "9999",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
    });

    const chatIframe = document.createElement("iframe");
    chatIframe.src = chatUrl;
    Object.assign(chatIframe.style, {
      position: "fixed",
      bottom: "90px",
      right: "20px",
      width: "360px",
      height: "520px",
      border: "none",
      borderRadius: "12px",
      display: "none",
      zIndex: "9999",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
      backgroundColor: "#fff",
    });

    chatButton.addEventListener("click", () => {
      chatIframe.style.display = chatIframe.style.display === "none" ? "block" : "none";
    });

    document.body.appendChild(chatButton);
    document.body.appendChild(chatIframe);
  }

  window.botbuddy = window.botbuddy || function() {
    (window.botbuddy.q = window.botbuddy.q || []).push(arguments);
  };

  if(window.botbuddy.q) {
    for(let i=0; i<window.botbuddy.q.length; i++) {
      const args = window.botbuddy.q[i];
      if(args[0] === "init" && args[1]) {
        init(args[1]);
      }
    }
  }

  window.botbuddy = new Proxy(window.botbuddy, {
    apply(target, thisArg, args) {
      if(args[0] === "init" && args[1]) {
        init(args[1]);
      }
      return target(...args);
    }
  });
})();
