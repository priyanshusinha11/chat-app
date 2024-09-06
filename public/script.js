const socket = io();
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const usernameInput = document.getElementById("username");
const allMessages = document.getElementById("messages");

// Handle receiving messages
socket.on("message", (data) => {
    const p = document.createElement("p");
    const info = document.createElement("div");
    info.classList.add("message-info");
    info.innerText = `${data.username} @ ${data.time}`;
    p.innerText = data.message;

    allMessages.appendChild(info);
    allMessages.appendChild(p);

    // Auto-scroll to the bottom
    allMessages.scrollTop = allMessages.scrollHeight;
});

// Send message to server on button click
sendBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();

    if (message && username) {
        socket.emit("user-message", { username, message });
        messageInput.value = ""; // Clear input after sending
    } else {
        alert("Username and message cannot be empty");
    }
});

// Send message when pressing 'Enter' key
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});
