# AN TOÀN, ĐẠO ĐỨC Y TẾ & XỬ LÝ NGUY CẤP

**Dự án:** VinCare Copilot – Trợ lý Sàng lọc Triệu chứng & Chuẩn bị Trước khám  
**Nguyên tắc cốt lõi:** Tuân thủ Hướng dẫn Đạo đức AI Y tế của Tổ chức Y tế Thế giới (WHO), Luật Khám bệnh, chữa bệnh 2023 và Quy định Bảo vệ Dữ liệu Cá nhân (Nghị định 13/2023/NĐ-CP).

---

## 1. 5 Rủi ro Cốt lõi & Cách Xử lý

| STT | Tình huống rủi ro | Nguy cơ thực tế | Mức độ | Cách phòng ngừa & Xử lý |
| :-: | :--- | :--- | :---: | :--- |
| **1** | **AI suy diễn sai, kết luận bừa** | AI tự phán người bệnh bị ung thư từ vài triệu chứng đơn giản, hoặc nói "không sao đâu" với bệnh nặng, làm bệnh nhân hoảng loạn hoặc chủ quan. | **Rất nguy hiểm** | • **Cấm tuyệt đối:** Cài lệnh chặn AI phán tên bệnh hoặc kê đơn thuốc.<br>• **Đúng vai trò:** AI chỉ gợi ý chuyên khoa phù hợp để khám.<br>• **Cảnh báo rõ:** Luôn ghi rõ: *"Gợi ý của trợ lý ảo không thay thế chẩn đoán của bác sĩ"*. |
| **2** | **Bỏ sót ca cấp cứu** | Người bệnh đau ngực dữ dội hoặc trẻ sốt co giật nhưng AI trả lời lòng vòng, hướng dẫn đặt lịch ngày mai, làm lỡ "giờ vàng" cấp cứu. | **Rất nguy hiểm** | • **Bộ lọc từ khóa nguy cấp:** Quét tức thì trong 1 giây trước khi AI trả lời.<br>• **Cắt luồng tự động:** Dừng ngay việc đặt lịch, hiện màn hình đỏ báo động và nút gọi Cấp cứu 115 / Tổng đài Vinmec. |
| **3** | **Lộ thông tin cá nhân và bệnh án** | Họ tên, số điện thoại hoặc lịch sử khám bệnh bị lộ ra ngoài hoặc gửi cho bên thứ ba. | **Nghiêm trọng** | • **Bỏ thông tin định danh:** Tự động lọc bỏ họ tên, CCCD, số điện thoại, địa chỉ trước khi gửi triệu chứng cho AI xử lý.<br>• **Cam kết bảo mật:** Không dùng dữ liệu bệnh nhân để huấn luyện lại mô hình công cộng.<br>• **Mã hóa:** Mã hóa toàn bộ dữ liệu khi gửi đi và khi lưu trữ. |
| **4** | **Bỏ sót bệnh nhiệt đới tại Việt Nam** | AI học theo dữ liệu nước ngoài nên xem nhẹ các bệnh phổ biến trong nước (như sốt xuất huyết, tay chân miệng). | **Đáng chú ý** | • **Nạp dữ liệu bệnh bản địa:** Bổ sung kịch bản và dấu hiệu các bệnh dịch nhiệt đới hay gặp.<br>• **Bác sĩ rà soát:** Đội ngũ bác sĩ Vinmec kiểm tra và hiệu chỉnh định kỳ các câu trả lời của AI. |
| **5** | **Người lớn tuổi khó sử dụng** | Người già mắt kém khó đọc chữ nhỏ, tay run khó gõ phím, hoặc bỡ ngỡ với công nghệ. | **Cần lưu ý** | • **Nói thay vì gõ:** Hỗ trợ nhập triệu chứng bằng giọng nói tiếng Việt.<br>• **Giao diện thân thiện:** Chữ to, nút bấm lớn, màu sắc dễ nhìn.<br>• **Khai hộ:** Cho phép con cái, người thân khai triệu chứng giúp bố mẹ già hoặc con nhỏ. |

---

## 2. Quy trình Xử lý Khẩn cấp khi Phát hiện Dấu hiệu Nguy hiểm (Cờ đỏ)

Hệ thống hoạt động theo nguyên tắc **"Cầu dao ngắt tự động"**: Tính mạng người bệnh là số một. Nếu phát hiện dấu hiệu nguy kịch, hệ thống dừng ngay việc đặt lịch hẹn thông thường để ưu tiên cấp cứu.

```text
[Bệnh nhân nhập hoặc nói triệu chứng]
                  │
                  ▼
   ┌────────────────────────────────────────┐
   │ BỘ LỌC TỪ KHÓA NGUY HIỂM (CỜ ĐỎ)       │ ──► [Phát hiện dấu hiệu nguy cấp]
   │    (Kiểm tra tự động dưới 1 giây)      │                 │
   └────────────────────────────────────────┘                 │
                  │                                           ▼
         (Không có nguy kịch)               ┌────────────────────────────────────────┐
                  │                         │   MÀN HÌNH ĐỎ CẢNH BÁO NGUY CẤP 🚨     │
                  ▼                         │ - Báo động khẩn cấp về tính mạng       │
   [Tiếp tục gợi ý chuyên khoa phù hợp]     │ - Nút bấm gọi ngay bằng 1 chạm:        │
                                            │   + GỌI CẤP CỨU 115                    │
                                            │   + TỔNG ĐÀI CẤP CỨU VINMEC: 1900 232389│
                                            │ - Lời dặn sơ cứu tại chỗ               │
                                            │ - DỪNG TOÀN BỘ QUY TRÌNH ĐẶT LỊCH HẸN  │
                                            └────────────────────────────────────────┘
```

### 4 nhóm dấu hiệu nguy kịch cần gọi cấp cứu ngay

1. **Dấu hiệu Đột quỵ não (Mặt – Tay – Giọng nói – Giờ vàng):**
   * Mặt méo lệch một bên, miệng méo khi cười hoặc nói.
   * Yếu hoặc liệt một bên tay chân, không nhấc tay lên được.
   * Nói ngọng, líu lưỡi, không nói được hoặc đột ngột không hiểu lời người khác.
   * Chóng mặt, mất thăng bằng, ngã quỵ đột ngột.

2. **Dấu hiệu Tim mạch & Khó thở cấp:**
   * Đau thắt ngực dữ dội, cảm giác như đá đè sau xương ức, đau lan lên cằm, vai hoặc cánh tay trái.
   * Khó thở dồn dập, thở rít, tím tái môi và đầu ngón tay, không nói nổi hết một câu.

3. **Chảy máu nhiều & Đau bụng dữ dội:**
   * Nôn ra máu đỏ tươi hoặc đi ngoài phân đen như bã cà phê kèm vã mồ hôi, choáng ngất.
   * Đau bụng dữ dội, sờ vào thấy bụng cứng ngắc (nguy cơ thủng dạ dày hoặc vỡ ruột thừa).
   * Chấn thương đầu dẫn đến ngất xỉu, nôn vọt hoặc co giật.

4. **Dấu hiệu Nguy hiểm ở Trẻ em:**
   * Sốt cao co giật, li bì, ngủ mê mệt gọi không tỉnh.
   * Thở rên, tím tái quanh môi, bỏ bú hoàn toàn hoặc nôn tất cả mọi thứ vừa uống.

---

## 3. Trách nhiệm & Lời dặn Bệnh nhân

1. **Phân định rõ vai trò:**  
   VinCare Copilot là công cụ hỗ trợ người bệnh chọn đúng chuyên khoa và chuẩn bị kỹ thông tin trước khi đến viện. Hệ thống **tuyệt đối không thay thế bác sĩ** và không đưa ra kết luận bệnh chính thức.

2. **Lời nhắc bắt buộc trước khi sử dụng:**  
   Bệnh nhân luôn nhìn thấy thông báo rõ ràng trước khi bắt đầu:  
   > *"VinCare Copilot giúp bạn chọn đúng chuyên khoa và chuẩn bị thông tin trước khi khám. Trợ lý này không thay thế bác sĩ. Nếu bạn đang có dấu hiệu nguy kịch, hãy gọi ngay Cấp cứu 115 hoặc đến bệnh viện gần nhất."*

3. **Giám sát chuyên môn định kỳ:**  
   Toàn bộ lịch sử trao đổi và bản tóm tắt gửi cho bác sĩ được lưu trữ an toàn để các bác sĩ chuyên khoa Vinmec kiểm tra định kỳ, bảo đảm trợ lý AI luôn hoạt động đúng mực, chuẩn xác và an toàn.
