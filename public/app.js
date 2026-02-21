async function loadMessages() {
  try {
    const res = await fetch("/messages");
    const messages = await res.json();

    const container = document.getElementById("messages");
    container.innerHTML = "";

    messages.forEach(msg => {
      const div = document.createElement("div");
      div.className = "message";

      div.innerHTML = `
        <p><strong>${msg.username}</strong></p>
        <img src="${msg.url}" width="200" />
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Load error:", err);
  }
}

async function sendMessage() {
  const username = document.getElementById("username").value;
  const url = document.getElementById("url").value;

  if (!username || !url) {
    alert("Enter name and GIF URL");
    return;
  }

  try {
    await fetch("/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        type: "gif",
        url
      })
    });

    document.getElementById("url").value = "";
    loadMessages();
  } catch (err) {
    console.error("Send error:", err);
  }
}

document.getElementById("sendBtn").addEventListener("click", sendMessage);

loadMessages();


