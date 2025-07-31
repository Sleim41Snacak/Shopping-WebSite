document.addEventListener("DOMContentLoaded", () => {
  let toplamFiyat = 0;
  const sepetYazi = document.getElementById("sepet");
  const temizleButon = document.getElementById("temizleButon");

  const urunVerileri = [];

  document.querySelectorAll(".urun").forEach((urun, index) => {
    const fiyatText = urun.querySelector("p").textContent;
    const fiyat = parseInt(fiyatText.replace(/\D/g, ""));

    let adet = 0;

    const sayacDiv = document.createElement("div");
    sayacDiv.classList.add("counter");
    sayacDiv.innerHTML = `
      <button class="azalt">-</button>
      <span class="adet">0</span>
      <button class="arttir">+</button>
    `;

    // Eski sepete ekle butonunu kaldır, sayaç ekle
    const eskiButon = urun.querySelector("button");
    if (eskiButon) eskiButon.remove();
    urun.appendChild(sayacDiv);

    const azaltBtn = sayacDiv.querySelector(".azalt");
    const arttirBtn = sayacDiv.querySelector(".arttir");
    const adetSpan = sayacDiv.querySelector(".adet");

    urunVerileri.push({
      fiyat,
      adet,
      adetSpan,
      arttir: () => {
        urunVerileri[index].adet++;
        adetSpan.textContent = urunVerileri[index].adet;
        toplamFiyat += fiyat;
        sepetYazi.textContent = `Sepet: ${toplamFiyat}₺`;
      },
      azalt: () => {
        if (urunVerileri[index].adet > 0) {
          urunVerileri[index].adet--;
          adetSpan.textContent = urunVerileri[index].adet;
          toplamFiyat -= fiyat;
          sepetYazi.textContent = `Sepet: ${toplamFiyat}₺`;
        }
      },
      sifirla: () => {
        toplamFiyat -= urunVerileri[index].adet * fiyat;
        urunVerileri[index].adet = 0;
        adetSpan.textContent = "0";
      }
    });

    arttirBtn.addEventListener("click", urunVerileri[index].arttir);
    azaltBtn.addEventListener("click", urunVerileri[index].azalt);
  });

  temizleButon.addEventListener("click", () => {
    urunVerileri.forEach((urun) => urun.sifirla());
    toplamFiyat = 0;
    sepetYazi.textContent = "Sepet: 0₺";
  });

  const kategoriButonlari = document.querySelectorAll(".Kategoriler");
  const urunler = document.querySelectorAll(".urun");

  kategoriButonlari.forEach((buton) => {
    buton.addEventListener("click", () => {
      const secilenKategori = buton.id;
      urunler.forEach((urun) => {
        const urunKategori = urun.getAttribute("data-kategori");

        if (secilenKategori === "Tümü" || urunKategori === secilenKategori) {
          urun.style.display = "block";
        } else {
          urun.style.display = "none";
        }
      });
    });
  });

  document.querySelectorAll(".urun img").forEach((resim, index) => {
    resim.style.cursor = "pointer";

    resim.addEventListener("click", (e) => {
      e.stopPropagation();

      const urun = resim.closest(".urun");
      const imgSrc = resim.src;
      const baslik = urun.querySelector("h3").textContent;
      const fiyat = urun.querySelector("p").textContent;
      const aciklama = urun.dataset.aciklama || "Bu ürün hakkında detaylı bilgi yakında eklenecek.";

      const adetSpan = urun.querySelector(".adet");
      const adet = adetSpan ? adetSpan.textContent : "0";

      const modalHTML = `
        <div class="modal-arka-plan" id="modal">
          <div class="buyuyen-urun">
            <span class="kapat" id="modalKapat">&times;</span>
            <img src="${imgSrc}" alt="${baslik}" />
            <div class="urun-detay">
              <h2>${baslik}</h2>
              <p>${fiyat}</p>
              <div class="counter">
                <button id="modalAzalt">-</button>
                <span id="modalAdet">${adet}</span>
                <button id="modalArttir">+</button>
              </div>
              <p style="margin-top: 20px;">${aciklama}</p>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHTML);

      const modal = document.getElementById("modal");
      const modalKapat = document.getElementById("modalKapat");
      const modalAzalt = document.getElementById("modalAzalt");
      const modalArttir = document.getElementById("modalArttir");
      const modalAdet = document.getElementById("modalAdet");

      modalKapat.addEventListener("click", () => {
        modal.remove();
      });

      modal.addEventListener("click", (evt) => {
        if (evt.target === modal) {
          modal.remove();
        }
      });

      modalArttir.addEventListener("click", () => {
        urunVerileri[index].arttir();
        modalAdet.textContent = urunVerileri[index].adet;
      });

      modalAzalt.addEventListener("click", () => {
        urunVerileri[index].azalt();
        modalAdet.textContent = urunVerileri[index].adet;
      });
    });
  });
});
