# KẾ HOẠCH DẪN DẮT 6 TUẦN: EXPLORATION SPRINT VINMEC (K4)
**Vai trò Mentor:** Huấn luyện phương pháp luận Stanford Biodesign, gỡ kẹt tư duy và kiểm định an toàn y tế lâm sàng.

---

## 1. Nhịp Điệu Quản Lý
* **Daily Async Check-in (Discord/Zalo - 15'):** Mỗi sáng trả lời 3 câu: *Hôm qua làm gì? Hôm nay làm gì? Đang kẹt ở đâu?*
* **Weekly Gate (Thứ Bảy - 60'):** Demo sản phẩm chạy thật (No slides, show product/evidence), phản biện và duyệt gate trước khi sang tuần mới.
* **Nguyên tắc "Fail Fast":** Kẹt quá 24h phải ping ngay; không giấu lỗi, không làm việc dựa trên giả định bàn giấy.

---

## 2. Chi Tiết Lộ Trình 6 Tuần Thực Chiến

### TUẦN 1: Thu thập bằng chứng & Thu Hẹp Phạm Vi
* **Làm gì:** Tải MyVinmec dùng thử toàn bộ flow đặt lịch; phỏng vấn sâu 3–5 người bệnh thật và 1 nhân viên tiếp đón/y tế; ghi âm/transcript ẩn danh. Thực hiện quan sát trực tiếp tại bệnh viện, xem quy trình xử lí của bệnh viện và hành trình/hành vi của người đi khám.
* **Vì sao:** Đổi mới y tế bắt đầu từ nỗi đau có thật của con người, không bắt đầu từ ý tưởng công nghệ. Ý tưởng công nghệ chỉ xuất phát khi nhìn thấu được vấn đề đang xảy ra và nhóm sẽ đưa ra phương hướng giải quyết.
* **Hành vi hay gặp của team:** Ôm đồm cả hành trình (từ ở nhà đến xét nghiệm, lấy thuốc, tái khám); thiết kế làm khảo sát Google Form trắc nghiệm thay vì phỏng vấn sâu; hỏi câu hỏi dẫn dụ hoặc hỏi tương lai ("Anh có muốn...").
* **Mình sẽ:**
  * Tạo môi trường, hướng dẫn interview, hầu hết mọi người chưa có kĩ năng để gợi mở phỏng vấn nên sẽ phỏng vấn theo form, có cấu trúc, tuy nhiên phỏng vấn cần mở và tự nhiên hơn, có thể gợi được điểm khó chịu của người dùng hoặc cách mà người tham gia trực tiếp muốn được xử lí, những phương hướng được chia sẻ đôi khi sẽ đơn giản mà hiệu quả hơn cách mà team bỏ công đi research.
  * Ép team chọn đúng 1 khoảnh khắc 15 phút đau đớn nhất (khoảnh khắc bối rối chọn chuyên khoa & mù mờ nhịn ăn).
  * Không được nhắc đến từ "AI", "App", "Chatbot" trong tuần 1.

### TUẦN 2: Mô tả Hành Trình & Chốt Need Statement
* Dựng Journey Map 5 bước chỉ rõ điểm rơi cảm xúc; viết Tuyên bố Nhu cầu (Need Statement): *Nhu cầu [Outcome] cho [Population] gặp [Problem]*.
* Trong dự án, Need Statement là sống còn. Định nghĩa sai nhu cầu sẽ tạo ra sản phẩm vô giá trị, không giải quyết được vấn đề cốt lõi, gây lãng phí thời gian và công sức.
* Team thường sẽ gặp phải lỗi đưa ra thẳng giải pháp, mô tả nỗi đau chung chung, thiếu đối chứng giữa người bệnh và bác sĩ, dẫn đến mình nghĩ có thể giải quyết nhưng thực ra problem statement, need statement bị sơ sài.
* **Cách quản lý:**
  * Kỹ thuật **"Xóa chiếc búa" (Delete the tool)**: Gạch sạch mọi từ khóa giải pháp (AI, Chatbot, Web, App). Truy vấn: *"Nếu thế giới mất điện, nhu cầu sâu thẳm của bệnh nhân là gì?"*.
  * Buộc phải có bằng chứng 2 đầu: Bệnh nhân sợ đặt nhầm khoa vs Bác sĩ mất 40% thời gian gõ phím EMR.

### TUẦN 3: Best Practices Quốc Tế & Thiết Kế Kiến Trúc AI-First MVP
* Mình sẽ điều team đi nghiên cứu về 3 mô hình hàng đầu theo bài toán (Ada Health - AI Triage; Mayo Clinic - SOAP 24h; One Medical - Dynamic Card) rồi sau đó chốt tính năng cốt lõi cho VinCare Copilot.
* Mình muốn team kế thừa các kết quả, chuẩn mực quốc tế đã chứng minh, các phương pháp này đã được sử dụng và có hiệu quả, tránh việc đi phát minh lại bánh xe trong thời gian có hạn.
* Định hướng **"AI-First MVP"**: Web App 1 trang đơn giản, không cần server cồng kềnh.
* Dồn lực vào 3 lõi giá trị: clean UI 2x2, AI bóc tách triệu chứng ra đúng chuyên khoa, và tự động sinh bản tóm tắt cho bác sĩ.

### TUẦN 4: Xây Dựng Nguyên Mẫu & Thiết Lập Hàng Rào An Toàn (Safety Guardrails)
* Ở tuần này sẽ cần viết System Prompt y tế chuẩn mực; xây dựng luồng bóc tách trường hợp khẩn cấp (đột quỵ FAST, đau ngực cấp); hoàn thiện giao diện Bệnh nhân & Bác sĩ. Ở khâu này quan trọng về prompt và nguyên tắc đạo đức, AI trong y tế tuyệt đối không được chẩn đoán bệnh thay bác sĩ mà chỉ hỗ trợ, tóm tắt để giảm workload về thời gian cho BS.
* Nếu làm hời hợt, app sẽ thả lỏng an toàn, để AI tự do chẩn đoán bệnh và gợi ý đơn thuốc bừa bãi; quên cơ chế ngắt luồng gọi cấp cứu tức thì,... rất nguy hiểm.
* Team phải trực tiếp engineer và versioning cho 5 ca bệnh khẩn cấp vào app. Nếu AI không tự ngắt luồng trong 3 giây để hiện hotline 115/Vinmec 24/7 -> Đánh trượt Gate 4, bắt cấu hình lại prompt.

### TUẦN 5: Thử Nghiệm Người Thật & Rollout Thử Nghiệm Quy Mô Nhỏ (Pilot)
* Tuần này sẽ tiến hành đưa Web App cho 3–5 người dùng thật thử nghiệm (1 người lớn tuổi, 1 mẹ bỉm sữa, 1 người trẻ) và 1 bác sĩ thử đọc bản SOAP 30 giây.
* **Cách test & Rollout quy mô nhỏ:**
  1. *Test Lab (Mô phỏng):* Mở máy cho người dùng ngồi tự thao tác, Mentor và team ngồi sau quan sát, không can thiệp mà để người dùng tự khám phá, team âm thầm quan sát và ghi lại các điểm người dùng bị khựng, nhầm lẫn. Ở điểm này, cần lưu ý không được chỉ dẫn, cũng như 1 hướng kiểm định nhanh là người dùng mới hoặc người dùng lần đầu có thể khám phá được app hay không.
  2. *Pilot Quy mô nhỏ:* In mã QR Standee đặt tại 1 quầy tiếp đón thử nghiệm hoặc phòng khám sinh viên VinUni; cho 10–15 người trải nghiệm đặt hẹn thử và đo:
     * Thời gian hoàn tất đặt lịch (mục tiêu: < 10 phút).
     * Tỷ lệ chọn đúng chuyên khoa qua AI (mục tiêu: > 90%).
     * Thời gian bác sĩ nắm bệnh sử, tình trạng qua các thông tin người dùng nhập (mục tiêu: < 10 giây).
* **Hành vi hay gặp của team:** Phòng thủ khi bị chê bai; chỉ đưa app cho bạn thân cùng lớp bấm thử (không phát hiện được lỗi); bỏ qua việc ghi log.
* **Đối với kết quả thu được từ người dùng thật:** Buộc nộp bảng so sánh **Before / After** sau test: *"Người dùng ngơ ngác ở đâu? Em đã sửa giao diện và prompt thế nào?"*.

### TUẦN 6: Đóng Gói Hồ Sơ, Quản Trị Rủi Ro
* **Trong tuần này cần:** Hoàn thiện tài liệu an toàn & đạo đức y tế, chuẩn hóa `README.md`, xuất bản slide thuyết trình chuẩn.
* **Anti Pattern:** Slide ngập tràn chữ, nói lan man về kỹ thuật mà quên mất bài toán lâm sàng và giá trị cho bệnh nhân/bác sĩ; cháy giáo án quá 10 phút.
* **Tổ chức:**
  * Tổ chức buổi **Dry Run**: Bấm giờ chuẩn 10 phút thuyết trình + 5 phút phản biện.
  * Đóng vai phản biện dồn dập về rủi ro sai chuyên khoa và khả năng tích hợp EMR viện.

---

## 3. Bảng Kiểm Đánh Giá Nghiệm Thu Dự án (Quality Gate Checklist)
* [ ] **Tuần 1:** Có log phỏng vấn thật (P1, P2, P3) kèm trích dẫn nguyên văn cảm xúc.
* [ ] **Tuần 2:** Need Statement tuyệt đối sạch bóng từ ngữ giải pháp (No AI/App).
* [ ] **Tuần 3:** Chọn lọc 3 bài học quốc tế kèm cơ chế thích ứng cho Vinmec.
* [ ] **Tuần 4:** Web App click được, bóc tách SOAP 30s mượt, qua bài test Red Flags 100%.
* [ ] **Tuần 5:** Có bằng chứng Usability Test thật với bảng cải tiến Before/After.
* [ ] **Tuần 6:** Pitching sắc sảo đúng 10 phút, repo GitHub chuẩn hóa tài liệu.
