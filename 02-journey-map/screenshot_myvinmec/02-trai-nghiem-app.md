# Đánh Giá Trải Nghiệm Ứng Dụng MyVinmec

Khảo sát thực tế ứng dụng di động MyVinmec cho thấy giao diện hiện tại bộc lộ nhiều rào cản lớn, gây khó khăn cho người bệnh:

1. **Quảng cáo chặn luồng:** Vừa mở app, popup bán gói khám chiếm 70% màn hình xuất hiện. Nút đóng `(✕)` quá nhỏ (~30dp), khiến người lớn tuổi hoặc tay run dễ bấm nhầm vào banner bán hàng.
2. **Quá tải nhận thức & Cắt cụt tên:** Trang chủ nhồi nhét 12 dịch vụ trong lưới 3x4 với icon nhỏ; hàng loạt nhãn bị cắt cụt ba chấm (`Danh mục giá ...`, `Quyền lợi CBNV Vin...`, `Nhắc lịch uốn...`), buộc người dùng phải đoán mò tính năng.
3. **Cấp cứu thiếu nổi bật:** Hotline cấp cứu 24/7 hiển thị bình thường như mục đọc báo, thiếu màu cảnh báo đỏ và ký hiệu SOS khẩn cấp.
4. **Lỗi giao diện & Tắc nghẽn đặt khám:** Tên bệnh viện bị cắt cụt kèm nút `[✕]` dễ bấm nhầm xóa dữ liệu; 3 nút phương thức khám bị lỗi xén mất chân chữ tiếng Việt (`bác sĩ`, `chuyên khoa`); ô mô tả triệu chứng giới hạn 120 ký tự quá ngắn; nút "ĐẶT HẸN" disabled có độ tương phản chỉ 1.4:1 (vi phạm WCAG AA) và không có gợi ý trường còn thiếu.

**Đề xuất cải tiến (VinCare Copilot):** Tinh giản trang chủ thành lưới 2x2 (MyVinmec, Lịch hẹn, Cấp cứu SOS, Liên hệ); tự động định vị viện gần nhất bằng GPS; ứng dụng AI phân tách triệu chứng tự nhiên và chuẩn hóa vùng chạm tối thiểu 48dp.
