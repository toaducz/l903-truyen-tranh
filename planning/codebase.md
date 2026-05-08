# Phân tích Cấu trúc Codebase - L903 Truyện Tranh

Dự án được tổ chức theo mô hình hiện đại của Next.js App Router, giúp phân tách rõ ràng giữa logic giao diện, xử lý dữ liệu và cấu hình hệ thống.

## 1. Thư mục Gốc (Root)
- `app/`: Trái tim của ứng dụng Next.js. Chứa routes, layouts và các server-side logic.
- `component/`: Chứa các UI components dùng chung và chuyên biệt.
- `lib/`: Chứa logic nghiệp vụ, API wrappers, và cấu hình cho các thư viện bên thứ ba (Supabase, react-query).
- `utils/`: Các hàm tiện ích dùng chung cho toàn bộ dự án.
- `public/`: Chứa các tài nguyên tĩnh như hình ảnh, fonts, icons.
- `planning/`: (Mới) Chứa tài liệu phân tích và kế hoạch phát triển dự án.

## 2. Chi tiết Thư mục `app/`
- `api/`: Các serverless routes xử lý logic phía backend (Proxy, Auth, Bookmark).
- `(routes)/`: Các thư mục con đại diện cho từng trang (Home, Login, Profile, Manga Detail, Reader).
- `layout.tsx`: Layout chung cho toàn bộ ứng dụng, nơi đặt các Global Providers.
- `provider.tsx`: Cấu hình TanStack React Query.
- `auth-provider.tsx`: Quản lý trạng thái đăng nhập của người dùng.
- `globals.css`: File CSS tổng thể sử dụng Tailwind.

## 3. Chi tiết Thư mục `component/`
Được phân loại theo chức năng:
- `navbar.tsx` & `footer.tsx`: Thành phần điều hướng chính.
- `manga/`: Các component liên quan đến hiển thị truyện (Card, List, Detail).
- `chapter/`: Các component cho trang đọc truyện (Chapter list, Reader).
- `bookmark/`: Xử lý lưu truyện yêu thích.
- `profile/`: Các component hiển thị thông tin người dùng.
- `slider/`: Banner và danh sách truyện dạng trượt.

## 4. Chi tiết Thư mục `lib/`
- `api/`: Các module gọi API từ bên ngoài (otruyen), được chia theo tính năng.
- `supabase-client.ts`: Khởi tạo và cấu hình Supabase client.
- `bookmark.ts`: Logic xử lý bookmark (đồng bộ giữa local và server).
- `auth-helper.ts`: Các hàm hỗ trợ kiểm tra quyền truy cập.

## 5. Luồng Dữ liệu (Data Flow)
1. **Request**: UI Component yêu cầu dữ liệu thông qua hook từ React Query.
2. **API Wrapper**: Hook gọi đến các hàm trong `lib/api/`.
3. **HTTP Client**: `utils/request.ts` thực hiện fetch dữ liệu (có thể qua `/api/proxy` nếu bị lỗi CORS).
4. **Cache & Update**: React Query nhận dữ liệu, cập nhật cache và render lại UI.

## 6. Luồng Authentication
1. Người dùng đăng nhập qua Supabase.
2. Token được lưu vào Cookie (HTTP-only) qua API route để đảm bảo bảo mật.
3. `auth-provider.tsx` cung cấp thông tin người dùng cho toàn bộ ứng dụng qua Context.
4. `middleware.ts` kiểm tra quyền truy cập của các route cần bảo vệ.
