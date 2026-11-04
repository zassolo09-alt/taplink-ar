import json
import zlib
import struct
import sys

def write_png(filename, width, height, pixels):
    header = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = struct.pack('>I', zlib.crc32(b'IHDR' + ihdr_data))
    ihdr = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + ihdr_crc

    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)
        raw_data.extend(pixels[y * width * 3 : (y + 1) * width * 3])

    compressed = zlib.compress(bytes(raw_data), 9)
    idat_crc = struct.pack('>I', zlib.crc32(b'IDAT' + compressed))
    idat = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + idat_crc

    iend_crc = struct.pack('>I', zlib.crc32(b'IEND'))
    iend = struct.pack('>I', 0) + b'IEND' + iend_crc

    with open(filename, 'wb') as f:
        f.write(header + ihdr + idat + iend)

def render_qr_png(modules, filename, scale=24, quiet_zone=4):
    n = len(modules)
    total_size = (n + 2 * quiet_zone) * scale
    pixels = bytearray([255, 255, 255] * (total_size * total_size))

    # Dark module color: dark slate #0F172A
    dark_r, dark_g, dark_b = 15, 23, 42
    # Accent color for finder patterns or dots if desired
    accent_r, accent_g, accent_b = 255, 107, 0

    def is_finder(r, c):
        # Top-left, top-right, bottom-left 7x7 finders
        if (r < 7 and c < 7) or (r < 7 and c >= n - 7) or (r >= n - 7 and c < 7):
            return True
        return False

    for r in range(n):
        for c in range(n):
            if modules[r][c]:
                # Finder patterns get stylish dark navy or orange accent
                color = (dark_r, dark_g, dark_b)
                if is_finder(r, c):
                    # Outer border or center
                    color = (255, 107, 0) if (1 <= (r % (n-7) if r >= n-7 else r) <= 5 and 1 <= (c % (n-7) if c >= n-7 else c) <= 5) else (15, 23, 42)

                x_start = (c + quiet_zone) * scale
                y_start = (r + quiet_zone) * scale

                # draw slightly rounded block
                for dy in range(scale):
                    for dx in range(scale):
                        px = x_start + dx
                        py = y_start + dy
                        idx = (py * total_size + px) * 3
                        pixels[idx] = color[0]
                        pixels[idx+1] = color[1]
                        pixels[idx+2] = color[2]

    write_png(filename, total_size, total_size, pixels)
    print(f"Created {filename} ({total_size}x{total_size})")

if __name__ == '__main__':
    with open('/tmp/qr_data.json', 'r') as f:
        data = json.load(f)

    for item in data:
        render_qr_png(item['modules'], item['filename'], scale=item.get('scale', 20), quiet_zone=item.get('quiet_zone', 4))
