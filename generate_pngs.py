import json
import zlib
import struct

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

def render_minimal_qr(modules, filename, scale=20, quiet_zone=4):
    n = len(modules)
    total_size = (n + 2 * quiet_zone) * scale
    # Pure white background
    pixels = bytearray([255, 255, 255] * (total_size * total_size))

    for r in range(n):
        for c in range(n):
            if modules[r][c]:
                x_start = (c + quiet_zone) * scale
                y_start = (r + quiet_zone) * scale
                for dy in range(scale):
                    for dx in range(scale):
                        px = x_start + dx
                        py = y_start + dy
                        idx = (py * total_size + px) * 3
                        # Pure black
                        pixels[idx] = 0
                        pixels[idx+1] = 0
                        pixels[idx+2] = 0

    write_png(filename, total_size, total_size, pixels)
    print(f"Generated minimal {filename} ({total_size}x{total_size})")

if __name__ == '__main__':
    with open('/tmp/qr_data.json', 'r') as f:
        data = json.load(f)

    for item in data:
        render_minimal_qr(item['modules'], item['filename'], scale=24, quiet_zone=4)
