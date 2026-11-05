# XÂY DỰNG ỨNG DỤNG CHARACTER MANAGER & COMPARISON

## 1. Công nghệ
- Xây dựng project mới hoàn toàn bằng Angular.
- Sử dụng TypeScript, Angular Components, HTML Templates và SCSS riêng biệt.
- Ưu tiên Standalone Components.
- Không sử dụng HTML/CSS/JavaScript thuần.
- Không sử dụng innerHTML.
- Code rõ ràng, chia component hợp lý, tránh những dòng code quá dài.

## 2. Giao diện Desktop

Chia màn hình thành hai khu vực:

**Bên trái (30%) – Character List**
- Search box.
- Danh sách nhân vật dạng Card: Avatar, Name, ID.
- Nút nhỏ trên Avatar để chọn/bỏ chọn so sánh.
- Click Avatar để mở Edit Character.
- Tìm kiếm bằng tên: nhân vật khớp được đưa lên đầu, các nhân vật khác vẫn hiển thị bên dưới.
- Tối đa 5 nhân vật được chọn.

**Bên phải (70%) – Comparison Panel**

Phần trên:
- Card các nhân vật được chọn.
- Hiển thị Avatar, Name và chấm màu đại diện.
- Có nút bỏ chọn.

Phần dưới:
- Hiển thị 5 chỉ số A, B, C, D, E.
- Mỗi chỉ số có số thanh ngang tương ứng với số nhân vật được chọn.
- Mỗi nhân vật có một màu riêng, thống nhất trong toàn bộ giao diện.
- Hiển thị giá trị số ở cuối thanh.
- Mỗi chỉ số có thang đo riêng, nhưng các nhân vật trong cùng nhóm phải dùng chung thang đo.

Không sử dụng Radar Chart.

## 3. Giao diện Mobile
- Thiết kế Responsive riêng, không đơn giản thu nhỏ Desktop.
- Danh sách nhân vật và Card được chọn hỗ trợ cuộn ngang khi cần.
- Các nhóm chỉ số xếp dọc.
- Thanh và giá trị số phải dễ đọc.
- Không để toàn bộ trang bị cuộn ngang.

## 4. Chức năng
- Chọn tối đa 5 nhân vật để so sánh.
- Click Avatar để chỉnh sửa thông tin và 5 chỉ số.
- Thay đổi dữ liệu phải cập nhật ngay giao diện so sánh.
- Xử lý đầy đủ trạng thái chưa chọn, chọn tối đa, thiếu Avatar và chỉ số bằng 0.

## 5. Kiến trúc và dữ liệu
- Tạo Angular Service quản lý dữ liệu nhân vật.
- Sử dụng TypeScript Interface rõ ràng.
- Quản lý danh sách được chọn bằng ID nhân vật.
- Tách biệt dữ liệu gốc và dữ liệu hiển thị đã sắp xếp.
- Sử dụng dữ liệu mẫu để kiểm thử.
- Dùng LocalStorage để lưu dữ liệu chỉnh sửa.
- Thiết kế sẵn khả năng kết nối REST API sau này.

## 6. Yêu cầu hoàn thành
- Giao diện đẹp, hiện đại, Dark Theme.
- Hoạt động tốt trên Desktop và Mobile.
- Code dễ đọc, dễ bảo trì và mở rộng.
- Build Angular thành công.
- Báo cáo cấu trúc thư mục, component và chức năng đã hoàn thành.
