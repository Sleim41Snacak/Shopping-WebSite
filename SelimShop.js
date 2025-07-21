document.addEventListener("DOMContentLoaded", () => {
  let toplamFiyat = 0;
  const butonlar = document.querySelectorAll(".urun button");
  const sepetYazi = document.getElementById("sepet");

  butonlar.forEach(buton => {
    buton.addEventListener("click", () => {
      const urun = buton.closest(".urun");
      const fiyatText = urun.querySelector("p").textContent;
      const fiyat = parseInt(fiyatText.replace(/\D/g, ""));
      toplamFiyat += fiyat;
      sepetYazi.textContent = `Sepet: ${toplamFiyat}₺`;
    });
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
