# Pigi mána — ručně vyrobená mýdla za studena

Jednoduchá statická prezentace (HTML / CSS / JS, bez buildu a závislostí).
Vizuál vychází ze šablony „Bridge – Ceramic Store“: světle šedý podklad, bílé dlaždice,
prostrkané verzálky, kurzívní patkové detaily.

## Spuštění

Stačí otevřít `index.html` v prohlížeči, nebo spustit lokální server:

```bash
python3 -m http.server 8080
```

a otevřít http://localhost:8080.

## Struktura

- `index.html` — veškerý obsah webu (úvod, mýdla, proces, patička)
- `css/style.css` — vzhled
- `js/main.js` — menu, animace při scrollu, detail mýdla s galerií, newsletter
- `img/logo.png` — logo s průhledným pozadím (hlavička, úvod, patička); zdroj `assets/originals/logo.webp`
- `img/*-vyrez.webp` — výřezy mýdel s průhledným pozadím (dlaždice)
- `img/baleni-*.jpg` — mýdla s papírovou etiketou (zobrazí se při najetí na dlaždici a v detailu)
- `img/hero.jpg` — úvodní fotografie (zdroj `assets/hero/`, další varianty tamtéž)
- `img/rada.jpg` — řada všech pěti mýdel (galerie dárkové sady)
- `img/levandule-*.jpg` — aranžované scény s levandulovým mýdlem
- `assets/originals/` — původní fotografie v plné velikosti (zdroj pro `img/`)
- `tools/make_photos.py` — z `assets/originals` vyrobí zmenšené fotky do `img/`
  (výřezy jako WebP, scény jako JPEG); vyžaduje `pip install pillow`

## Jak přidat nové mýdlo nebo fotografii

1. Originály uložte do `assets/originals/`.
2. V `tools/make_photos.py` doplňte do slovníku `PHOTOS` řádek
   `"nazev-originalu.png": "nazev-na-webu.jpg"` (výřez s průhledným pozadím → `.webp`).
3. Spusťte `python3 tools/make_photos.py`.
4. V `index.html` zkopírujte blok `<article class="tile product …">`, upravte texty, cesty
   k fotkám (`product__img` = výřez, `product__img--alt` = fotka s etiketou) a galerii
   `<div class="product__gallery" hidden>` (`data-kind="cutout|photo"`).

## Co upravit před spuštěním naostro

- **Kontakt**: e-mail `ahoj@pigimana.cz` a Instagram `@pigimana` jsou zástupné
  (v `index.html` a v `js/main.js` u tlačítek „Objednat e-mailem“ a „Novinky“).
- **Ceny a hmotnosti** u jednotlivých mýdel a dárkové sady v `index.html`.
- **Složení a popisy**: texty vznikly podle fotografií a etiket (levandule: indigo;
  rozmarýn: spirulina a zelený jíl; kakao a oves; propolis a měsíček). Ověřte podle
  skutečných receptur. U Růže byly k zadanému složení přidány sušené okvětní lístky růže.
- **Newsletter** zatím jen otevře e-mail; pro skutečný sběr adres napojte službu
  (např. Mailchimp, Ecomail).
