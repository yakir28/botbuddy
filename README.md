# 🤖 BotBuddy Chat Widget

BotBuddy is a lightweight embeddable chat widget that allows businesses to add a chatbot to their website with a single line of code. The chatbot is powered by Bubble and dynamically loads the business information from your database using a `businessId`.

---

## 🚀 Features

- Lightweight and easy to embed
- Automatically fetches business data from your Bubble app
- Stylish chat button with toggle behavior
- Fully responsive iframe widget
- Hosted via CDN (JSDelivr)

---

## 📦 Installation

To embed the widget on any website, simply copy and paste the following code into your HTML, just before the closing `</body>` tag:

```html
<script>
  (function(businessId){
    if(window.botbuddy && window.botbuddy("getState") === "initialized") return;
    window.botbuddy = function() {
      (window.botbuddy.q = window.botbuddy.q || []).push(arguments);
    };
    window.botbuddy("init", { businessId });

    function onLoad() {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/yakir28/botbuddy@main/botbuddy-widget.js";
      script.id = "botbuddy-widget-script";
      document.body.appendChild(script);
    }

    if(document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
  })("YOUR_BUSINESS_ID_HERE");
</script>
