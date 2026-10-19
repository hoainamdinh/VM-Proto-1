# TUYÊN BỐ NHU CẦU (NEED STATEMENT)
**Định hướng thiết kế:** Đơn giản hóa đặt lịch, tránh nhầm chuyên khoa, phân rã triệu chứng lâm sàng và hỗ trợ bác sĩ với bệnh án cũ.

---

## 1. Tuyên bố Nhu cầu Cốt lõi (Core Need Statement)

> ### **"Giải pháp đơn giản hóa quy trình đặt lịch khám ngoại trú, loại bỏ nguy cơ chọn nhầm chuyên khoa bằng việc tự động bóc tách lý do khám và điều hướng bác sĩ phù hợp; đồng thời sau khi xác nhận đặt lịch, tự động phân rã các biểu hiện/triệu chứng lâm sàng, tổng hợp danh mục công việc cho bác sĩ và tích hợp kèm bệnh án cũ của bệnh nhân nhằm tối ưu hóa thời gian và chất lượng buổi khám."**

---

## 2. Bóc tách 2 Giai đoạn Nhu cầu Chính

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. TRƯỚC KHI ĐẶT LỊCH (Pre-Booking: Triage & Doctor Routing)                                │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ • Người bệnh mô tả tự nhiên cảm giác khó chịu (không bắt người bệnh tự chẩn đoán).         │
│ • Hệ thống tự động bóc tách lý do khám ban đầu, loại bỏ nguy cơ đặt nhầm chuyên khoa.       │
│ • Đề xuất đúng chuyên khoa và gợi ý (route & recommend) danh sách bác sĩ chuyên môn sâu     │
│   phù hợp nhất cùng khung giờ trống tại cơ sở mong muốn.                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ [Người bệnh bấm Xác nhận Đặt lịch]
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. SAU KHI XÁC NHẬN ĐẶT LỊCH (Post-Booking: Clinical Prep & Handover)                       │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ • Phân rã lý do khám thành cấu trúc lâm sàng rõ ràng (vị trí đau, tính chất, thời gian,     │
│   mức độ khó chịu, các triệu chứng đi kèm và yếu tố tăng giảm).                             │
│ • Tổng hợp công việc cho bác sĩ: Tạo sẵn danh mục nhiệm vụ, câu hỏi trọng tâm cần kiểm tra  │
│   và các chỉ định cận lâm sàng dự kiến (giúp bác sĩ nắm bắt ca bệnh trong 30 giây).         │
│ • Trích xuất và đưa ra kèm bệnh án cũ: Tự động đối chiếu lịch sử khám, chẩn đoán cũ,       │
│   đơn thuốc đã dùng và tiền sử dị ứng tại Vinmec để bác sĩ không phải hỏi lại từ đầu.      │
│ • Thẻ hướng dẫn tiền khám cho người bệnh: Nhịn ăn 8h, chỉ dẫn thuốc mạn tính, đường đi.     │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Ba Thành phần Cốt lõi theo Chuẩn Biodesign

| Thành phần | Nội dung cụ thể |
| :--- | :--- |
| **Vấn đề (Problem)** | Người bệnh bối rối tự chọn chuyên khoa và gõ lý do khám cụt lủn; bác sĩ thiếu thông tin có cấu trúc và phải tra hỏi lại từ đầu trong khi bệnh án cũ chưa được đối chiếu nhanh. |
| **Đối tượng (Population)** | Người bệnh đi khám ngoại trú tại Hệ thống Y tế Vinmec và Bác sĩ chuyên khoa tiếp nhận ca khám. |
| **Kết quả mong muốn (Outcome)** | Đặt lịch nhanh chóng không nhầm khoa, chọn đúng bác sĩ phù hợp; bác sĩ có sẵn bản phân rã triệu chứng, checklist công việc và hồ sơ bệnh án cũ để khám chính xác, tiết kiệm 50% thời gian nhập liệu. |

---

## 4. Các câu hỏi Định hướng Giải pháp (How Might We - HMW)

1. **HMW - Bóc tách lý do khám & Gợi ý bác sĩ:**  
   *Làm thế nào để hệ thống tự động bóc tách ngôn ngữ tự nhiên của người bệnh thành lý do khám chuẩn xác, tránh nhầm khoa và gợi ý danh sách bác sĩ phù hợp nhất để họ đặt lịch trong 1 chạm?*

2. **HMW - Phân rã triệu chứng & Tổng hợp công việc cho bác sĩ:**  
   *Làm thế nào để ngay khi xác nhận đặt lịch, hệ thống tự động phân rã biểu hiện lâm sàng và tổng hợp sẵn checklist công việc cụ thể cho bác sĩ trước giờ khám?*

3. **HMW - Tích hợp bệnh án cũ thông minh:**  
   *Làm thế nào để kết nối và làm nổi bật các thông tin quan trọng từ bệnh án cũ của bệnh nhân (kết quả cận lâm sàng trước, đơn thuốc cũ, dị ứng) cạnh triệu chứng mới để bác sĩ đối chiếu tức thì?*
