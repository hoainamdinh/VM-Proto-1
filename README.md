# VINCARE COPILOT: TRỢ LÝ SÀNG LỌC TRIỆU CHỨNG & CHUẨN BỊ TIỀN KHÁM
> **Dự án:** Exploration Sprint Vinmec - VinUni  
> **Phương pháp luận:** Stanford Biodesign Framework & AI-First Healthcare Innovation  
> **Trọng tâm nghiên cứu:** Tối ưu hóa trải nghiệm tiền khám (Pre-visit Clinical Triage & Preparation)  
> **Slide thuyết trình:** [slides.html](file:///d:/VinUni/Exploration%20Sprint%20Vinmec/VM-Proto-1/slides.html) • [slides.pdf](file:///d:/VinUni/Exploration%20Sprint%20Vinmec/VM-Proto-1/slides.pdf) (Bộ 5 slide chuẩn)  
> **Trải nghiệm trực tuyến (Live Demo):** [https://vincare-copilot.vercel.app](https://vincare-copilot.vercel.app)

---

## 1. Bối cảnh & Thực trạng

Khảo sát thực tế hành trình khám chữa bệnh tại các cơ sở y tế cao cấp như Vinmec cho thấy giai đoạn tiền khám đang tồn tại những rào cản thao tác và đứt gãy thông tin nghiêm trọng giữa người bệnh và bệnh viện:

* **Quảng cáo thương mại lấn át y tế:** Khi mở ứng dụng MyVinmec, người dùng lập tức bị chặn bởi popup quảng cáo bán gói khám chiếm tới 70% màn hình. Nút đóng `(✕)` quá nhỏ (~30dp) khiến người bệnh, đặc biệt là người cao tuổi hoặc người run tay, rất dễ bấm trượt vào trang bán hàng ngoài ý muốn.
* **Giao diện quá tải & Cắt cụt nhãn diện rộng:** Trang chủ nhồi nhét 12 dịch vụ trong lưới 3x4 với icon nhỏ. Hàng loạt nhãn tính năng bị cắt cụt bằng dấu ba chấm (`Danh mục giá ...`, `Quyền lợi CBNV Vin...`, `Nhắc lịch uốn...`), buộc người bệnh phải đoán mò nội dung.
* **Bình thường hóa số cấp cứu 24/7:** Hotline cấp cứu được đặt ngang hàng như các chuyên mục đọc báo thông thường, dùng màu xanh nhạt, hoàn toàn thiếu nhận diện khẩn cấp (Emergency SOS).
* **Lỗi giao diện tại màn hình đặt lịch:** Tên cơ sở bị cắt ngắn kèm nút `[✕]` dễ bấm nhầm xóa dữ liệu; các nút chọn phương thức bị lỗi xén cụt chân chữ tiếng Việt (`bác sĩ`, `chuyên khoa`); nút "ĐẶT HẸN" disabled có độ tương phản chỉ 1.4:1 (vi phạm nghiêm trọng chuẩn WCAG AA).

---

## 2. Vấn đề Rút ra từ Người dùng & Bác sĩ

Thông qua các đợt phỏng vấn sâu với bệnh nhân (`P1`, `P2`, `P3`) và bác sĩ lâm sàng (`D1`), nhóm nghiên cứu xác định hai nút thắt cốt lõi:

* **Về phía người bệnh:**
  * Người bệnh chỉ biết mô tả cảm giác cơ thể nhưng bị ứng dụng ép phải tự chẩn đoán và lựa chọn trong danh mục dài hơn 30 chuyên khoa, dẫn đến nguy cơ đặt nhầm khoa và hoang mang.
  * Thiếu hoàn toàn chỉ dẫn chuẩn bị trước khi đi khám: người bệnh không biết có cần nhịn ăn xét nghiệm hay không, thuốc mạn tính (huyết áp, tiểu đường) có được uống không, dẫn đến việc bị hủy xét nghiệm buổi sáng hoặc tăng huyết áp nguy hiểm.
* **Về phía bác sĩ:**
  * Bác sĩ mất tới 40% thời lượng thăm khám quý giá chỉ để gõ phím nhập tay các thông tin hành chính và bệnh sử cơ bản vào phần mềm Bệnh án điện tử (EMR).
  * Ca khám bị biến thành cảnh "bác sĩ cắm mặt vào màn hình, bệnh nhân ngồi im lặng bối rối", làm giảm chất lượng tương tác trực tiếp.

---

## 3. Bài học từ Thực hành Quốc tế (Best Practices)

Để tìm lời giải bài bản, nhóm nghiên cứu đã khảo cứu 3 mô hình y tế số hàng đầu thế giới:

* **Ada Health (Anh & Đức - Đối tác NHS):**
  * Ứng dụng AI Triage đối thoại động theo ngữ cảnh triệu chứng thay vì bắt người dùng chọn khoa; đạt độ chính xác 97.4% trong phân luồng cấp cứu.
  * *Bài học:* AI chỉ đóng vai trò phân luồng gợi ý chuyên khoa, tuyệt đối không chẩn đoán bệnh thay bác sĩ; bắt buộc có bộ lọc quét cờ đỏ (Red Flags) ngắt luồng chuyển sang cấp cứu tức thì.
* **Mayo Clinic (Hoa Kỳ):**
  * Tự động hóa hỏi bệnh tiền khám 24 giờ trước lịch hẹn qua ứng dụng MyChart; AI cấu trúc hóa lời kể thành bản tóm tắt chuẩn **SOAP** đồng bộ vào màn hình bác sĩ.
  * *Bài học:* Giảm 42% thời gian gõ phím cho bác sĩ, nâng thời gian tương tác mắt-đối-mắt từ 55% lên 82%.
* **One Medical (Amazon Health - Hoa Kỳ):**
  * Giao diện tối giản mở đầu bằng một câu hỏi: *"Hôm nay bạn cảm thấy thế nào?"*.
  * Tự động sinh **Thẻ chuẩn bị tiền khám động** (Dynamic Care Prep Card): đếm ngược giờ nhịn ăn xét nghiệm, hướng dẫn thuốc mạn tính và mã QR vào thẳng quầy Fast-track.
  * *Bài học:* Chuyển từ ứng dụng ghi nhận mã hẹn đơn thuần sang công cụ đồng hành chuẩn bị chu đáo trước khám.

---

## 4. Giải pháp Đề xuất: VinCare Copilot

**VinCare Copilot** là trợ lý thông minh đóng vai trò lớp đệm chuyển hóa giữa người bệnh và hệ thống y tế:

* **Giao diện Trang chủ Lưới 2x2 Tinh giản:**
  * Loại bỏ hoàn toàn modal quảng cáo chặn luồng khi mở app.
  * Rút gọn thành 4 nút bấm lớn dễ chạm: *MyVinmec, Lịch hẹn, Cấp cứu SOS (màu đỏ nổi bật 1-chạm), Liên hệ*; hỗ trợ vuốt ngang xem các tiện ích phụ.
* **Tự động Định vị Cơ sở gần nhất bằng GPS:**
  * Tự động nhận diện bệnh viện Vinmec gần nhất kèm khoảng cách (km) chính xác; hỗ trợ đổi viện qua dropdown tiện lợi, loại bỏ nút `[✕]` dễ xóa nhầm.
* **AI Clinical Triage Bóc tách Triệu chứng:**
  * Cho phép người bệnh gõ hoặc nói triệu chứng tự nhiên, không giới hạn 120 ký tự.
  * AI bóc tách thực thể lâm sàng, tự động gợi ý chuyên khoa chính xác kèm giải thích lý do và đề xuất bác sĩ phù hợp lịch trực.
* **Thẻ Chuẩn bị Tiền khám Cá nhân hóa (Dynamic Prep Card):**
  * Đồng hồ đếm ngược giờ nhịn ăn theo ca xét nghiệm; nhắc nhở loại thuốc được uống/cần tạm hoãn; chỉ dẫn phòng khám và mã QR tiếp đón nhanh.
* **Bản Tóm tắt Lâm sàng 30 Giây Chuẩn SOAP cho Bác sĩ:**
  * Tự động cấu trúc lời kể bệnh nhân kết hợp bệnh án cũ thành định dạng *Subjective - Objective - Assessment - Plan*, giúp bác sĩ nắm trọn bệnh sử trong 30 giây và giảm tối đa gánh nặng gõ phím EMR.
* **Bộ Ranh giới An toàn & Đạo đức Y tế (Safety Guardrails):**
  * Quét cờ đỏ thời gian thực (đột quỵ FAST, đau ngực cấp, khó thở) để ngắt ngay luồng đặt hẹn sang gọi cấp cứu 115 / Vinmec 24/7.
  * Tuân thủ nghiêm ngặt nguyên tắc: *Triage phân luồng, không chẩn đoán thay bác sĩ, không kê đơn thuốc*.

---

## 5. Cấu trúc Dự án

```text
VM-Proto-1/
├── 01-phong-van/                 # Dữ liệu nghiên cứu người dùng, ghi chép P1, P2, P3, D1
├── 02-journey-map/                # Bản đồ hành trình người bệnh, ảnh screenshot có bounding box
│   ├── screenshot_myvinmec/      # Ảnh chụp thực tế & ảnh phân tích lỗi UI có bounding box chuẩn
│   └── trai-nghiem-app.md        # Đánh giá nhanh trải nghiệm ứng dụng MyVinmec (~250 từ)
├── 03-need-statement/             # Tuyên bố nhu cầu chuẩn Stanford Biodesign
├── 04-best-practice/              # Nghiên cứu 3 mô hình quốc tế (Ada Health, Mayo Clinic, One Medical)
├── 05-prototype/                  # Nguyên mẫu tương tác VinCare Copilot
│   ├── vincare-copilot/          # Mã nguồn Web App (Chế độ xem Bệnh nhân & Bác sĩ)
│   ├── suggest-solution.md       # Bảng tổng hợp tính năng & các điểm ứng dụng AI
│   └── prompt.md                 # System Prompt lâm sàng & Hàng rào an toàn Red Flags
├── 06-rui-ro-dao-duc/             # Quản trị rủi ro an toàn, đạo đức AI & Quy trình ngắt khẩn cấp
├── 07-coach-plan/                 # Kế hoạch dẫn dắt & hỗ trợ sinh viên K4
├── slides.html                    # Bộ slide thuyết trình 5 trang chuẩn A4/Widescreen
├── slides.pdf                     # File PDF slide thuyết trình xuất bản
└── README.md                      # Báo cáo tổng quan dự án
```

---

## 6. Hướng dẫn Chạy Thử Nguyên Mẫu

* **Trải nghiệm trực tuyến trên Vercel (Khuyến nghị – Không cần cài đặt):**
  * 👉 **Live Demo:** [https://vincare-copilot.vercel.app](https://vincare-copilot.vercel.app)
  * Thao tác thử các kịch bản mẫu: Bệnh nhân tiêu hóa (`P1`), Mẹ bỉm sữa (`P2`), Cảnh báo khẩn cấp (Red Flag).
  * Bấm nút **"Góc nhìn Bác sĩ (SOAP 30s)"** ở thanh trên cùng để xem bản tóm tắt hồ sơ tiền khám EMR.
* **Mở trực tiếp trên máy cục bộ:**
  * Truy cập thư mục `05-prototype/vincare-copilot/` và nhấp đúp mở file [index.html](file:///d:/VinUni/Exploration%20Sprint%20Vinmec/VM-Proto-1/05-prototype/vincare-copilot/index.html).
* **Chạy qua máy chủ Node.js cục bộ:**
  ```bash
  cd "05-prototype/vincare-copilot"
  npx serve . -l 3000
  # Mở trình duyệt tại: http://localhost:3000
  ```

---

## 7. Kết luận & Tác động Dự kiến

**VinCare Copilot** chuyển hóa trải nghiệm tiền khám từ thế bị động, rời rạc sang thế chủ động, thông minh:

* **Với Người bệnh:**
  * **100% đúng chuyên khoa:** Bệnh nhân chỉ cần mô tả tự nhiên theo ngôn ngữ đời thường; AI bóc tách thực thể và phân tầng chính xác, chấm dứt nỗi sợ đặt nhầm phòng khám.
  * **Chấm dứt việc hủy xét nghiệm:** Thẻ chuẩn bị tiền khám đếm ngược nhắc nhịn ăn và hướng dẫn uống thuốc mạn tính chuẩn xác trước giờ khám.
  * **An tâm & Chủ động:** Nắm rõ lịch trình, vị trí phòng khám và mã QR Fast-track vào thẳng khu vực thăm khám.
* **Với Bác sĩ Lâm sàng:**
  * **Tiết kiệm >40% thời gian gõ phím EMR:** Đã có bản tóm tắt bệnh sử chuẩn SOAP 30 giây được cấu trúc sẵn trước khi bệnh nhân bước vào phòng.
  * **Nâng cao chất lượng tư vấn:** Trả lại trọn vẹn ca khám tương tác mắt-đối-mắt (từ 55% lên 82%), lắng nghe và thấu cảm người bệnh.
  * **Giảm thiểu nguy cơ kiệt sức (Burnout):** Xóa bỏ gánh nặng nhập liệu hành chính lặp đi lặp lại mỗi ngày.
* **Với Hệ thống Y tế Vinmec:**
  * **Tối ưu hóa công suất vận hành:** Giảm tỷ lệ bệnh nhân đến muộn/trễ hẹn, giảm tải áp lực điều phối tại quầy lễ tân ban đầu.
  * **Đảm bảo an toàn lâm sàng tuyệt đối:** Bộ lọc cờ đỏ (Red Flags) thời gian thực ngăn chặn bỏ sót các ca nguy kịch (đột quỵ FAST, nhồi máu cơ tim).
  * **Nâng tầm thương hiệu y tế số:** Kiến tạo chuẩn mực chăm sóc y tế số cao cấp, hiện đại và chuẩn hóa theo tiêu chuẩn quốc tế (JCI).

> **💡 Thông điệp Kết luận:**  
> *VinCare Copilot không tìm cách thay thế bác sĩ, mà dùng AI để loại bỏ rào cản thao tác, giải phóng bác sĩ khỏi bàn phím và trao lại sự chăm sóc trọn vẹn, thấu cảm cho người bệnh.*