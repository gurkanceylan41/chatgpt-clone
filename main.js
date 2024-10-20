//! HTML'den gelenler
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const defaultText = document.querySelector(".default-text");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
// Gönderdiğimiz html ve class ismine göre bize bir html oluşturur
const createElement = (html, className) => {
  // Yeni bir div oluştur
  const chatDiv = document.createElement("div");
  // Bu oluşturdugumuz div'e dışarıdan parametre olarak gelen class'ı ver
  chatDiv.classList.add("chat", className);
  // Oluşturdugumuz div'in içerisine dışarıdan parametre olarak gelen html parametresini ekle
  chatDiv.innerHTML = html;

  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  const pElement = document.createElement("p");

  //* 1. adım url tanımla
  const url = "https://chatgpt-42.p.rapidapi.com/geminipro";

  //* 2. adım option tanımla
  const options = {
    method: "POST",
    headers: {},
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `${userText}`,
        },
      ],
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    }),
  };
  //* 3. adım API'ye istek at
  try {
    const response = await fetch(url, options);
    const result = await response.json();

    pElement.innerHTML = result.result;
    console.log(pElement);
  } catch (error) {
    console.log(error);
  }
  console.log(incomingChatDiv);
  incomingChatDiv.querySelector(".typing-animation").remove();
  const detailDiv = incomingChatDiv
    .querySelector(".chat-details")
    .appendChild(pElement);
  chatInput.value = null;
};

const showTypingAnimation = () => {
  const html = `    
    <div class="chat-content">
    <div class="chat-details">
            <img src="./images/chatbot.jpg" alt="" />
        <div class="typing-animation">
            <div class="typing-dot" style="--delay: 0.2s"></div>
            <div class="typing-dot" style="--delay: 0.3s"></div>
            <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
    </div>`;

  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  getChatResponse(incomingChatDiv);
};

const handleOutGoingChat = () => {
  // Inputun içerisindeki değeri al ve fazladan bulunan boşlukları sil.
  userText = chatInput.value.trim();

  //inputun içerisinde veri yoksa fonksiyonu burada durdur
  if (!userText) {
    alert("Bir veri giriniz");
    return;
  }

  const html = `
<div class="chat-content">
          <div class="chat-details">
            <img src="./images/user.jpg" alt="" />
            <p></p>
          </div>
        </div>`;

  // Kullanıcının mesajını içeren bir div oluştur ve bunu chatContainer yapısına ekle.
  const outgoingChatDiv = createElement(html, "outgoing");
  defaultText.remove();
  outgoingChatDiv.querySelector("p").textContent = userText;
  chatContainer.appendChild(outgoingChatDiv);
  setTimeout(showTypingAnimation, 500);
};

//! Olay izleyicileri
sendButton.addEventListener("click", handleOutGoingChat);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleOutGoingChat();
  }
});

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteButton.addEventListener("click", () => {
  if (confirm("Tüm sohbetleri silmek istediğinize emin misiniz? ")) {
    chatContainer.remove();
  }
  const defaultText = `
    <div class="default-text">
        <h1>ChatGPT Clone</h1>
    </div>
    <div class="chat-container"></div>
    <div class="typing-container">
        <div class="typing-content">
            <div class="typing-textarea">
                <textarea
                id="chat-input"
                placeholder="Aratmak istediğiniz veriyi giriniz..."
                ></textarea>
                <span class="material-symbols-outlined" id="send-btn"> send </span>
            </div>
            <div class="typing-controls">
                <span class="material-symbols-outlined" id="theme-btn">
                light_mode
                </span>
                <span class="material-symbols-outlined" id="delete-btn">
                delete
                </span>
            </div>
        </div>
    </div>
  `;
  document.body.innerHTML = defaultText;
});
