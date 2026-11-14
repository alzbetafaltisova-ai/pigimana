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
- `img/soap-*.svg` — ilustrace mýdel (generované)
- `tools/make_soaps.py` — generátor ilustrací (`python3 tools/make_soaps.py`)

## Co upravit před spuštěním naostro

- **Kontakt**: e-mail `ahoj@pigimana.cz` a Instagram `@pigimana` jsou zástupné
  (v `index.html` a v `js/main.js` u tlačítka „Objednat e-mailem“).
- **Ceny a hmotnosti** u jednotlivých mýdel v `index.html`.
- **Fotografie**: až budou, nahraďte soubory `img/soap-*.svg` fotkami
  (ideálně na jednobarevném pozadí, poměr stran 4:3) a upravte cesty v `index.html`.
- **Příběh a dílna**: texty v sekci „Příběh“ a místo osobního odběru v sekci „Kontakt“.
