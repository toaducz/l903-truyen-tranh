# Quy ước Code (Coding Conventions) - L903 Truyện Tranh

Tài liệu này quy định các tiêu chuẩn lập trình để đảm bảo code sạch, dễ đọc và dễ bảo trì.

## 1. Naming Conventions
- **Thư mục & File**: Sử dụng `kebab-case` (ví dụ: `manga-detail`, `get-manga-by-id.ts`).
- **Components**: Sử dụng `PascalCase` cho tên Function Component (ví dụ: `MangaCard.tsx`).
- **Variables & Functions**: Sử dụng `camelCase` (ví dụ: `const mangaData`, `function fetchData()`).
- **Constants**: Sử dụng `UPPER_SNAKE_CASE` (ví dụ: `const API_BASE_URL`).
- **Types/Interfaces**: Sử dụng `PascalCase` (ví dụ: `interface MangaDetail`).

## 2. Cấu trúc Component
- Mỗi component nên nằm trong thư mục riêng nếu nó phức tạp hoặc có các sub-components/styles đi kèm.
- Sử dụng `'use client'` ở dòng đầu tiên nếu component có sử dụng React hooks hoặc tương tác với trình duyệt.
- Ưu tiên Functional Components và Hooks.

## 3. Data Fetching
- Không gọi API trực tiếp trong UI components.
- Tất cả các logic gọi API phải được đưa vào `lib/api/` và sử dụng `utils/request.ts` làm wrapper.
- Sử dụng **TanStack React Query** để quản lý trạng thái fetch dữ liệu, caching và loading/error states.

## 4. State Management
- Sử dụng **React Query** cho server state.
- Sử dụng **React Context** cho các global state đơn giản (ví dụ: Auth).
- Sử dụng `useState`/`useReducer` cho local component state.

## 5. Styling
- Sử dụng **Tailwind CSS** class trực tiếp trong thuộc tính `className`.
- Hạn chế viết CSS thuần trừ khi thực sự cần thiết (đưa vào `app/globals.css`).
- Tận dụng các utility classes của Tailwind để đảm bảo tính nhất quán.

## 6. Git & Commits
- Commit message nên ngắn gọn, súc tích và bằng tiếng Việt hoặc tiếng Anh (thống nhất một ngôn ngữ).
- Mỗi PR nên tập trung vào một tính năng hoặc một lỗi cụ thể.

## 7. Typescript
- Luôn định nghĩa kiểu dữ liệu cho props của component.
- Tránh sử dụng `any`. Hãy định nghĩa interface hoặc type cụ thể.
- Tận dụng tính năng tự động suy diễn kiểu của TypeScript khi có thể.
