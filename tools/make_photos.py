#!/usr/bin/env python3
"""Připraví fotografie z assets/originals pro web (img/).

- výřezy s průhledným pozadím → ořízne prázdné okraje, zmenší, uloží jako WebP s průhledností
- scény → zmenší na max. 1600 px, uloží jako JPEG (kvalita 82)

Spuštění: python3 tools/make_photos.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "originals"
OUT = ROOT / "img"

# zdrojový soubor → název na webu
PHOTOS = {
    "Levandulové mýdlo s krajkovým reliéfem-1.png": "levandule-vyrez-krajka.webp",
    "Ruční dvouvrstvé levandulové mýdlo-4.png":     "levandule-vyrez-2.webp",
    "Ručně krájené vrstvené levandulové mýdlo-2.png": "levandule-vyrez-3.webp",
    "Ručně vyráběné levandulové mýdlo-3.png":       "levandule-vyrez-4.webp",
    "Unknown-2.png": "levandule-suroviny.jpg",   # mýdlo s miskami surovin
    "Unknown-3.png": "levandule-miska.jpg",      # na keramické misce v koupelně
    "Unknown-4.png": "levandule-platno.jpg",     # čtvercové aranžmá na plátně
    "Unknown-5.png": "levandule-koupelna.jpg",   # zvlněná miska, umyvadlo
    "Unknown-6.png": "levandule-ruka.jpg",       # mýdlo v ruce nad umyvadlem
    "Unknown-7.png": "levandule-kamen.jpg",      # na travertinu, boční světlo
    "Unknown-8.png": "levandule-krajeni.jpg",    # tři nakrájené kousky
    "Unknown-9.png": "levandule-baleni.jpg",     # zabalené v papíru s provázkem
}

def cutout(im, max_w=1200):
    im = im.convert("RGBA")
    bbox = im.getchannel("A").point(lambda a: 255 if a > 16 else 0).getbbox()  # ignoruje téměř průhledné okraje
    if bbox:
        pad = 24
        bbox = (max(bbox[0]-pad, 0), max(bbox[1]-pad, 0), min(bbox[2]+pad, im.width), min(bbox[3]+pad, im.height))
        im = im.crop(bbox)
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    return im

def scene(im, max_w=1600):
    im = ImageOps.exif_transpose(im).convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    return im

for src_name, out_name in PHOTOS.items():
    src = SRC / src_name
    if not src.exists():
        print("chybí:", src_name); continue
    im = Image.open(src)
    out = OUT / out_name
    if out_name.endswith(".webp"):
        cutout(im).save(out, quality=86, method=6)
    else:
        scene(im).save(out, quality=82, optimize=True, progressive=True)
    kb = out.stat().st_size // 1024
    print(f"✓ img/{out_name}  {Image.open(out).size}  {kb} kB")
