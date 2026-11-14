# Pigimana — ručně vyráběná mýdla za studena

Jednoduchá statická prezentace (HTML / CSS / JS, bez buildu a závislostí).

## Spuštění

Stačí otevřít `index.html` v prohlížeči, nebo spustit lokální server:

```bash
python3 -m http.server 8080
```

a otevřít http://localhost:8080.

## Struktura

- `index.html` — veškerý obsah webu (texty, mýdla, složení)
- `css/style.css` — vzhled
- `js/main.js` — menu, animace při scrollu, detail mýdla
- `img/levandule-*.jpg|webp` — fotografie levandulového mýdla připravené pro web
- `img/soap-*.svg` — ilustrace ostatních mýdel (generované, dokud nejsou fotky)
- `assets/originals/` — původní fotografie v plné velikosti (zdroj pro `img/`)
- `tools/make_photos.py` — z `assets/originals` vyrobí zmenšené fotky do `img/`
  (výřezy s průhledností jako WebP, scény jako JPEG); vyžaduje `pip install pillow`
- `tools/make_soaps.py` — generátor ilustrací (`python3 tools/make_soaps.py`)

## Jak přidat fotografie dalších mýdel

1. Originály uložte do `assets/originals/`.
2. V `tools/make_photos.py` doplňte do slovníku `PHOTOS` řádek
   `"nazev-originalu.png": "nazev-na-webu.jpg"` (výřez s průhledným pozadím → `.webp`).
3. Spusťte `python3 tools/make_photos.py`.
4. V `index.html` u příslušné karty nahraďte `img/soap-*.svg` novou fotkou; další
   snímky do detailu mýdla přidejte do bloku `<div class="product__gallery" hidden>`
   jako `<img data-src="…" data-kind="cutout|photo" alt="…">`.

## Co upravit před spuštěním naostro

- **Kontakt**: e-mail `ahoj@pigimana.cz` a Instagram `@pigimana` jsou zástupné
  (v `index.html` a v `js/main.js` u tlačítka „Objednat e-mailem“).
- **Ceny a hmotnosti** u jednotlivých mýdel v `index.html`.
- **Fotografie**: zatím je nafocené jen levandulové mýdlo. Ostatní karty používají
  ilustrace `img/soap-*.svg`, postup výměny je výše.
- **Složení levandulového mýdla**: tmavá vrstva je v textu uvedená jako barvená indigem,
  ověřte podle skutečné receptury.
- **Příběh a dílna**: texty v sekci „Příběh“ a místo osobního odběru v sekci „Kontakt“.
