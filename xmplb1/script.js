/* ===== Navbar & menu ===== */
const navbar = document.getElementById("navbar");
const tombolMenu = document.getElementById("tombol-menu");
const menu = document.getElementById("menu");
const linkMenu = menu.querySelectorAll("a");

function aturNavbar() {
  navbar.classList.toggle("scroll", window.scrollY > 50);
}

function tutupMenu() {
  menu.classList.remove("buka");
  tombolMenu.setAttribute("aria-expanded", "false");
  tombolMenu.setAttribute("aria-label", "Buka menu");
}

window.addEventListener("scroll", aturNavbar, { passive: true });
aturNavbar();

tombolMenu.addEventListener("click", () => {
  const buka = menu.classList.toggle("buka");
  tombolMenu.setAttribute("aria-expanded", String(buka));
  tombolMenu.setAttribute("aria-label", buka ? "Tutup menu" : "Buka menu");
});

linkMenu.forEach((a) => a.addEventListener("click", tutupMenu));

/* ===== Menu aktif sesuai section ===== */
const pengamat = new IntersectionObserver((daftar) => {
  daftar.forEach((entri) => {
    if (!entri.isIntersecting) return;
    linkMenu.forEach((a) => {
      const cocok = a.getAttribute("href") === "#" + entri.target.id;
      a.classList.toggle("aktif", cocok);
      if (cocok) {
        a.setAttribute("aria-current", "location");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });

document.querySelectorAll("main section[id]").forEach((b) => pengamat.observe(b));

/* ===== Slider ===== */
const slider = document.getElementById("home");
const slides = document.querySelectorAll(".slide");
const wadahTitik = document.getElementById("titik");
const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let urutan = 0;
let timer;
let jeda = false;

const titik = Array.from(slides, (_, i) => {
  const t = document.createElement("button");
  t.type = "button";
  t.className = "titik";
  t.setAttribute("aria-label", "Foto " + (i + 1));
  t.addEventListener("click", () => {
    tampil(i);
    mulai();
  });
  wadahTitik.appendChild(t);
  return t;
});

titik[0].classList.add("aktif");

function tampil(n) {
  slides[urutan].classList.remove("aktif");
  titik[urutan].classList.remove("aktif");
  urutan = (n + slides.length) % slides.length;
  slides[urutan].classList.add("aktif");
  titik[urutan].classList.add("aktif");
}

function mulai() {
  clearInterval(timer);
  if (jeda || kurangiGerak) return;
  timer = setInterval(() => tampil(urutan + 1), 5000);
}

function berhenti() {
  jeda = true;
  clearInterval(timer);
}

function lanjut() {
  jeda = false;
  mulai();
}

slider.addEventListener("mouseenter", berhenti);
slider.addEventListener("mouseleave", lanjut);
slider.addEventListener("focusin", berhenti);
slider.addEventListener("focusout", lanjut);

// Geser (swipe) di layar sentuh
let awalX = 0;

slider.addEventListener("touchstart", (e) => {
  awalX = e.touches[0].clientX;
}, { passive: true });

slider.addEventListener("touchend", (e) => {
  const selisih = e.changedTouches[0].clientX - awalX;
  if (Math.abs(selisih) > 50) {
    tampil(urutan + (selisih < 0 ? 1 : -1));
    mulai();
  }
}, { passive: true });

mulai();

/* ===== Playlist Spotify ===== */
const bagianPlaylist = document.getElementById("playlist");
const dataPlaylist = bagianPlaylist.dataset.playlist.trim();
const cocokPlaylist = dataPlaylist.match(/playlist\/([A-Za-z0-9]+)/);
const idPlaylist = cocokPlaylist ? cocokPlaylist[1] : dataPlaylist;

document.getElementById("spotify-embed").src =
  "https://open.spotify.com/embed/playlist/" + idPlaylist + "?utm_source=generator&theme=0";
document.getElementById("spotify-link").href =
  "https://open.spotify.com/playlist/" + idPlaylist;

/* ===== Lightbox ===== */
const lightbox = document.getElementById("lightbox");
const lightboxFoto = lightbox.querySelector("img");
const lightboxInfo = document.getElementById("lightbox-info");
const daftarFoto = Array.from(document.querySelectorAll(".foto img"));
let fotoAktif = 0;

lightbox.classList.toggle("satu", daftarFoto.length < 2);

function bukaFoto(i) {
  fotoAktif = (i + daftarFoto.length) % daftarFoto.length;
  const foto = daftarFoto[fotoAktif];
  lightboxFoto.src = foto.currentSrc || foto.src;
  lightboxFoto.alt = foto.alt;
  lightboxInfo.textContent = (fotoAktif + 1) + " / " + daftarFoto.length;
  if (!lightbox.open) lightbox.showModal();
}

daftarFoto.forEach((foto, i) => {
  foto.closest(".foto").addEventListener("click", () => bukaFoto(i));
});

lightbox.querySelector(".lb-tutup").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lb-sebelumnya").addEventListener("click", () => bukaFoto(fotoAktif - 1));
lightbox.querySelector(".lb-berikutnya").addEventListener("click", () => bukaFoto(fotoAktif + 1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.open) return;
  if (e.key === "ArrowLeft") bukaFoto(fotoAktif - 1);
  if (e.key === "ArrowRight") bukaFoto(fotoAktif + 1);
});
