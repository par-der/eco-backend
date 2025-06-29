import os, requests, json

TOKEN = os.environ["TG_BOT_TOKEN"]
API   = f"https://api.telegram.org/bot{TOKEN}"

btn = {
    "type": "web_app",
    "text": "🌍 Экология Москвы",
    "web_app": {"url": "https://dab8-138-124-99-150.ngrok-free.app/webapp/"}
}

requests.post(f"{API}/sendMessage", json={
    "chat_id": "akinoqqe",
    "text": "Откройте мини-приложение:",
    "reply_markup": {
        "inline_keyboard": [[
            {"text": "🌍 Экология Москвы",
             "web_app": {"url": "https://dab8-138-124-99-150.ngrok-free.app/"}}
        ]]
    }
})

r = requests.post(f"{API}/setChatMenuButton", json={"menu_button": btn})
print("setChatMenuButton:", r.json())
print("getChatMenuButton :", requests.get(f"{API}/getChatMenuButton").json())
