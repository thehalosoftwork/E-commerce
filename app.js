/* ================================================
   SOLÈNE — Luxury Footwear  |  app.js
   ================================================ */

/* ─── PRODUCTS DATA ─── */
const PRODUCTS = [
  {
    id: 1,
    name: "Maison Blanc",
    brand: "SOLÈNE Classics",
    price: 680,
    cat: "sneakers",
    badge: "new",
    img: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=700"
  },
  {
    id: 2,
    name: "Noir Chelsea",
    brand: "SOLÈNE Atelier",
    price: 840,
    cat: "boots",
    badge: null,
    img: "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/C04642s.jpg?im=Resize,width=750"
  },
  {
    id: 3,
    name: "Capri Slide",
    brand: "SOLÈNE Resort",
    price: 520,
    cat: "sandals",
    badge: "sale",
    orig: 680,
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRCwc7M1Il3AMwByRJqeX8WNkvoiKZIptjoZkDIiINXLC332RWOnCcbmE_iMzsNBKD_TnBVqLANSJ7xESRHExk3xm_mlWGEOHMPZcxhlrE"
  },
  {
    id: 4,
    name: "Montmartre High",
    brand: "SOLÈNE Atelier",
    price: 920,
    cat: "boots",
    badge: "new",
    img: "https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=700"
  },
  {
    id: 5,
    name: "Riviera Strap",
    brand: "SOLÈNE Resort",
    price: 590,
    cat: "sandals",
    badge: null,
    img: "https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=700"
  },
  {
    id: 6,
    name: "Palazzo Runner",
    brand: "SOLÈNE Sport",
    price: 760,
    cat: "sneakers",
    badge: null,
    img: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=700"
  },
  {
    id: 7,
    name: "Venezia Low",
    brand: "SOLÈNE Classics",
    price: 880,
    cat: "sneakers",
    badge: null,
    img: "https://img01.ztat.net/article/spp-media-p1/94c18eeb398044fea61c4822af71888f/698023b0db5d4467935cbc7347185be6.jpg?imwidth=762"
  },
  {
    id: 8,
    name: "Vernazza Boot",
    brand: "SOLÈNE Atelier",
    price: 1100,
    cat: "boots",
    badge: "new",
    img: "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=700"
  }
];

/* ─── STATE ─── */
let cart = [];
let activeFilter = "all";
let toastTimer = null;

/* ─── CURSOR ─── */
const cur  = document.getElementById("cur");
const ring = document.getElementById("cur-ring");
let rx = 0, ry = 0;

document.addEventListener("mousemove", (e) => {
  cur.style.left = e.clientX + "px";
  cur.style.top  = e.clientY + "px";
  rx = e.clientX;
  ry = e.clientY;
});

/* Smooth ring follow via rAF */
(function animateRing() {
  ring.style.left = rx + "px";
  ring.style.top  = ry + "px";
  requestAnimationFrame(animateRing);
})();

function attachCursorHover(el) {
  el.addEventListener("mouseenter", () => {
    cur.style.width  = "20px";
    cur.style.height = "20px";
    ring.style.width  = "54px";
    ring.style.height = "54px";
  });
  el.addEventListener("mouseleave", () => {
    cur.style.width  = "10px";
    cur.style.height = "10px";
    ring.style.width  = "38px";
    ring.style.height = "38px";
  });
}

/* Attach to static interactive elements */
document.querySelectorAll("a, button, .cat-card").forEach(attachCursorHover);

/* ─── NAV SCROLL ─── */
window.addEventListener("scroll", () => {
  document.getElementById("nav").classList.toggle("scrolled", window.scrollY > 60);
});

/* ─── RENDER PRODUCTS ─── */
function renderProducts(filter) {
  const grid = document.getElementById("prodGrid");

  const list =
    filter === "all"  ? PRODUCTS :
    filter === "new"  ? PRODUCTS.filter((p) => p.badge === "new") :
                        PRODUCTS.filter((p) => p.cat === filter);

  grid.innerHTML = list
    .map((p, i) => `
      <div class="prod-card" style="transition-delay: ${i * 0.07}s;">
        <div class="prod-img-wrap">
          ${p.badge
            ? `<span class="prod-badge ${p.badge === "new" ? "badge-new" : "badge-sale"}">
                 ${p.badge === "new" ? "New" : "Sale"}
               </span>`
            : ""}
          <img
            class="prod-photo"
            src="${p.img}"
            alt="${p.name}"
            onerror="this.src='https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=700'"
          />
          <div class="prod-actions">
            <button class="a-add" onclick="addToCart(${p.id})">Add to Bag</button>
            <button class="a-wish">♡</button>
          </div>
        </div>
        <div class="prod-brand">${p.brand}</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-price">
          <span class="p-now">$${p.price.toLocaleString()}</span>
          ${p.orig ? `<span class="p-was">$${p.orig.toLocaleString()}</span>` : ""}
        </div>
      </div>
    `)
    .join("");

  /* Re-attach cursor listeners for dynamically created cards */
  grid.querySelectorAll(".prod-card, .a-add, .a-wish").forEach(attachCursorHover);

  /* Scroll reveal — slight delay lets the DOM paint first */
  setTimeout(() => {
    grid.querySelectorAll(".prod-card").forEach((c) => c.classList.add("visible"));
  }, 60);
}

/* ─── FILTER ─── */
function applyFilter(filter, btn) {
  activeFilter = filter;
  document.querySelectorAll(".f-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(filter);
}

function filterAndScroll(cat) {
  activeFilter = cat;
  document.querySelectorAll(".f-btn").forEach((b) => {
    b.classList.toggle("active", b.textContent.trim().toLowerCase() === cat);
  });
  renderProducts(cat);
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

/* ─── CART ─── */
function addToCart(id) {
  const product  = PRODUCTS.find((p) => p.id === id);
  const existing = cart.find((x) => x.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`<span class="g">${product.name}</span> added to your selection`);
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter((x) => x.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const totalAmount = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
  const totalCount  = cart.reduce((sum, x) => sum + x.qty, 0);

  /* Badge */
  const badge = document.getElementById("cartBadge");
  badge.textContent = totalCount;
  badge.classList.toggle("on", totalCount > 0);

  /* Body */
  const body  = document.getElementById("cartBody");
  const empty = document.getElementById("cartEmpty");
  const foot  = document.getElementById("cartFoot");

  if (cart.length === 0) {
    body.innerHTML = "";
    body.appendChild(empty);
    empty.style.display = "flex";
    foot.style.display  = "none";
  } else {
    empty.style.display = "none";
    foot.style.display  = "block";

    body.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-row">
          <img
            src="${item.img}"
            alt="${item.name}"
            onerror="this.src='https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=200'"
          />
          <div class="cart-info">
            <div class="cart-iname">${item.name}</div>
            <div class="cart-imeta">Qty: ${item.qty}</div>
            <div class="cart-iprice">$${(item.price * item.qty).toLocaleString()}</div>
            <button class="cart-rm" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  document.getElementById("cartTotal").textContent = "$" + totalAmount.toLocaleString();
}

function openCart() {
  document.getElementById("cartPanel").classList.add("on");
  document.getElementById("cartMask").classList.add("on");
}

function closeCart() {
  document.getElementById("cartPanel").classList.remove("on");
  document.getElementById("cartMask").classList.remove("on");
}

/* ─── TOAST ─── */
function showToast(html) {
  const el = document.getElementById("toast");
  el.innerHTML = html;
  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("on"), 3000);
}

/* ─── NEWSLETTER ─── */
function handleNewsletter() {
  const input = document.getElementById("nlEmail");
  const value = input.value.trim();

  if (value && value.includes("@")) {
    showToast('✦ Welcome to the <span class="g">Inner Circle</span>');
    input.value = "";
  }
}

/* ─── SCROLL REVEAL (IntersectionObserver) ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.08 }
);

/* ─── INIT ─── */
(function init() {
  renderProducts("all");

  /* Observe product cards after first render */
  setTimeout(() => {
    document.querySelectorAll(".prod-card").forEach((c) => revealObserver.observe(c));
  }, 100);
})();
