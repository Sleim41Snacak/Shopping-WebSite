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

    // Eski butonu kaldır, sayacı ekle
    const eskiButon = urun.querySelector("button");
    eskiButon.remove();
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
});
