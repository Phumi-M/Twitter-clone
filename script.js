// --- Profile Dropdown Menu ---
function setupProfileDropdown() {
  const profileSection = document.getElementById("profileSection");
  const dropdown = document.getElementById("profileDropdown");

  if (!profileSection || !dropdown) return;

  // Toggle the dropdown when the profile section is clicked
  profileSection.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdown.classList.toggle("show");
  });

  // Close the dropdown if the user clicks anywhere else on the page
  window.addEventListener("click", () => {
    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }
  });
}


function formatNumbers() {
  const elements = document.querySelectorAll(
    ".post-actions .action-button small"
  );

  elements.forEach((element) => {
    let text = element.textContent.trim();
    let number = parseInt(text);

    if (isNaN(number) || number < 1000) {
      return;
    }

    if (number >= 1000000) {
      // Format as millions (M)
      element.textContent =
        (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (number >= 1000) {
      // Format as thousands (K)
      element.textContent = (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
  });
}

// Dark Mode Toggle 
function setupDarkMode() {
  const darkModeIcon = document.getElementById("darkModeIcon");
  if (!darkModeIcon) return;

  const body = document.body;

  // Function to update the icon based on the theme(this is a cursor feature added as one of my innovation)
  const updateIcon = () => {
    if (body.classList.contains("dark-mode")) {
      darkModeIcon.classList.remove("fa-moon");
      darkModeIcon.classList.add("fa-sun");
    } else {
      darkModeIcon.classList.remove("fa-sun");
      darkModeIcon.classList.add("fa-moon");
    }
  };

  updateIcon(); // Set the correct icon on page load

  darkModeIcon.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    updateIcon(); // Update the icon after toggling
  });
}

// --- Like Button Functionality ---
function setupLikeButtons() {
  const feed = document.querySelector(".feed");
  if (!feed) return;

  // Use event delegation to handle clicks on all like buttons
  feed.addEventListener("click", (event) => {
    const likeButton = event.target.closest(".action-button.like");

    if (!likeButton) {
      return; // Exit if the click was not on a like button
    }

    const heartIcon = likeButton.querySelector("i");
    const countElement = likeButton.querySelector("small");

    if (!heartIcon || !countElement) return;

    // Use a data attribute to store the full, unformatted like count
    let currentLikes = parseInt(likeButton.dataset.likes || countElement.textContent.replace(/,/g, ''));

    // Toggle the 'liked' state
    if (likeButton.classList.contains("liked")) {
      likeButton.classList.remove("liked");
      heartIcon.classList.remove("fas"); // Solid
      heartIcon.classList.add("far"); // Outline
      currentLikes--;
    } else {
      likeButton.classList.add("liked");
      heartIcon.classList.remove("far");
      heartIcon.classList.add("fas");
      currentLikes++;
    }

    // Update the data attribute and the visible text
    likeButton.dataset.likes = currentLikes;
    countElement.textContent = currentLikes.toLocaleString(); 
    formatNumbers(); 
  });
}

// AI Chatbot Functionality (This is a cursor feature added as one of my innovation)

// Function to load chatbot HTML and then set it up
async function loadAndSetupChatbot() {
  try {
    // Fetch the content of chatbot.html
    const response = await fetch("chatbot.html");
    if (!response.ok) {
      throw new Error("Network response was not ok for chatbot.html");
    }
    const chatbotHTML = await response.text();

    // Append the fetched HTML to the body
    document.body.insertAdjacentHTML("beforeend", chatbotHTML);

    // Now that the HTML is loaded, run the setup function
    setupChatbot();
  } catch (error) {
    console.error("Failed to load or setup chatbot:", error);
  }
}

function setupChatbot() {
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatWindow = document.getElementById("chatWindow");
  const closeChat = document.getElementById("closeChat");
  const chatBody = document.getElementById("chatBody");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");

  if (!chatbotToggle || !chatWindow || !closeChat || !chatBody || !chatForm) return;
  // Check if elements exist, if not, the loading failed.
  if (!chatbotToggle || !chatWindow) {
    console.error("Chatbot HTML elements not found in the DOM.");
    return;
  }

  const addMessage = (text, sender, hasSuggestion = false) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender);
    let messageText = text;
    if (hasSuggestion) {
      messageText += `<span class="suggestion">Share a fun South African fact</span>`;
    }
    messageElement.innerHTML = messageText;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to the latest message
  };

  chatbotToggle.addEventListener("click", () => {
    chatWindow.classList.toggle("show");
    // Add initial greeting if it's the first time opening
    if (chatWindow.classList.contains("show") && chatBody.children.length === 0) {
      setTimeout(() => {
        addMessage("Hey @PhumzilePr84368! What's on your mind tonight?", "bot", true);
      }, 300);
    }
  });

  closeChat.addEventListener("click", () => chatWindow.classList.remove("show"));

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, "user");
    chatInput.value = "";
    getBotResponse(userMessage);
  });

  // Handle clicks on suggestions
  chatBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion')) {
        const suggestionText = e.target.textContent;
        addMessage(suggestionText, "user");
        getBotResponse(suggestionText);
    }
  });

  const getBotResponse = (userInput) => {
    setTimeout(() => {
      let botMessage = "I'm still learning! Ask me to 'Share a fun South African fact'.";
      if (userInput.toLowerCase().includes("south african fact")) {
        botMessage = "South Africa has three capital cities: Pretoria (executive), Cape Town (legislative), and Bloemfontein (judicial).";
      }
      addMessage(botMessage, "bot");
    }, 800);
  };
}


// Run functions once the entire page is loaded
window.onload = () => {
  formatNumbers();
  setupDarkMode();
  setupProfileDropdown();
  setupLikeButtons();
  loadAndSetupChatbot(); // Load the HTML and then run the chatbot setup
};