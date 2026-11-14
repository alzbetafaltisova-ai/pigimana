#!/usr/bin/env python3
"""Vygeneruje ilustrace mýdel (SVG) do složky img/.

Spuštění:  python3 tools/make_soaps.py
Barvy, žilkování a „posypku“ (kávu, sůl, oves…) upravíte v seznamu SOAPS níže.
Až budou k dispozici fotografie, stačí nahradit soubory img/soap-*.svg
fotkami se stejným názvem (nebo upravit cesty v index.html).
"""
import random
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "img"
OUT.mkdir(exist_ok=True)

SOAPS = [
    dict(slug="ruzova-zahrada",      c1="#ecc2b6", c2="#cf9484", side="#b67a6c", swirl="#f6e1d9", swirl2="#d8b47a", speck=None,       seed=3),
    dict(slug="levandulovy-podvecer", c1="#bcaed0", c2="#9586ad", side="#7d6e95", swirl="#e5ddf0", swirl2=None,      speck="#4e3f66", seed=7,  speck_n=70, speck_r=(1.4, 2.6)),
    dict(slug="lesni-stezka",        c1="#9cab95", c2="#728568", side="#5a6b52", swirl="#c3cfba", swirl2=None,      speck="#3b4a37", seed=11, speck_n=60, speck_r=(1.0, 2.2)),
    dict(slug="ranni-kava",          c1="#b08b6d", c2="#7e5d43", side="#634734", swirl="#cfb193", swirl2=None,      speck="#3a2a1e", seed=5,  speck_n=140, speck_r=(1.0, 2.4)),
    dict(slug="morsky-vanek",        c1="#a8cbc7", c2="#75a3a0", side="#5c8a88", swirl="#eaf3f1", swirl2=None,      speck="#ffffff", seed=13, speck_n=110, speck_r=(0.8, 1.8)),
    dict(slug="med-a-oves",          c1="#ecdfc2", c2="#d4bf97", side="#b9a37a", swirl="#f7efdd", swirl2=None,      speck="#b1915c", seed=17, speck_n=55, speck_r=(1.6, 3.2)),
]

W, H = 480, 360
BX, BY, BW, BH, R = 70, 86, 340, 186, 24   # horní plocha mýdla
THICK = 14                                  # viditelná tloušťka

def soap_svg(s):
    rnd = random.Random(s["seed"])
    uid = s["slug"].replace("-", "")
    specks = ""
    if s["speck"]:
        lo, hi = s["speck_r"]
        for _ in range(s["speck_n"]):
            x = rnd.uniform(BX + 10, BX + BW - 10)
            y = rnd.uniform(BY + 10, BY + BH - 10)
            r = rnd.uniform(lo, hi)
            o = rnd.uniform(.35, .8)
            specks += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{s["speck"]}" opacity="{o:.2f}"/>'
    swirl2 = ""
    if s["swirl2"]:
        swirl2 = f'''
      <path d="M{BX+30} {BY+120} C {BX+90} {BY+40}, {BX+160} {BY+170}, {BX+230} {BY+90} S {BX+320} {BY+60}, {BX+335} {BY+130}"
            fill="none" stroke="{s["swirl2"]}" stroke-width="7" stroke-linecap="round" opacity=".75"/>
      <path d="M{BX+10} {BY+60} C {BX+80} {BY+20}, {BX+120} {BY+110}, {BX+200} {BY+40}"
            fill="none" stroke="{s["swirl2"]}" stroke-width="3.5" stroke-linecap="round" opacity=".6"/>'''

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">
  <defs>
    <linearGradient id="base-{uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{s["c1"]}"/>
      <stop offset="1" stop-color="{s["c2"]}"/>
    </linearGradient>
    <radialGradient id="sheen-{uid}" cx=".25" cy=".15" r=".9">
      <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
      <stop offset=".45" stop-color="#fff" stop-opacity=".08"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edge-{uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".22"/>
    </linearGradient>
    <clipPath id="clip-{uid}"><rect x="{BX}" y="{BY}" width="{BW}" height="{BH}" rx="{R}"/></clipPath>
    <filter id="marble-{uid}" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.009 0.018" numOctaves="2" seed="{s["seed"]}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="46" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="1.2"/>
    </filter>
    <filter id="grain-{uid}">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="{s["seed"] + 1}" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .18 0"/>
    </filter>
    <filter id="shadow-{uid}" x="-30%" y="-80%" width="160%" height="300%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>

  <!-- stín -->
  <ellipse cx="{W/2}" cy="{BY + BH + THICK + 22}" rx="{BW/2 - 10}" ry="18" fill="#3b2a22" opacity=".28" filter="url(#shadow-{uid})"/>

  <!-- bok (tloušťka) -->
  <rect x="{BX}" y="{BY + THICK}" width="{BW}" height="{BH}" rx="{R}" fill="{s["side"]}"/>
  <rect x="{BX}" y="{BY + THICK}" width="{BW}" height="{BH}" rx="{R}" fill="url(#edge-{uid})"/>

  <!-- horní plocha -->
  <rect x="{BX}" y="{BY}" width="{BW}" height="{BH}" rx="{R}" fill="url(#base-{uid})"/>

  <g clip-path="url(#clip-{uid})">
    <!-- mramorování -->
    <g filter="url(#marble-{uid})" opacity=".85">
      <ellipse cx="{BX+110}" cy="{BY+70}" rx="120" ry="18" fill="{s["swirl"]}" opacity=".9" transform="rotate(-14 {BX+110} {BY+70})"/>
      <ellipse cx="{BX+230}" cy="{BY+130}" rx="130" ry="14" fill="{s["swirl"]}" opacity=".75" transform="rotate(-10 {BX+230} {BY+130})"/>
      <ellipse cx="{BX+180}" cy="{BY+40}" rx="90" ry="9" fill="{s["swirl"]}" opacity=".6" transform="rotate(-18 {BX+180} {BY+40})"/>
      <ellipse cx="{BX+90}" cy="{BY+150}" rx="80" ry="10" fill="{s["swirl"]}" opacity=".55" transform="rotate(-8 {BX+90} {BY+150})"/>{swirl2}
    </g>
    <!-- posypka -->
    <g>{specks}</g>
    <!-- zrnitost -->
    <rect x="{BX}" y="{BY}" width="{BW}" height="{BH}" filter="url(#grain-{uid})" opacity=".55"/>
    <!-- lesk -->
    <rect x="{BX}" y="{BY}" width="{BW}" height="{BH}" fill="url(#sheen-{uid})"/>
  </g>

  <!-- hrana horní plochy -->
  <rect x="{BX + .5}" y="{BY + .5}" width="{BW - 1}" height="{BH - 1}" rx="{R - .5}" fill="none" stroke="#fff" stroke-opacity=".35"/>

  <!-- ražba -->
  <g font-family="Cormorant Garamond, Georgia, serif" font-size="22" letter-spacing="6" text-anchor="middle">
    <text x="{W/2}" y="{BY + BH/2 + 9}" fill="#fff" fill-opacity=".35">PIGIMANA</text>
    <text x="{W/2}" y="{BY + BH/2 + 8}" fill="#000" fill-opacity=".28">PIGIMANA</text>
  </g>
</svg>
'''

for s in SOAPS:
    (OUT / f"soap-{s['slug']}.svg").write_text(soap_svg(s), encoding="utf-8")
    print("✓", f"img/soap-{s['slug']}.svg")

# favicon
(OUT / "favicon.svg").write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="6" y="20" width="52" height="30" rx="8" fill="#b67a6c"/>
  <rect x="6" y="14" width="52" height="30" rx="8" fill="#e7b8ad"/>
  <ellipse cx="26" cy="24" rx="12" ry="3" fill="#f6e1d9" transform="rotate(-14 26 24)"/>
</svg>
''', encoding="utf-8")
print("✓ img/favicon.svg")
