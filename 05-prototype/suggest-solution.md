# ĐỀ XUẤT GIẢI PHÁP: VINCARE COPILOT
**Dự án:** VinUni Exploration Sprint Vinmec  
**Mục tiêu:** Đơn giản hóa quy trình đặt lịch, hạn chế đặt nhầm chuyên khoa, bóc tách triệu chứng lâm sàng và tự động hóa tóm tắt bệnh án cho bác sĩ.  
**Bản chạy thử trực tuyến (Live Demo):** [https://vincare-copilot.vercel.app](https://vincare-copilot.vercel.app)

---

## 1. TỔNG HỢP CÁC TÍNH NĂNG & ĐIỂM ỨNG DỤNG AI

| STT | Phân hệ giải pháp | Chi tiết tính năng | Vị trí ứng dụng AI | Mục tiêu & Giá trị mang lại |
|:---:|:---|:---|:---:|:---|
| **1** | **Bóc tách Triệu chứng & Định tuyến Chuyên khoa** | Bệnh nhân nhập hoặc nói triệu chứng bằng ngôn ngữ tự nhiên; hệ thống tự phân tích và gợi ý bác sĩ. | **[DÙNG AI]**<br>• *NLP Clinical Triage:* Trích xuất thực thể y khoa (vị trí đau, thời gian khởi phát, mức độ).<br>• *Matching Engine:* Suy luận xác suất để đề xuất đúng chuyên khoa và bác sĩ phù hợp. | Loại bỏ việc ép người bệnh tự đoán chuyên khoa; xóa bỏ giới hạn 120 ký tự chật hẹp; tránh đặt sai khoa. |
| **2** | **Quét Cờ Đỏ Khẩn Cấp (Red Flags)** | Tự động phát hiện các triệu chứng nguy kịch trong lời kể của bệnh nhân. | **[DÙNG AI]**<br>• *Semantic Guardrails:* Quét từ khóa và ngữ cảnh nguy kịch (đau ngực dữ dội, dấu hiệu đột quỵ FAST, khó thở cấp). | **Ngắt luồng đặt hẹn ngay lập tức**; kích hoạt cảnh báo đỏ và nút gọi Cấp cứu SOS 1-chạm (115 / Vinmec 24/7). |
| **3** | **Tóm tắt Lâm sàng Chuẩn SOAP cho Bác sĩ** | Màn hình bác sĩ hiển thị sẵn hồ sơ tóm tắt trước khi bắt đầu ca khám. | **[DÙNG AI]**<br>• *SOAP Summarization:* Chuyển đổi lời kể bệnh nhân + bệnh án cũ thành bản tóm tắt chuẩn SOAP (*Subjective - Objective - Assessment - Plan*) trong 30 giây. | Giảm **42% thời gian gõ phím** cho bác sĩ (giải quyết trăn trở của Bác sĩ `D1`); tăng thời gian tương tác trực tiếp với người bệnh. |
| **4** | **Thẻ Chuẩn bị Tiền khám Động (Prep Card)** | Sau khi đặt lịch, app sinh thẻ dặn dò cá nhân hóa thay vì chỉ có mã đặt hẹn đơn thuần. | **[DÙNG AI]**<br>• Tự động tính toán giờ đếm ngược nhịn ăn theo slot xét nghiệm; chỉ dẫn thuốc nào được uống (huyết áp), thuốc nào cần tạm hoãn (tiểu đường). | Chấm dứt cảnh bệnh nhân bị hủy xét nghiệm buổi sáng; không bị lỡ thuốc mạn tính; hướng dẫn luồng Fast-track. |
| **5** | **Giao diện Trang chủ Lưới 2x2 Tinh giản** | Thay thế lưới 12 icon rối rắm bằng 4 nút lớn: *MyVinmec, Lịch hẹn, Cấp cứu SOS, Liên hệ*. | **[THIẾT KẾ UX]** *(Không dùng AI)* | Giảm tải nhận thức; đưa tính năng Cấp cứu lên vị trí nhận diện cao nhất; hỗ trợ vuốt ngang xem tính năng phụ. |
| **6** | **Tự động Định vị Viện gần nhất bằng GPS** | Tự động phát hiện cơ sở Vinmec gần người bệnh nhất kèm khoảng cách (km). | **[HỆ THỐNG / GPS]** *(Không dùng AI)* | Giúp người bệnh chọn viện thuận tiện nhất; tích hợp dropdown linh hoạt, loại bỏ nút `[✕]` dễ bấm nhầm xóa dữ liệu. |
| **7** | **Chuẩn hóa Công thái học & Tiếp cận (Accessibility)** | Toàn bộ nút bấm có kích thước $\ge$ 48dp, khoảng cách an toàn $\ge$ 12px, độ tương phản text chuẩn WCAG AAA. | **[THIẾT KẾ UI]** *(Không dùng AI)* | Khắc phục lỗi cắt xén chân chữ tiếng Việt (`bác sĩ`, `chuyên khoa`); thân thiện với người cao tuổi và người run tay. |

---

## 2. CHI TIẾT 3 MÔ HÙNG LÂM SÀNG CỐT LÕI (AI CORE WORKFLOWS)

### A. Phía Bệnh nhân: Luồng Sàng lọc & Đặt khám Thông minh
```
[Bệnh nhân gõ/nói triệu chứng tự nhiên] 
         │
         ▼
[AI NLP Clinical Triage] ───(Phát hiện Red Flag?)──► [CẢNH BÁO ĐỎ: Gọi SOS Cấp cứu 115 / Vinmec]
         │ (An toàn)
         ▼
[Đề xuất Chuyên khoa & Bác sĩ phù hợp]
         │
         ▼
[Xác nhận Lịch hẹn & Cơ sở theo GPS]
         │
         ▼
[AI sinh Thẻ Chuẩn bị Tiền khám: Đếm ngược nhịn ăn + Chỉ dẫn thuốc + QR Fast-track]
```

### B. Phía Bác sĩ: Luồng Hỗ trợ Lâm sàng (Clinical Decision Support)
```
[Bệnh nhân xác nhận đặt khám thành công]
         │
         ▼
[AI bóc tách dữ liệu tiền khám + Lịch sử EMR cũ]
         │
         ▼
[Sinh Bản Tóm Tắt Lâm Sàng Chuẩn SOAP (30 giây)]:
  • S (Subjective): Lời kể triệu chứng, thời gian khởi phát, mức độ đau.
  • O (Objective): Tiền sử dị ứng, chỉ số sinh tồn và đơn thuốc cũ.
  • A (Assessment): Nhận định sơ bộ của hệ thống điều phối.
  • P (Plan): Đề xuất xét nghiệm ban đầu chờ bác sĩ phê duyệt.
         │
         ▼
[Bác sĩ vào phòng khám: Đọc nhanh 30s -> Khám tập trung mắt-đối-mắt với bệnh nhân]
```

---

## 3. NGUYÊN TẮC AN TOÀN & RANH GIỚI ĐẠO ĐỨC (SAFETY GUARDRAILS)
1. **Triage, Không Phán đoán Bệnh (No Definitive Diagnosis):** AI chỉ đóng vai trò trợ lý điều phối luồng khám và giải thích lý do gợi ý chuyên khoa, tuyệt đối không kết luận bệnh thay bác sĩ.
2. **Không Kê đơn Thuốc (No Prescription):** AI tuyệt đối không kê đơn thuốc mới hoặc đổi liều lượng thuốc của người bệnh.
3. **Quyền Quyết định 100% thuộc Bác sĩ:** Bản tóm tắt SOAP và các đề xuất xét nghiệm chỉ mang tính chất tham khảo chuẩn bị; bác sĩ trực tiếp khám là người quyết định y khoa cuối cùng.
