// Emoji Data
const EMOJIS = [
  { char: "🎨", category: "art", name: "artist palette" },
  { char: "🏖️", category: "travel", name: "beach" },
  { char: "🚀", category: "tech", name: "rocket" },
  { char: "🥑", category: "food", name: "avocado" },
  { char: "📅", category: "objects", name: "calendar" },
  { char: "🍕", category: "food", name: "pizza" },
  { char: "🎸", category: "art", name: "guitar" },
  { char: "🍎", category: "food", name: "apple" },
  { char: "🖌️", category: "art", name: "paintbrush" },
  { char: "📷", category: "tech", name: "camera" },
  { char: "✈️", category: "travel", name: "airplane" },
  { char: "🏰", category: "travel", name: "castle" },
  { char: "📱", category: "tech", name: "smartphone" },
  { char: "🛍️", category: "objects", name: "shopping bag" },
  { char: "🍔", category: "food", name: "burger" }
];

// Elements
const deck = document.querySelector('.emoji-deck');
const placeholders = document.querySelectorAll('.placeholder');
const homeworkBtn = document.querySelector('.homework-btn');
const searchInput = document.querySelector('.search-bar');
const categoryButtons = document.querySelectorAll('.cat-btn');
const addButtons = document.querySelectorAll('.add-btn');
const timeDisplay = document.querySelector('.time-display');

// State
let draggedEmoji = null;
let currentCategory = 'all';
let filteredEmojis = EMOJIS.slice();

// Display Emojis
function displayEmojis() {
  deck.innerHTML = '';
  filteredEmojis.forEach(e => {
    const span = document.createElement('span');
    span.classList.add('emoji-item');
    span.textContent = e.char;
    span.setAttribute('aria-label', e.name);
    span.setAttribute('tabindex', '0');
    span.addEventListener('touchstart', onTouchStart);
    deck.appendChild(span);
  });
}

// Filter Emojis
function filterEmojis() {
  const searchTerm = searchInput.value.toLowerCase();
  filteredEmojis = EMOJIS.filter(e => {
    const matchesCategory = currentCategory === 'all' || e.category === currentCategory;
    const matchesSearch = e.name.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
  displayEmojis();
}

// Category Buttons
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentCategory = btn.dataset.category;
    filterEmojis();
  });
});

// Search Input
searchInput.addEventListener('input', filterEmojis);

// Drag Handling
function onTouchStart(e) {
  const target = e.target;
  if (!target.classList.contains('emoji-item')) return;

  // Haptic feedback start
  if (navigator.vibrate) navigator.vibrate(10);

  draggedEmoji = target.cloneNode(true);
  draggedEmoji.classList.add('dragging');
  document.body.appendChild(draggedEmoji);

  const initialTouch = e.touches[0];

  const moveAt = (pageX, pageY) => {
    draggedEmoji.style.left = `${pageX - draggedEmoji.offsetWidth / 2}px`;
    draggedEmoji.style.top = `${pageY - draggedEmoji.offsetHeight / 2}px`;
  };
  
  moveAt(initialTouch.pageX, initialTouch.pageY);

  const touchMoveHandler = (event) => {
    const touch = event.touches[0];
    moveAt(touch.pageX, touch.pageY);
    checkMagnetEffect(touch);
  };

  const touchEndHandler = (event) => {
    dropEmoji(event);
    draggedEmoji.remove();
    draggedEmoji = null;
    document.removeEventListener('touchmove', touchMoveHandler);
    document.removeEventListener('touchend', touchEndHandler);
  };

  document.addEventListener('touchmove', touchMoveHandler, {passive: false});
  document.addEventListener('touchend', touchEndHandler, {passive: false});
}

// Check Magnet Effect
function checkMagnetEffect(touch) {
  let magnetDetected = false;
  placeholders.forEach(placeholder => {
    const rect = placeholder.getBoundingClientRect();
    const distance = Math.hypot(
      touch.clientX - (rect.left + rect.width / 2),
      touch.clientY - (rect.top + rect.height / 2)
    );
    if (distance < 80) {
      placeholder.classList.add('highlight');
      draggedEmoji.classList.add('magnet');
      magnetDetected = true;
    } else {
      placeholder.classList.remove('highlight');
    }
  });
  if (!magnetDetected) {
    draggedEmoji.classList.remove('magnet');
  }
}

// Drop Emoji
function dropEmoji(event) {
  // Haptic feedback end
  if (navigator.vibrate) navigator.vibrate(20);

  const touch = event.changedTouches[0];
  let dropped = false;
  placeholders.forEach(placeholder => {
    const rect = placeholder.getBoundingClientRect();
    const distance = Math.hypot(
      touch.clientX - (rect.left + rect.width / 2),
      touch.clientY - (rect.top + rect.height / 2)
    );
    if (distance < 80) {
      // Drop emoji here
      placeholder.classList.remove('highlight');
      placeholder.innerText = draggedEmoji.innerText;
      placeholder.classList.remove('empty');
      placeholder.setAttribute('aria-label', 'Contains emoji ' + draggedEmoji.innerText);
      dropped = true;
    } else {
      placeholder.classList.remove('highlight');
    }
  });

  // If not dropped on a placeholder, do nothing special (the draggedEmoji is removed anyway).
  // Could re-insert to deck, but as per instructions, just removing it is fine.
  if (!dropped) {
    // Optional: Could re-display emojis to ensure it returns, but instructions do not require it.
  }
}

// Homework Button Toggle
homeworkBtn.addEventListener('click', () => {
  homeworkBtn.classList.toggle('green');
  if (homeworkBtn.classList.contains('green')) {
    homeworkBtn.textContent = 'Homework 👍';
  } else {
    homeworkBtn.textContent = 'Homework';
  }
});

// Add New Placeholder
function addPlaceholderRow(btn) {
  const row = btn.parentElement;
  const newPlaceholder = document.createElement('div');
  newPlaceholder.classList.add('placeholder', 'empty');
  newPlaceholder.setAttribute('aria-label', 'Empty placeholder');
  newPlaceholder.setAttribute('tabindex', '0');
  row.insertBefore(newPlaceholder, btn);
  // Update placeholders NodeList
  // To ensure the dynamic placeholders also respond to magnet effect
  // We convert placeholders to an array each time or just re-query them
  // after adding a new placeholder.
}

addButtons.forEach(addBtn => {
  addBtn.addEventListener('click', () => {
    addPlaceholderRow(addBtn);
  });
});

// Time Display Update
function updateTime() {
  const now = new Date();
  timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();

// Initial Display
filterEmojis(); // This calls displayEmojis internally
