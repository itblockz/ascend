# ASCEND v5 — ไฟล์สื่อ (media assets)

ทุกช่องด้านล่างมี **ตัวแทนที่วาดด้วยโค้ด** อยู่แล้ว เว็บจึงทำงานได้แม้โฟลเดอร์นี้ว่าง
พอวางไฟล์จริงตาม path ที่กำหนด เว็บจะใช้ไฟล์จริงแทนเองทันที (path ทั้งหมดอยู่ใน `src/lib/assets.ts`)

| ไฟล์ | ใช้ที่ | ข้อกำหนด |
|---|---|---|
| `frames_hero/frame-001.webp` … `frame-240.webp` | Hero (ตรึงจอ เลื่อนแล้วภาพขยับตาม) | 1920×1080, พื้น `#060B14`, ^ ประกอบตัวจาก particle → ติดแสง → พุ่งขึ้น → หยุดนิ่งพร้อมวงโคจร, ~80–150 KB/เฟรม |
| `frames_layers/frame-001.webp` … `frame-024.webp` | Inside ASCEND | 1920×1080, ^ แยกเป็น 3 ชั้น + ฐานกริด ชั้นสุดท้ายต้องอยู่ที่ความสูง 41% / 55% / 69% / 86% ของภาพ (ตรงกับป้ายชื่อ) |
| `ascend_loop.webm` + `ascend_loop.mp4` | วงกลมกลางเรดาร์ + CTA | สี่เหลี่ยมจัตุรัส 1080×1080, 6–8 วินาที, loop ต่อกันไม่มีรอยต่อ, ^ หมุน 360°, พื้นขาว/มุก `#EEF2F6`, ไม่มีเสียง |
| `platform_quantumsoul.png` | Platforms (ซ้าย) | ภาพหน้าจอ 9:19.5 (เช่น 1170×2532) |
| `platform_edenverden.png` | Platforms (กลาง ขยายใหญ่) | ภาพหน้าจอ 9:19.5 |
| `platform_krumuaythai.png` | Platforms (ขวา) | ภาพหน้าจอ 9:19.5 |
| `gallery_newdelhi.jpg` | Global Stage การ์ดสูง | แนวตั้ง ~1200×1600 ภาพงาน Namaste Thailand 2026 |
| `gallery_canberra_sydney.jpg` | Global Stage | แนวนอน ~1600×1000 |
| `gallery_unesco.jpg` | Global Stage | แนวนอน ~1600×1000 |
| `logos/<id>.svg` | แถบโลโก้ Trusted By | id: `unesco`, `thai-embassy`, `gsb`, `etda`, `sos`, `scb-academy`, `spu` (จะแสดงเป็นสีขาวโดยอัตโนมัติ) |

## วิธีสร้างเฟรม/วิดีโอสัญลักษณ์ ^

### ทางเลือก 1 — Blender (แนะนำ คุมคุณภาพได้เต็มที่)
1. นำเข้า SVG โลโก้ ^ (หรือใช้ `public/favicon.svg`) → Convert to Mesh → Extrude ~0.15
2. วัสดุ: หน้า = Emission ไล่สี teal `#14F1C6` → cyan `#00E5FF` → blue `#2F6BFF` / ด้านข้าง = Metallic navy `#0D2A5C` / เปิด Bloom (Eevee)
3. Hero: ใช้ Particle system หรือ Geometry Nodes ให้จุดวิ่งเข้ามารวมเป็นรูป (frame 1–120) → ^ ติดแสง (120–150) → ยกขึ้นพร้อมเส้นแสงด้านล่าง (150–210) → ค้างพร้อมวงโคจร 2 วง (210–240)
4. Render เป็น PNG sequence 1920×1080 แล้วแปลง:
   ```bash
   for f in *.png; do cwebp -q 82 "$f" -o "${f%.png}.webp"; done
   ```
5. Loop: กล้องนิ่ง หมุน ^ รอบแกน Y 360° ใน 180 เฟรม (30 fps) พื้นขาว แล้ว encode:
   ```bash
   ffmpeg -framerate 30 -i loop_%04d.png -c:v libvpx-vp9 -b:v 0 -crf 32 -pix_fmt yuv420p ascend_loop.webm
   ffmpeg -framerate 30 -i loop_%04d.png -c:v libx264 -crf 22 -pix_fmt yuv420p -movflags +faststart ascend_loop.mp4
   ```

### ทางเลือก 2 — AI video (Runway / Kling / Veo)
ใส่ภาพนิ่งโลโก้ ^ เป็นเฟรมแรก พร้อม prompt ตัวอย่าง:
> "A glowing glass chevron logo (^) assembles from thousands of cyan particles in deep navy space, ignites with teal-to-blue gradient light, then rises upward leaving light trails over a perspective grid floor. Cinematic, slow, centered, locked-off camera, 16:9."

จากนั้นดึงเฟรม:
```bash
ffmpeg -i hero.mp4 -vf "fps=30,scale=1920:-1" -frames:v 240 frames_hero/frame-%03d.webp
```
ข้อควรระวัง: AI มักทำให้โลโก้เพี้ยน ต้องตรวจทุกช็อต และกล้องต้องนิ่ง ไม่อย่างนั้นตอนเลื่อนจอภาพจะสั่น

### ทางเลือก 3 — อัดจากเว็บเอง (เร็วที่สุด ภาพตรงกับเว็บทุกประการ)
1. `npm run dev` แล้วเปิด `http://localhost:5173/?record` (หรือ `/?hero=three&record` ถ้าจะใช้เวอร์ชัน Three.js)
2. กดปุ่ม **Record frames** ที่มุมซ้ายล่าง แล้วเลือกโฟลเดอร์ `public/assets` (ต้องใช้ Chrome/Edge)
3. จะได้ `frames_hero/` และ `frames_layers/` ครบ รีโหลดหน้าเว็บเพื่อดูผล
