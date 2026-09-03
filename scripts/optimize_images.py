#!/usr/bin/env python3
"""
Optimize a static GitHub Pages portfolio without changing the original images.

Run from anywhere after placing this file at scripts/optimize_images.py:
    python scripts/optimize_images.py

What it does:
  1. Reads assets/images/**
  2. Creates web-friendly WebP copies under assets/web/**
  3. Limits large images to 1800 px on the longest edge
  4. Uses gentle BICUBIC downsampling (no sharpening)
  5. Rewrites index.html and app.js to point at the optimized copies

The originals under assets/images/ are never deleted or modified.
Rerun whenever you add/change photos.
"""

from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    raise SystemExit(
        "Pillow is required. Install it with:\n"
        "  python -m pip install pillow"
    )

MAX_EDGE = 1800
PHOTO_QUALITY = 88
GRAPHIC_QUALITY = 95
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp"}
GRAPHIC_HINTS = (
    "logo", "emory-logo", "msm-logo", "mosaic", "chizu",
    "dept-path", "e2mc", "donut", "black"
)

SCRIPT = Path(__file__).resolve()
ROOT = SCRIPT.parent.parent if SCRIPT.parent.name == "scripts" else Path.cwd()
SOURCE_ROOT = ROOT / "assets" / "images"
OUTPUT_ROOT = ROOT / "assets" / "web"
HTML_PATH = ROOT / "index.html"
JS_PATH = ROOT / "app.js"


def human_bytes(n: int) -> str:
    units = ["B", "KB", "MB", "GB"]
    value = float(n)
    for unit in units:
        if value < 1024 or unit == units[-1]:
            return f"{value:.1f} {unit}"
        value /= 1024
    return f"{n} B"


def is_graphic(path: Path, image: Image.Image) -> bool:
    name = path.name.lower()
    if any(hint in name for hint in GRAPHIC_HINTS):
        return True
    return "A" in image.getbands() or image.mode in {"P", "LA", "RGBA"}


def optimize_one(src: Path, dst: Path) -> tuple[int, int]:
    original_size = src.stat().st_size

    with Image.open(src) as opened:
        image = ImageOps.exif_transpose(opened)
        icc_profile = opened.info.get("icc_profile")

        if max(image.size) > MAX_EDGE:
            ratio = MAX_EDGE / max(image.size)
            new_size = (
                max(1, round(image.width * ratio)),
                max(1, round(image.height * ratio)),
            )
            # BICUBIC is intentionally a little gentler than LANCZOS here.
            # It avoids adding a crisp/ringing look to already-sharp JPEG photos.
            image = image.resize(new_size, Image.Resampling.BICUBIC)

        graphic = is_graphic(src, image)

        if image.mode not in {"RGB", "RGBA"}:
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

        dst.parent.mkdir(parents=True, exist_ok=True)

        save_kwargs = {
            "format": "WEBP",
            "method": 6,
        }
        if icc_profile:
            save_kwargs["icc_profile"] = icc_profile

        if graphic:
            # Graphics/logos benefit from higher fidelity and often transparency.
            if image.mode == "RGBA":
                save_kwargs["lossless"] = True
            else:
                save_kwargs["quality"] = GRAPHIC_QUALITY
        else:
            save_kwargs["quality"] = PHOTO_QUALITY

        image.save(dst, **save_kwargs)

    return original_size, dst.stat().st_size


def output_for(src: Path) -> Path:
    relative = src.relative_to(SOURCE_ROOT)
    return (OUTPUT_ROOT / relative).with_suffix(".webp")


def rewrite_asset_paths(path: Path, mapping: dict[str, str]) -> int:
    if not path.exists():
        return 0

    text = path.read_text(encoding="utf-8")
    original = text

    # Longest first avoids accidental partial replacements.
    for old, new in sorted(mapping.items(), key=lambda item: len(item[0]), reverse=True):
        text = text.replace(old, new)

    if text == original:
        return 0

    backup = path.with_suffix(path.suffix + ".pre-image-opt")
    if not backup.exists():
        shutil.copy2(path, backup)

    path.write_text(text, encoding="utf-8")
    return 1


def main() -> int:
    if not SOURCE_ROOT.exists():
        print(f"Could not find {SOURCE_ROOT}")
        print("Run this from the root of your portfolio repo, or put it in scripts/.")
        return 1

    sources = [
        p for p in SOURCE_ROOT.rglob("*")
        if p.is_file() and p.suffix.lower() in SUPPORTED
    ]

    if not sources:
        print("No supported images found.")
        return 0

    mapping: dict[str, str] = {}
    before = 0
    after = 0
    processed = 0

    print(f"Optimizing {len(sources)} image(s)…")

    for src in sources:
        dst = output_for(src)
        old_size, new_size = optimize_one(src, dst)
        before += old_size
        after += new_size
        processed += 1

        old_url = src.relative_to(ROOT).as_posix()
        new_url = dst.relative_to(ROOT).as_posix()
        mapping[old_url] = new_url

        change = (1 - new_size / old_size) * 100 if old_size else 0
        print(
            f"  {old_url}\n"
            f"    {human_bytes(old_size)} -> {human_bytes(new_size)} "
            f"({change:+.0f}% smaller)"
        )

    changed_files = 0
    changed_files += rewrite_asset_paths(HTML_PATH, mapping)
    changed_files += rewrite_asset_paths(JS_PATH, mapping)

    print("\nFinished.")
    print(f"Images: {processed}")
    print(f"Total source size: {human_bytes(before)}")
    print(f"Total web size:    {human_bytes(after)}")
    if before:
        print(f"Reduction:         {(1 - after / before) * 100:.1f}%")
    print(f"HTML/JS files updated: {changed_files}")
    print(f"Originals remain untouched in: {SOURCE_ROOT.relative_to(ROOT)}")
    print(f"Optimized copies are in:       {OUTPUT_ROOT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
