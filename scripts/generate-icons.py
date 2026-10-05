"""Render the existing three-stroke vector brand mark as dependency-free PNGs."""
from pathlib import Path
import math
import struct
import zlib

OUTPUT = Path(__file__).resolve().parents[1] / "public" / "icons"
STROKES = ((16, 40, 29, 24), (29, 40, 42, 24), (42, 40, 50, 30))


def distance(x, y, segment):
    ax, ay, bx, by = segment
    dx, dy = bx - ax, by - ay
    t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(x - ax - t * dx, y - ay - t * dy)


def chunk(kind, data):
    return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))


def render(size, filename):
    rows = bytearray()
    # Full-bleed background; strokes fit the central safe area of maskable icons.
    for y in range(size):
        rows.append(0)
        for x in range(size):
            px, py = (x + 0.5) * 64 / size, (y + 0.5) * 64 / size
            coverage = max(0, min(1, (3 - min(distance(px, py, s) for s in STROKES)) * size / 64 + 0.5))
            rows.extend(round(c + (255 - c) * coverage) for c in (44, 84, 65))
    data = b"\x89PNG\r\n\x1a\n"
    data += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
    data += chunk(b"IDAT", zlib.compress(rows))
    data += chunk(b"IEND", b"")
    (OUTPUT / filename).write_bytes(data)


OUTPUT.mkdir(parents=True, exist_ok=True)
for dimension, name in ((192, "icon-192.png"), (512, "icon-512.png"), (512, "maskable-512.png"), (180, "apple-touch-icon.png")):
    render(dimension, name)
