# ASCEND v5 — ไฟล์สื่อ (media assets)

สัญลักษณ์ ^ ทุกฉาก (Hero, Inside ASCEND, วงกลมในเรดาร์และ CTA) เรนเดอร์สดด้วย Three.js
(`src/three/ChevronScene.ts`) ไม่ต้องใช้วิดีโอหรือเฟรมภาพ

ช่องภาพด้านล่างจะแสดงกรอบ placeholder บอกชื่อไฟล์ไว้ก่อน พอวางไฟล์จริงตาม path
เว็บจะใช้ไฟล์จริงแทนทันที (path ทั้งหมดอยู่ใน `src/lib/assets.ts`)
ควรใช้ **ภาพจริง** ของผลงานและแพลตฟอร์มเท่านั้น ไม่ใช้ภาพที่ AI สร้าง

| ไฟล์ | ใช้ที่ | ข้อกำหนด |
|---|---|---|
| `platform_quantumsoul.png` | Platforms (ซ้าย) | ภาพหน้าจอ 9:19.5 (เช่น 1170×2532) |
| `platform_edenverden.png` | Platforms (กลาง ขยายใหญ่) | ภาพหน้าจอ 9:19.5 |
| `platform_krumuaythai.png` | Platforms (ขวา) | ภาพหน้าจอ 9:19.5 |
| `gallery_newdelhi.jpg` | Global Stage การ์ดสูง | แนวตั้ง ~1200×1600 ภาพงาน Namaste Thailand 2026 |
| `gallery_canberra_sydney.jpg` | Global Stage | แนวนอน ~1600×1000 |
| `gallery_unesco.jpg` | Global Stage | แนวนอน ~1600×1000 |
| `logos/<id>.svg` | แถบโลโก้ Trusted By | id: `unesco`, `thai-embassy`, `gsb`, `etda`, `sos`, `scb-academy`, `spu` (จะแสดงเป็นสีขาวโดยอัตโนมัติ) |
