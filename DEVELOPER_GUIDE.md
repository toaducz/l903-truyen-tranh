L903 Truyện Tranh — Tài liệu dành cho developer (Developer Guide)

Mục đích
- Tập trung cho developer mới: cách chạy, cấu trúc, quy ước và hướng dẫn nhanh để mở rộng project.

Chạy nhanh (Windows)
- Cài dependencies:
  npm install
- Chạy dev:
  npm run dev
- Build:
  npm run build
- Kiểm tra script khác: xem package.json (lint, format, test)

Biến môi trường quan trọng
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- Các biến API bên ngoài (xem utils/env.ts)
Lưu ý: auth token Supabase được set vào cookie HTTP-only bởi API route login.

Cấu trúc chính & tập trung đọc đầu tiên
- app/                 : Next.js App Router (layout, providers, pages)
  - app/layout.tsx     : layout + global providers
  - app/provider.tsx   : react-query provider
  - app/auth-provider.tsx : context auth và hook useAuth
- component/           : UI components (navbar, slider, manga-item, profile, bookmark, chapter...)
  - component/profile/profile-manga-list.tsx : danh sách truyện trong profile (ví dụ component)
- lib/                 : logic liên quan đến data
  - lib/supabase-client.ts : client Supabase
  - lib/bookmark.ts        : helper bookmark frontend
  - lib/api/               : wrapper gọi API externe (otruyen) theo feature
- utils/               : request abstraction, formatters, env helpers
- app/api/             : serverless API routes (auth, bookmark, proxy)
- public/              : assets tĩnh

Pattern & quy ước
- Data fetching: lib/api/* + utils/request.ts. Nếu cần proxy (CORS) dùng /api/proxy.
- State & cache: @tanstack/react-query; config ở app/provider.tsx.
- Auth: Supabase + cookies. Kiểm tra app/api/auth/* cho flow login/logout/me.
- UI: Tailwind. Class-based CSS utility. Global styles ở app/globals.css.
- Components client/server:
  - Nếu dùng hooks/state hoặc tương tác browser (window, document) -> 'use client' ở đầu file.
  - Tách component resuable vào component/*.
- Images: next/image thường dùng unoptimized cho nguồn externa.

Thêm feature (tóm tắt)
1. Page mới: tạo file trong app/<route>/page.tsx (App Router).
2. API call mới: tạo wrapper trong lib/api/<feature>.ts (sử dụng utils/request.ts).
3. Server route nếu cần thao tác server (cookie, supabase): thêm app/api/<...>/route.ts.
4. Component UI: component/<area>/<name>.tsx; export rõ prop types.
5. Types: thêm type shared trong types/ hoặc lib/types.ts nếu cần.

Debug & troubleshooting
- Lỗi CORS -> thử /api/proxy/route.ts hoặc kiểm tra utils/request.ts.
- Auth: kiểm tra cookies (sb-access-token / sb-refresh-token) trong DevTools.
- Kiểm tra query cache/keys khi dữ liệu không cập nhật (react-query devtools có ích).
- Kiểm tra logs serverless route trong terminal khi gọi /api/*.

Testing, linting, formatting
- Kiểm tra package.json scripts cho lint/format/test. Dùng ESLint config và Prettier project.
- Viết unit test cho logic trong lib/ trước UI nếu có.

Quy tắc commit & PR
- Tiêu đề ngắn gọn, mô tả các thay đổi chính.
- Thêm note nếu thay đổi schema Supabase hoặc migration.
- Chạy lint & test trước khi push.

Tài liệu tham khảo nhanh trong repo
- Xem app/layout.tsx, app/auth-provider.tsx, lib/supabase-client.ts, utils/request.ts, lib/api/*, app/api/*.
- Nếu cần schema Supabase: kiểm tra các route bookmark/auth để nhìn field được dùng.

Ghi chú cuối
- Mục tiêu: giữ lib/api làm single source of truth cho gọi data, components thuần render, server routes xử lý cookie/auth.
- Nếu muốn, đưa guideline coding style chi tiết vào CONTRIBUTING.md.

Kết thúc.