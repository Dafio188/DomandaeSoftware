from pathlib import Path
import shutil
from PIL import Image, ImageDraw


def process_image(path: Path, backup_dir: Path, threshold: int) -> None:
    backup_dir.mkdir(parents=True, exist_ok=True)
    backup_path = backup_dir / path.name
    if not backup_path.exists():
        shutil.copy2(path, backup_path)

    im = Image.open(path).convert("RGB")
    w, h = im.size
    key = (255, 0, 255)

    work = im.copy()
    for xy in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        ImageDraw.floodfill(work, xy=xy, value=key, thresh=threshold)

    alpha = Image.new("L", (w, h), 255)
    wp = work.load()
    ap = alpha.load()
    for y in range(h):
        for x in range(w):
            if wp[x, y] == key:
                ap[x, y] = 0

    rgba = im.convert("RGBA")
    rgba.putalpha(alpha)
    rgba.save(path, format="PNG", optimize=True)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    icons_dir = root / "frontend" / "public" / "immagini icona homepage"
    backup_dir = icons_dir / "_originals"

    if not icons_dir.exists():
        raise SystemExit(f"Directory non trovata: {icons_dir}")

    threshold = 35
    files = sorted(icons_dir.glob("??.png"))
    if not files:
        raise SystemExit(f"Nessuna icona trovata in: {icons_dir}")

    for p in files:
        process_image(p, backup_dir=backup_dir, threshold=threshold)
        print(f"{p.name}: OK")


if __name__ == "__main__":
    main()

