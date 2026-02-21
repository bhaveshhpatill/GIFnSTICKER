let currentUser = null;
const socket = io();

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  alert(data.message);
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.token) {
    currentUser = data.username;
    document.getElementById("authSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
    document.getElementById("welcome").innerText = "Welcome " + currentUser;
    loadPosts();
  } else {
    alert(data.message);
  }
}

async function uploadPost() {
  const file = document.getElementById("imageInput").files[0];
  const caption = document.getElementById("caption").value;

  const reader = new FileReader();
  reader.onload = async function () {
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: currentUser,
        caption,
        image: reader.result
      })
    });
    loadPosts();
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

async function loadPosts() {
  const res = await fetch("/api/posts");
  const posts = await res.json();

  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach(p => {
    feed.innerHTML += `
      <div class="post">
        <h4>${p.username}</h4>
        <img src="${p.image}">
        <p>${p.caption}</p>
        <a href="${p.image}" download>Download</a>
      </div>
    `;
  });
}

function sendMessage() {
  const msg = document.getElementById("chatMsg").value;
  socket.emit("sendMessage", currentUser + ": " + msg);
}

socket.on("receiveMessage", msg => {
  const div = document.createElement("div");
  div.textContent = msg;
  document.getElementById("chatBox").appendChild(div);
});

