/* ========================================
   ANIMATED STARS
======================================== */

const stars = document.querySelector("#stars");

let seed = 23;

const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

for (let i = 0; i < 125; i++) {
  const s = document.createElement("i");

  s.className = "star";

  const size = rand() * 1.7 + 0.6;

  s.style.cssText = `
    left: ${rand() * 100}%;
    top: ${rand() * 100}%;
    width: ${size}px;
    height: ${size}px;
    --speed: ${2 + rand() * 5}s;
    --delay: -${rand() * 6}s;
  `;

  stars.append(s);
}

/* ========================================
   PHOTO CAPTIONS AND PLACEHOLDERS
======================================== */

/* Our photographs */
const photos = [
  {
    src: "images/IMG_5435.JPG",
    caption: "Our first little adventure",
  },
  {
    src: "images/view.jpg",
    caption: "My favorite view",
  },
  {
    src: "images/keeps.JPG",
    caption: "A day worth keeping",
  },
  {
    src: "images/us.PNG",
    caption: "Just you and me",
  },
  {
    src: "images/magic.jpg",
    caption: "The ordinary, made magic",
  },
  {
    src: "images/memories.jpg",
    caption: "More memories to come",
  },
];

photos.forEach((photo, i) => {
  const button = document.createElement("button");
  button.className = "frame";
  button.setAttribute("aria-label", `View photo: ${photo.caption}`);

  const image = document.createElement("img");
  image.className = "gallery-photo";
  image.src = photo.src;
  image.alt = photo.caption;
  image.loading = "lazy";

  const number = document.createElement("small");
  number.textContent = `PHOTOGRAPH ${String(i + 1).padStart(2, "0")}`;

  const caption = document.createElement("span");
  caption.textContent = photo.caption;

  button.append(image, number, caption);

  button.onclick = () => {
    const fullPhoto = document.querySelector("#fullPhoto");

    fullPhoto.src = photo.src;
    fullPhoto.alt = photo.caption;

    document.querySelector("#photoTitle").textContent =
      photo.caption;

    document.querySelector("#photoDialog").showModal();
  };

  document.querySelector("#gallery").append(button);
});

/* ========================================
   LETTER TITLES
   Match these with the titles in index.html.
======================================== */

const titles = [
  "To my favorite person",
  "For the days you need a little love",
  "To all our tomorrows",
];

/* ========================================
   LETTER CONTENTS
   Replace the bracketed text with your letters.
======================================== */

const defaults = {
  letter1:
    "No matter where life takes us or how things turn out, you'll always be someone SO EXTRA SPECIAL to me. Thank you for being part of my life and my universe.",

  letter2:
    "I hope you remember that you are loved, even on the days when you don't feel like you are. You're doing better than you think, and I'm proud of you for making it through each day, even on the difficult ones.",

  letter3:
    "Whatever the future holds. I hope it brings us more reasons to smile, more memories to make, and more chances to know, understand, and love each other. I know we can't change yesterday, but we can always choose what we do with tomorrow. I love you.",
};

/* Read memories, closing message, and name from index.html. */
document.querySelectorAll(".editable").forEach((el) => {
  defaults[el.dataset.key] = el.textContent;
});

/* ========================================
   LOAD SAVED BROWSER DRAFTS
======================================== */

let saved = {};

try {
  saved = JSON.parse(
    localStorage.getItem("our-universe-drafts") || "{}"
  );
} catch {
  // Continue with the default content if storage cannot be read.
}

const values = {
  ...defaults,
  ...saved,
};

function render() {
  document.querySelectorAll(".editable").forEach((el) => {
    el.textContent =
      typeof values[el.dataset.key] === "string"
        ? values[el.dataset.key]
        : defaults[el.dataset.key];
  });
}

render();

/* ========================================
   OPEN LETTERS
======================================== */

document.querySelectorAll("[data-letter]").forEach((b) => {
  b.onclick = () => {
    const i = Number(b.dataset.letter);

    document.querySelector("#letterTitle").textContent =
      titles[i];

    document.querySelector("#letterBody").textContent =
      values["letter" + (i + 1)];

    document.querySelector("#letterDialog").showModal();
  };
});

/* ========================================
   CLOSE POPUP WINDOWS
======================================== */

document.querySelectorAll("dialog").forEach((d) => {
  d.querySelector(".close").onclick = () => {
    d.close();
  };

  // Close when the visitor clicks outside the popup.
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();

      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        d.close();
      }
    }
  });
});

/* ========================================
   PERSONALIZATION FORM
======================================== */

const labels = {
  memory1: "Memory 01 — Where our story began",
  memory2: "Memory 02 — A day I keep coming back to",
  memory3: "Memory 03 — Ordinary magic",
  letter1: "Letter 01 — To my favorite person",
  letter2: "Letter 02 — A little love",
  letter3: "Letter 03 — All our tomorrows",
  closing: "Closing message",
  signature: "Your name",
};

const form = document.querySelector("#editForm");

Object.keys(labels).forEach((key) => {
  const label = document.createElement("label");

  label.htmlFor = "field-" + key;
  label.textContent = labels[key];

  const input = document.createElement("textarea");

  input.id = "field-" + key;
  input.name = key;
  input.value = values[key];

  form.append(label, input);
});

/* Save button */
const save = document.createElement("button");

save.className = "button";
save.type = "submit";
save.textContent = "Save drafts on this device ↗";

form.append(save);

/* Save drafts only in the current browser. */
form.onsubmit = (e) => {
  e.preventDefault();

  new FormData(form).forEach((v, k) => {
    values[k] = v;
  });

  render();

  try {
    localStorage.setItem(
      "our-universe-drafts",
      JSON.stringify(values)
    );

    document.querySelector("#saveStatus").textContent =
      "Saved on this browser. These drafts are not shared with other devices.";
  } catch {
    document.querySelector("#saveStatus").textContent =
      "Updated for this visit. Browser storage is unavailable, so please keep a separate copy.";
  }
};

/* Open the personalization window. */
document.querySelector("#edit").onclick = () => {
  document.querySelector("#editor").showModal();
};

/* ========================================
   MUSIC PLAYER
======================================== */

const music = document.querySelector("#music");
const toggle = document.querySelector(".music-toggle");

function showMusic(open) {
  music.hidden = !open;

  toggle.setAttribute(
    "aria-expanded",
    String(open)
  );

  // Load the player only when the music panel is first opened.
  if (open && !document.querySelector("#player iframe")) {
    const f = document.createElement("iframe");

    f.title =
      "Your Universe by Rico Blanco — official recording";

    f.src =
      "https://www.youtube-nocookie.com/embed/Sr33jn6hN0c?playsinline=1";

    f.allow =
      "autoplay; encrypted-media; picture-in-picture";

    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.allowFullscreen = true;

    document.querySelector("#player").append(f);
  }
}

toggle.onclick = () => {
  showMusic(music.hidden);
};

document.querySelector("#closeMusic").onclick = () => {
  showMusic(false);
};