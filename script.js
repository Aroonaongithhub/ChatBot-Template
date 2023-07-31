

/* These lines of code are using the `document.querySelector()` method to select specific elements from
the HTML document and assign them to variables. */
const ChatInput=document.querySelector(".user-input textarea");
const ChatBtn=document.querySelector(".user-input span");
const ChatBox=document.querySelector(".chat-box");
const ToggleChatBot=document.querySelector(".chatbot-toggle");
const ChatBotCloseBtn=document.querySelector(".close-btn");


let UserMessage;
const API_Key="";

/* The line `const InputHeight=ChatInput.scrollHeight;` is calculating the height of the `ChatInput`
textarea element based on its content. */
const InputHeight=ChatInput.scrollHeight;

/**
 * The function "CreateChatList" creates a chat list item with a message and a specified class name.
 * @param message - The `message` parameter is the content of the chat message that will be displayed
 * in the chat list. It can be a string containing any text or information that you want to display in
 * the chat.
 * @param ClassName - The ClassName parameter is a string that represents the class name to be added to
 * the created chat list item. It can be either "Outgoing" or any other class name you want to assign.
 * @returns a newly created chat list element (li) with the passed message and class name.
 */
const CreateChatList = (message,ClassName) => {
   const ChatList=document.createElement("li");
   ChatList.classList.add("Chat",ClassName);
   let ChatContent = ClassName === "Outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`
   ChatList.innerHTML = ChatContent;
   ChatList.querySelector("p").textContent = message;
   return ChatList;
}

/**
 * The function `GenerateResponse` sends a POST request to the OpenAI API to generate a response based
 * on the incoming chat list, and updates the message element with the generated response.
 * @param IncomingChatList - IncomingChatList is a DOM element that represents the chat list container.
 * It is used to find the message element within the container and update its content with the response
 * from the API.
 */
const GenerateResponse = (IncomingChatList) => {
    const API_URL="https://api.openai.com/v1/chat/completions";
    const messageElement = IncomingChatList.querySelector("p");
    // Define the Properties and message for the API request
    const RequestOptions = {
        method:"POST",
        Headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_Key}`
        },
        body: JSON.stringify({
            model:"gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: UserMessage
              }
            ]
        })
    };
// Send POSt request to API, get response
/* The code is making a POST request to the
   specified API URL with the provided request options. */
    fetch(API_URL,RequestOptions).then(response => response.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch(error => {
        messageElement.textContent = "Try again";
        messageElement.classList.add("error");
    }).finally(() => ChatBox.scrollTo(0, ChatBox.scrollHeight));
}

/**
 * The HandleChat function handles user input in a chat interface, sends the user message to the
 * chatbot, and displays a "Thinking.." message while waiting for a response.
 * @returns In the code snippet provided, the function `HandleChat` does not have an explicit return
 * statement. Therefore, it will implicitly return `undefined`.
 */
const HandleChat = () =>{
    UserMessage =ChatInput.value.trim();
    if(!UserMessage) return;
    ChatInput.value = "";
    ChatInput.computedStyleMap.height= `${InputHeight}px`;

    // Append the user message to the chatbot
    ChatBox.appendChild( CreateChatList(UserMessage,"Outgoing"));

    ChatBox.scrollTo(0, ChatBox.scrollHeight);
     // displaying thinking message while waiting for response
    setTimeout(() => {       
        const IncomingChatList = CreateChatList("Thinking..","Incoming");
        ChatBox.appendChild( IncomingChatList);
        ChatBox.scrollTo(0, ChatBox.scrollHeight);
        GenerateResponse(IncomingChatList);
    },600);
}

// Adjust the height of the textarea based on its content
/* The code `ChatInput.addEventListener("input", () =>{ ... })` adds an event listener to the
`ChatInput` element for the "input" event. */
ChatInput.addEventListener("input", () =>{
    ChatInput.computedStyleMap.height= `${InputHeight}px`;
    ChatInput.computedStyleMap.height= `${ChatInput.scrollHeight}px`;
});

/* The code `ChatInput.addEventListener("keydown", (e) =>{ ... })` adds an event listener to the
`ChatInput` element for the "keydown" event. */
// if Enter key is pressed without shift key and the window 
// width is greater than 800px , handle the chat
ChatInput.addEventListener("keydown", (e) =>{
    if(e.key === "Enter" && e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        HandleChat();   
    }
});

/* These lines of code are adding event listeners to certain elements in the HTML document. */
ChatBtn.addEventListener("click", HandleChat);
ChatBotCloseBtn.addEventListener('click', () => document.body.classList.remove("show-container"));
ToggleChatBot.addEventListener('click', () => document.body.classList.toggle("show-container"));
