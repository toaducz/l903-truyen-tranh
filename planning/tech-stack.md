# Phân tích Tech Stack - L903 Truyện Tranh

Dự án sử dụng các công nghệ hiện đại nhằm tối ưu hiệu năng và trải nghiệm người dùng (UX).

## Core Frameworks
- **Next.js 15 (App Router)**: Framework React mạnh mẽ nhất hiện nay, hỗ trợ Server Components, Streaming, và tối ưu hóa SEO vượt trội.
- **React 19**: Phiên bản mới nhất của React với nhiều cải tiến về hiệu năng và hooks.
- **TypeScript 5**: Đảm bảo an toàn kiểu dữ liệu (type-safe), giảm thiểu lỗi runtime và tăng tốc độ phát triển.

## Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework giúp xây dựng giao diện nhanh chóng, nhất quán và dễ bảo trì.
- **PostCSS**: Công cụ xử lý CSS hiện đại.

## State Management & Data Fetching
- **TanStack React Query 5**: Quản lý server state, caching, và đồng bộ dữ liệu một cách thông minh.
- **Context API**: Sử dụng cho client state đơn giản như Auth (`auth-provider.tsx`).

## Backend & Services
- **Supabase**: Backend-as-a-Service (BaaS) cung cấp Database (PostgreSQL) và Authentication cực kỳ nhanh chóng.
- **External API (otruyen)**: Nguồn dữ liệu truyện tranh bên thứ ba được tích hợp qua lớp API wrapper.

## Animation & UX
- **Anime.js 4**: Thư viện animation nhẹ và mạnh mẽ.
- **Rive React**: Tích hợp các animation vector tương tác cao.
- **Keen Slider**: Slider mượt mà cho danh sách truyện và banner.
- **NProgress**: Hiển thị thanh tiến trình khi chuyển trang.

## Development Tools
- **ESLint 9**: Công cụ kiểm tra lỗi code và thực thi coding standards.
- **Prettier**: Công cụ format code tự động.
- **Turbopack**: Công cụ build cực nhanh tích hợp sẵn trong Next.js.
