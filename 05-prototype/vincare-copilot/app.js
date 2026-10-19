/**
 * VinCare Copilot - Core Interactive Triage & Clinical Preparation Engine
 * Handles symptom parsing, doctor recommendation, dynamic pre-visit guidance,
 * symptom deconstruction, doctor task checklist & past EMR integration.
 */

// Global State
const appState = {
  currentView: 'patient',
  patientScreen: 'home', // 'home' | 'booking'
  isAnalyzing: false,
  activeScenario: 'p1',
  currentResult: null,
  selectedDoctorIndex: 0,
  selectedSlot: null
};

// Pre-configured Clinical Scenarios based on User Research (P1, P2, P3, Red-Flag)
const scenarios = {
  p1: {
    name: 'Anh Thế (P1)',
    age: 27,
    gender: 'Nam',
    facility: 'Times City',
    symptomText: 'Chào trợ lý, 3 hôm nay mình hay bị đau tức âm ỉ ở phần bụng trên rốn, nhất là sau khi ăn trưa xong thì rất đầy hơi và ợ chua, thi thoảng buồn nôn khó chịu. Sáng mai mình muốn đi khám tại Vinmec Times City thì nên đăng ký khoa nào và có cần nhịn ăn sáng không?',
    isEmergency: false,
    triageLevel: 'Routine (Khám Tiêu Chuẩn)',
    department: 'Nội Tiêu hóa & Gan mật',
    facilityDesc: 'Vinmec Times City • Tầng 2, Khu Khám Ngoại trú Tiêu hóa',
    rationale: 'Các triệu chứng đau tức âm ỉ vùng thượng vị sau ăn, kèm ợ chua và đầy trướng bụng là dấu hiệu điển hình của kích ứng niêm mạc dạ dày - thực quản. Chuyên khoa Nội Tiêu hóa là nơi chuyên sâu để thăm khám lâm sàng, nội soi và kiểm tra vi khuẩn HP.',
    fastingRequired: true,
    fastingHeadline: 'Yêu cầu nhịn ăn: 08 tiếng trước giờ khám',
    fastingNote: 'Cần nhịn ăn thức ăn đặc từ 00:00 đêm nay để sẵn sàng cho chỉ định xét nghiệm sinh hóa máu hoặc nội soi dạ dày.',
    waterRule: 'Được phép uống nước lọc tinh khiết với ngụm nhỏ (tối đa 100ml). Không uống sữa, nước ngọt hoặc cà phê.',
    medGuidance: 'Hiện tại bạn chưa dùng thuốc mạn tính đặc biệt. Hãy mang theo các loại men vi sinh hoặc thuốc đã tự mua uống ở nhà.',
    wayfinding: 'Đến Sảnh chính Bệnh viện Vinmec Times City -> Di chuyển lên Tầng 2 -> Vào Quầy Lễ tân số 03 (Làn Fast-track ưu tiên tiếp nhận hồ sơ đã qua VinCare Copilot).',
    
    // 1. Recommended Doctors for Routing
    doctors: [
      {
        id: 'doc-p1-1',
        name: 'BS CKII. Trần Quang Minh',
        title: 'Trưởng đơn nguyên Nội soi Tiêu hóa',
        exp: '18 năm kinh nghiệm',
        matchRate: '98%',
        avatarText: 'QM',
        subspecialty: 'Chuyên sâu: Bệnh lý dạ dày - tá tràng, trào ngược GERD & Nội soi can thiệp không đau',
        slots: ['08:30 (Sáng mai)', '09:15', '10:30', '14:00'],
        defaultSlot: '08:30 (Sáng mai)'
      },
      {
        id: 'doc-p1-2',
        name: 'ThS.BS. Nguyễn Bích Thủy',
        title: 'Bác sĩ Nội Tiêu hóa & Gan mật',
        exp: '12 năm kinh nghiệm',
        matchRate: '94%',
        avatarText: 'BT',
        subspecialty: 'Chuyên sâu: Rối loạn tiêu hóa chức năng, tiệt trừ vi khuẩn HP kháng thuốc',
        slots: ['09:00 (Sáng mai)', '11:00', '15:15'],
        defaultSlot: '09:00 (Sáng mai)'
      }
    ],

    // 2. Clinical Symptom Breakdown
    symptomBreakdown: [
      { label: 'Triệu chứng chính (Chief Complaint)', value: 'Đau tức vùng thượng vị kèm ợ chua và đầy trướng bụng' },
      { label: 'Thời gian khởi phát (Onset)', value: '3 ngày trước, có xu hướng tăng dần về tần suất' },
      { label: 'Vị trí & Lan truyền (Location)', value: 'Vùng thượng vị (trên rốn), lan nhẹ lên sau xương ức' },
      { label: 'Tính chất cơn đau (Character)', value: 'Đau âm ỉ, cảm giác cồn cào và nóng rát niêm mạc' },
      { label: 'Yếu tố tăng / giảm (Triggers)', value: 'Tăng rõ sau khi ăn trưa no; đỡ nhẹ khi uống nước ấm' },
      { label: 'Triệu chứng kèm theo (Associated)', value: 'Ợ hơi, ợ chua, buồn nôn nhẹ. Không sốt, không nôn máu' },
      { label: 'Tự xử trí tại nhà (Self-medication)', value: 'Tự mua men vi sinh uống 2 ngày nhưng không đỡ' }
    ],

    // 3. Action Tasks for Doctor
    doctorTasks: [
      { id: 1, text: 'Hỏi 2 dấu hiệu báo động: Sụt cân đột ngột không rõ nguyên nhân & nôn máu/đi ngoài phân đen', done: false, priority: 'high' },
      { id: 2, text: 'Thăm khám bụng: Ấn điểm đau thượng vị, kiểm tra phản ứng thành bụng, nghiệm pháp Murphy', done: false, priority: 'high' },
      { id: 3, text: 'Xác nhận trạng thái nhịn ăn: Đã nhịn ăn 8h đủ điều kiện để thực hiện nội soi EGD & xét nghiệm máu ngay', done: true, priority: 'normal' },
      { id: 4, text: 'Chỉ định cận lâm sàng: Nội soi thực quản - dạ dày (EGD) tiền mê + Test vi khuẩn HP qua sinh thiết', done: false, priority: 'high' },
      { id: 5, text: 'Chỉ định cận lâm sàng: Tổng phân tích tế bào máu ngoại vi (CBC) & Định lượng men gan (AST, ALT)', done: false, priority: 'normal' },
      { id: 6, text: 'Kê đơn & tư vấn: Hướng dẫn chế độ ăn tránh đồ chua cay, cà phê, kiểm soát stress công việc văn phòng', done: false, priority: 'normal' }
    ],

    // 4. Historical EMR Records
    pastEMR: {
      recordCode: 'EMR-VM-2025-4128',
      patientCode: 'VM-2024-5182',
      lastVisit: '15/04/2025 (Cách đây 6 tháng)',
      facility: 'Vinmec Times City - Khám Ngoại trú Tổng quát',
      attendingDoctor: 'BS CKI. Vũ Thị Mai',
      diagnosis: 'Viêm dạ dày dạng trợt nhẹ (trào ngược thực quản độ A); Gan nhiễm mỡ nhẹ độ 1',
      tests: 'Nội soi EGD (15/04/2025): Niêm mạc hang vị phù nề xung huyết nhẹ, test HP âm tính (-). Siêu âm ổ bụng: Gan tăng âm nhẹ.',
      prescription: 'Phosphalugel 20g (uống 1 gói x 2 lần/ngày x 14 ngày), Silymarin 140mg (1 viên x 2 lần/ngày).',
      allergies: 'Chưa ghi nhận dị ứng thuốc (Allergy: None)',
      clinicalComparison: 'Triệu chứng đau tức thượng vị và ợ chua đợt này tái phát sau 6 tháng kết thúc đơn Phosphalugel. Lần khám trước test HP âm tính. Khuyến nghị nội soi lại kiểm tra biến chuyển niêm mạc và làm lại test HP.'
    },

    soap: {
      cc: 'Đau tức vùng thượng vị kèm ợ chua và đầy trướng bụng 3 ngày nay.',
      hpi: 'Bệnh nhân nam, 27 tuổi, khởi phát đau âm ỉ thượng vị cách đây 3 ngày. Đau tăng sau ăn no, kèm theo ợ hơi, ợ chua, cảm giác nóng rát sau xương ức nhẹ. Không sốt, không nôn ra máu, đại tiện bình thường.',
      history: 'Tiền sử viêm trợt dạ dày nhẹ cách đây 6 tháng (EMR-2025-4128). Không tiền sử dị ứng thuốc.',
      meds: 'Chưa dùng thuốc điều trị dạ dày theo đơn đợt này, tự uống men vi sinh không giảm.',
      assessment: 'Theo dõi Hội chứng khó tiêu chức năng (Functional Dyspepsia) / Đợt cấp Viêm dạ dày tá tràng tái phát.',
      orders: [
        'Nội soi thực quản - dạ dày - tá tràng (EGD) tiền mê & Test vi khuẩn HP (Bệnh nhân đã nhịn ăn đủ điều kiện).',
        'Tổng phân tích tế bào máu ngoại vi (CBC).',
        'Siêu âm ổ bụng tổng quát loại trừ bệnh lý gan mật tụy.'
      ]
    }
  },

  p2: {
    name: 'Bé Minh (Con chị Mai - P2)',
    age: 3,
    gender: 'Nam',
    facility: 'Times City',
    symptomText: 'Bé nhà mình 3 tuổi, đêm qua sốt 38.8 độ C, sáng nay vẫn nóng đầu kèm ho đờm và sổ mũi, sáng dậy nôn trớ 1 lần sau khi uống nước. Giờ bé quấy khóc nhiều. Cho tôi hỏi nên khám chuyên khoa Nhi nào ở Times City và con có phải nhịn ăn để xét nghiệm máu không?',
    isEmergency: false,
    triageLevel: 'Urgent (Khám Ưu Tiên Buổi Sáng)',
    department: 'Chuyên khoa Nhi (Nhi Hô hấp & Tổng quát)',
    facilityDesc: 'Vinmec Times City • Tầng 1, Khu Khám Nhi & Sơ sinh',
    rationale: 'Trẻ 3 tuổi có sốt cao kèm ho đờm và nôn trớ cần được bác sĩ Nhi khoa đánh giá thể trạng toàn diện, nghe phổi và kiểm tra họng để phân biệt nhiễm khuẩn đường hô hấp hoặc viêm phế quản.',
    fastingRequired: false,
    fastingHeadline: 'Lưu ý dinh dưỡng: KHÔNG BẮT TRẺ NHỊN ĂN HOÀN TOÀN',
    fastingNote: 'Với trẻ nhỏ 3 tuổi đang sốt, nhịn đói kéo dài dễ gây hạ đường huyết và mất nước. Cho bé uống nước ấm, oresol hoặc sữa từng ngụm nhỏ.',
    waterRule: 'Khuyến khích bù nước oresol pha đúng tỷ lệ hoặc nước ấm. Nếu cần lấy máu, điều dưỡng Nhi sẽ có quy trình hỗ trợ riêng.',
    medGuidance: 'Nếu bé sốt trên 38.5 độ C, tiếp tục cho bé uống hạ sốt Paracetamol theo đúng liều lượng cân nặng (10-15mg/kg/lần cách nhau 4-6h). Ghi lại giờ uống thuốc gần nhất.',
    wayfinding: 'Đến Sảnh đón Bệnh viện Vinmec -> Đi thẳng vào Khu Tiếp đón Nhi khoa tại Tầng 1 (Khu vực có sân chơi trẻ em) -> Báo với điều dưỡng tiếp đón mã ưu tiên.',
    
    doctors: [
      {
        id: 'doc-p2-1',
        name: 'BS CKI. Lê Thu Hà',
        title: 'Bác sĩ Chuyên khoa Nhi Hô hấp',
        exp: '15 năm kinh nghiệm',
        matchRate: '97%',
        avatarText: 'TH',
        subspecialty: 'Chuyên sâu: Nhiễm khuẩn hô hấp trẻ em, viêm phế quản co thắt & hen phế quản',
        slots: ['08:30 (Sáng mai)', '09:30', '10:45'],
        defaultSlot: '08:30 (Sáng mai)'
      },
      {
        id: 'doc-p2-2',
        name: 'ThS.BS. Vũ Hoàng Anh',
        title: 'Bác sĩ Nhi Tổng quát & Sơ sinh',
        exp: '10 năm kinh nghiệm',
        matchRate: '93%',
        avatarText: 'HA',
        subspecialty: 'Chuyên sâu: Bệnh truyền nhiễm trẻ em, xử trí sốt co giật & tiêu hóa nhi',
        slots: ['09:00 (Sáng mai)', '11:15', '14:30'],
        defaultSlot: '09:00 (Sáng mai)'
      }
    ],

    symptomBreakdown: [
      { label: 'Triệu chứng chính (Chief Complaint)', value: 'Trẻ 3 tuổi sốt cao 38.8°C, ho đờm và nôn trớ 1 lần' },
      { label: 'Thời gian khởi phát (Onset)', value: 'Đêm qua (khoảng 8 tiếng trước)' },
      { label: 'Vị trí tổn thương (Location)', value: 'Đường hô hấp trên, họng đỏ, mũi chảy dịch trong' },
      { label: 'Tính chất cơn sốt (Character)', value: 'Sốt cao thành cơn, đáp ứng hạ sốt kém, quấy khóc nhiều' },
      { label: 'Yếu tố tăng / giảm (Triggers)', value: 'Nôn sau khi uống nước nhanh; ho tăng khi nằm ngủ' },
      { label: 'Triệu chứng kèm theo (Associated)', value: 'Ho lọc sọc đờm, chảy nước mũi trong, mắt lờ đờ' },
      { label: 'Tự xử trí tại nhà (Self-medication)', value: 'Mẹ đã cho uống 1 gói Hapacol 150mg lúc 05:00 sáng nay' }
    ],

    doctorTasks: [
      { id: 1, text: 'Khám soi tai mũi họng: Đánh giá màng nhĩ, niêm mạc họng, amiđan có mủ/giả mạc không', done: false, priority: 'high' },
      { id: 2, text: 'Nghe phổi kỹ 2 phế trường: Tìm ran ẩm, ran rít phế quản, đánh giá rút lõm lồng ngực', done: false, priority: 'high' },
      { id: 3, text: 'Đánh giá dấu hiệu mất nước: Độ chun giãn da, niêm mạc môi lưỡi, mắt trũng', done: false, priority: 'high' },
      { id: 4, text: 'Chỉ định xét nghiệm: CBC và CRP đánh giá mức độ nhiễm khuẩn hay virus', done: false, priority: 'normal' },
      { id: 5, text: 'Hướng dẫn mẹ cách bù nước oresol, lau mát và dấu hiệu cảnh báo cần tái khám khẩn', done: false, priority: 'high' }
    ],

    pastEMR: {
      recordCode: 'EMR-VM-2025-9921',
      patientCode: 'VM-2023-1189',
      lastVisit: '10/01/2026 (Cách đây 9 tháng)',
      facility: 'Vinmec Times City - Phòng khám Nhi',
      attendingDoctor: 'BS CKI. Lê Thu Hà',
      diagnosis: 'Viêm mũi họng cấp do virus',
      tests: 'Test nhanh cúm A/B âm tính (-). Họng đỏ nhẹ.',
      prescription: 'Xịt mũi nước muối biển sâu, Siro ho Prospan, Oresol vị cam.',
      allergies: 'Chưa ghi nhận tiền sử dị ứng thuốc hay thực phẩm.',
      clinicalComparison: 'Trẻ có cơ địa viêm đường hô hấp trên khi giao mùa. Đợt này sốt cao hơn (38.8°C so với 38.2°C đợt trước) và có nôn trớ, cần loại trừ viêm phế quản hoặc nhiễm trùng đường ruột phối hợp.'
    },

    soap: {
      cc: 'Trẻ 3 tuổi sốt cao 38.8°C, ho đờm và nôn trớ 1 lần.',
      hpi: 'Bệnh nhi nam, 3 tuổi, khởi phát sốt cao từ đêm qua (nhiệt độ cao nhất 38.8°C), mẹ đã cho hạ sốt paracetamol hạ về 37.8°C sau đó sốt lại. Kèm theo ho lọc sọc đờm, chảy nước mũi trong, nôn 1 lần sau uống nước.',
      history: 'Sinh đủ tháng, tiêm chủng đầy đủ theo lứa tuổi. Chưa ghi nhận tiền sử co giật do sốt.',
      meds: 'Đã dùng 1 gói Hapacol 150mg lúc 05:00 sáng nay.',
      assessment: 'Theo dõi Nhiễm khuẩn đường hô hấp trên cấp / Viêm phế quản cấp ở trẻ nhỏ. Chưa có dấu hiệu suy hô hấp.',
      orders: [
        'Khám tai mũi họng & nghe phổi chuyên khoa Nhi.',
        'Tổng phân tích tế bào máu ngoại vi (CBC) & Định lượng CRP đánh giá mức độ viêm.',
        'Test nhanh virus cúm A/B / RSV (nếu bác sĩ yêu cầu).'
      ]
    }
  },

  p3: {
    name: 'Bác Hùng (P3)',
    age: 58,
    gender: 'Nam',
    facility: 'Times City',
    symptomText: 'Tôi 58 tuổi, dạo này khớp gối phải sưng đau nhiều nhất là khi leo cầu thang, đi lại nghe thấy tiếng kêu lạo xạo bên trong khớp. Tôi có tiền sử tăng huyết áp đang uống thuốc Amlodipine 5mg hàng ngày. Cho tôi hỏi nên khám khoa nào và sáng mai có được uống thuốc huyết áp không?',
    isEmergency: false,
    triageLevel: 'Routine (Khám Tiêu Chuẩn)',
    department: 'Nội Cơ Xương Khớp',
    facilityDesc: 'Vinmec Times City • Tầng 2, Khu Chuyên khoa Cơ Xương Khớp',
    rationale: 'Triệu chứng đau khớp gối tăng khi vận động/leo cầu thang kèm tiếng lạo xạo là biểu hiện điển hình của thoái hóa khớp gối (Osteoarthritis). Bác nên khám tại khoa Nội Cơ Xương Khớp thay vì Chấn thương chỉnh hình để được điều trị bảo tồn đúng cách.',
    fastingRequired: true,
    fastingHeadline: 'Yêu cầu nhịn ăn: 08 tiếng trước giờ khám',
    fastingNote: 'Cần nhịn ăn sáng để xét nghiệm acid uric máu, sinh hóa máu và đánh giá viêm khớp.',
    waterRule: 'Được uống 1 ngụm nước lọc nhỏ để uống thuốc huyết áp vào sáng sớm.',
    medGuidance: 'LƯU Ý CỰC KỲ QUAN TRỌNG: Bác HÃY UỐNG viên thuốc hạ huyết áp Amlodipine 5mg đúng giờ như thường lệ vào sáng sớm với một ngụm nước lọc nhỏ. Tuyệt đối không tự ý nhịn thuốc huyết áp!',
    wayfinding: 'Vào Sảnh chính Vinmec Times City -> Đi thang máy lên Tầng 2 -> Vào Quầy Tiếp đón số 03 -> Bác báo mã khám để được hỗ trợ xe lăn nếu khớp gối đau nhiều.',
    
    doctors: [
      {
        id: 'doc-p3-1',
        name: 'PGS.TS.BS. Đặng Quốc Hùng',
        title: 'Chuyên gia Cấp cao Cơ Xương Khớp',
        exp: '25 năm kinh nghiệm',
        matchRate: '98%',
        avatarText: 'QH',
        subspecialty: 'Chuyên sâu: Thoái hóa khớp gối, viêm khớp dạng thấp & tiêm huyết tương giàu tiểu cầu (PRP)',
        slots: ['08:30 (Sáng mai)', '10:00', '14:30'],
        defaultSlot: '08:30 (Sáng mai)'
      },
      {
        id: 'doc-p3-2',
        name: 'BS CKII. Phạm Mai Lan',
        title: 'Bác sĩ Nội Cơ Xương Khớp',
        exp: '16 năm kinh nghiệm',
        matchRate: '95%',
        avatarText: 'ML',
        subspecialty: 'Chuyên sâu: Bệnh lý thoái hóa sụn khớp, loãng xương & điều trị bảo tồn đa mô thức',
        slots: ['09:15 (Sáng mai)', '11:00', '15:00'],
        defaultSlot: '09:15 (Sáng mai)'
      }
    ],

    symptomBreakdown: [
      { label: 'Triệu chứng chính (Chief Complaint)', value: 'Đau khớp gối phải khi leo cầu thang kèm tiếng kêu lạo xạo' },
      { label: 'Thời gian khởi phát (Onset)', value: '2 tuần nay, mức độ đau tăng dần khi đi lại' },
      { label: 'Vị trí tổn thương (Location)', value: 'Khớp gối phải, mặt trước trong khớp' },
      { label: 'Tính chất cơn đau (Character)', value: 'Đau âm ỉ khi chịu lực, cứng khớp buổi sáng khoảng 10-15 phút' },
      { label: 'Yếu tố tăng / giảm (Triggers)', value: 'Tăng rõ rệt khi leo cầu thang, ngồi xổm; giảm khi nghỉ ngơi' },
      { label: 'Triệu chứng kèm theo (Associated)', value: 'Tiếng kêu lạo xạo khi gập duỗi khớp, không sưng nóng đỏ cấp' },
      { label: 'Tự xử trí tại nhà (Self-medication)', value: 'Đang duy trì uống thuốc huyết áp Amlodipine 5mg buổi sáng' }
    ],

    doctorTasks: [
      { id: 1, text: 'Đo huyết áp tại quầy trước khám: Kiểm tra tuân thủ uống thuốc hạ huyết áp sáng nay', done: false, priority: 'high' },
      { id: 2, text: 'Khám khớp gối phải: Dấu hiệu bào gỗ, dấu hiệu bập bềnh xương bánh chè, đo tầm vận động', done: false, priority: 'high' },
      { id: 3, text: 'Chỉ định X-quang khớp gối phải tư thế thẳng - nghiêng có chịu lực', done: false, priority: 'high' },
      { id: 4, text: 'Chỉ định Siêu âm khớp gối: Đánh giá dịch màng hoạt dịch và độ dày sụn khớp', done: false, priority: 'normal' },
      { id: 5, text: 'Chỉ định sinh hóa máu: Định lượng Acid Uric, CRP, ESR loại trừ Gout và viêm khớp', done: false, priority: 'normal' },
      { id: 6, text: 'Tư vấn phác đồ tiêm PRP hoặc bổ sung chất nhờn Axit Hyaluronic, hạn chế leo cầu thang', done: false, priority: 'normal' }
    ],

    pastEMR: {
      recordCode: 'EMR-VM-2025-1044',
      patientCode: 'VM-2021-3092',
      lastVisit: '20/07/2025 (Cách đây 15 tháng)',
      facility: 'Vinmec Times City - Phòng khám Tim mạch & Nội tiết',
      attendingDoctor: 'TS.BS. Trần Đức Long',
      diagnosis: 'Tăng huyết áp nguyên phát độ 1',
      tests: 'Huyết áp kiểm soát ổn định 125/80 mmHg. Điện tâm đồ bình thường. Siêu âm tim chức năng tâm thu thất trái bảo tồn.',
      prescription: 'Amlodipine 5mg (1 viên uống sáng hàng ngày sau ăn).',
      allergies: 'Chưa ghi nhận dị ứng thuốc.',
      clinicalComparison: 'Huyết áp được kiểm soát tốt với Amlodipine 5mg. Xuất hiện vấn đề thoái hóa khớp gối mới, lưu ý tránh dùng thuốc giảm đau nhóm NSAIDs kéo dài vì nguy cơ làm tăng huyết áp và ảnh hưởng chức năng thận.'
    },

    soap: {
      cc: 'Đau tức khớp gối phải khi leo cầu thang kèm tiếng kêu lạo xạo.',
      hpi: 'Bệnh nhân nam, 58 tuổi, có biểu hiện đau âm ỉ khớp gối phải 2 tuần nay, tăng dần khi đứng lâu, đi bộ hoặc leo cầu thang. Kèm theo cứng khớp buổi sáng khoảng 10-15 phút, khi cử động nghe tiếng lạo xạo. Không có sưng nóng đỏ cấp tính.',
      history: 'Tiền sử Tăng huyết áp 5 năm, duy trì huyết áp mục tiêu 130/80 mmHg. Không tiền sử chấn thương khớp gối.',
      meds: 'Đang dùng Amlodipine 5mg: 01 viên uống buổi sáng.',
      assessment: 'Theo dõi Thoái hóa khớp gối phải (Knee Osteoarthritis) độ II-III / Tăng huyết áp nguyên phát.',
      orders: [
        'Chụp X-quang khớp gối phải thẳng - nghiêng có chịu lực.',
        'Siêu âm khớp gối khảo sát tràn dịch và màng hoạt dịch.',
        'Sinh hóa máu: Định lượng Acid Uric, Tốc độ máu lắng (沉 - ESR), CRP.'
      ]
    }
  },

  emergency: {
    name: 'Bệnh nhân Khẩn cấp (Red-Flag)',
    age: 62,
    gender: 'Nam',
    facility: 'Times City',
    symptomText: 'Bố tôi 62 tuổi tự nhiên kêu đau thắt ngực dữ dội như có đá đè nặng sau xương ức, cơn đau lan lên cằm và cánh tay trái, vã mồ hôi hột và khó thở. Cho tôi đặt lịch bác sĩ tim mạch vào 10h sáng nay.',
    isEmergency: true,
    emergencyReason: 'DẤU HIỆU CẢNH BÁO NGUY CƠ NHỒI MÁU CƠ TIM CẤP (ACUTE MYOCARDIAL INFARCTION)!',
    triageLevel: 'Emergency (Cấp Cứu Tối Khẩn)'
  }
};

// ==========================================================================
// VINMEC FACILITY NETWORK & GPS DISCOVERY ENGINE
// ==========================================================================
const vinmecFacilities = [
  {
    id: 'Times City',
    code: 'VM-TC',
    name: 'BV ĐKQT Vinmec Times City (Hà Nội)',
    shortName: 'Vinmec Times City',
    region: 'hanoi',
    address: '458 Minh Khai, Q. Hai Bà Trưng, Hà Nội',
    lat: 20.9945,
    lng: 105.8678,
    isJci: true,
    hasEmergency: true,
    desc: 'Vinmec Times City • Tầng 2, Khu Ngoại trú',
    phone: '024 3974 3556'
  },
  {
    id: 'Smart City',
    code: 'VM-SC',
    name: 'BV ĐKQT Vinmec Smart City (Hà Nội)',
    shortName: 'Vinmec Smart City',
    region: 'hanoi',
    address: 'KĐT Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    lat: 20.9997,
    lng: 105.7483,
    isJci: true,
    hasEmergency: true,
    desc: 'Vinmec Smart City • Tầng 1, Khu Tiếp đón thông minh',
    phone: '024 3974 3558'
  },
  {
    id: 'Metropolis',
    code: 'VM-MET',
    name: 'PK ĐKQT Vinmec Metropolis Liễu Giai',
    shortName: 'Vinmec Metropolis',
    region: 'hanoi',
    address: 'Tầng 1, Tòa M1 Vinhomes Metropolis, 29 Liễu Giai, Ba Đình, Hà Nội',
    lat: 21.0318,
    lng: 105.8164,
    isJci: false,
    hasEmergency: false,
    desc: 'Vinmec Metropolis • Tầng 1, Khu Khám Đa khoa',
    phone: '024 3822 5353'
  },
  {
    id: 'Royal City',
    code: 'VM-RC',
    name: 'PK ĐKQT Vinmec Royal City (Hà Nội)',
    shortName: 'Vinmec Royal City',
    region: 'hanoi',
    address: 'Tầng 1, Tòa R2 Vinhomes Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội',
    lat: 20.9972,
    lng: 105.8184,
    isJci: false,
    hasEmergency: false,
    desc: 'Vinmec Royal City • Tầng 1, Khu Khám Đa khoa',
    phone: '024 6664 6868'
  },
  {
    id: 'Central Park',
    code: 'VM-CP',
    name: 'BV ĐKQT Vinmec Central Park (TP.HCM)',
    shortName: 'Vinmec Central Park',
    region: 'hcm',
    address: '208 Nguyễn Hữu Cảnh, Phường 22, Q. Bình Thạnh, TP.HCM',
    lat: 10.7932,
    lng: 106.7215,
    isJci: true,
    hasEmergency: true,
    desc: 'Vinmec Central Park • Tầng 1, Khu Đón tiếp JCI',
    phone: '028 3622 1166'
  },
  {
    id: 'Sai Gon',
    code: 'VM-SG',
    name: 'PK ĐKQT Vinmec Sài Gòn (Quận 1, TP.HCM)',
    shortName: 'Vinmec Sài Gòn (Q.1)',
    region: 'hcm',
    address: '2-2 Bis Trần Cao Vân, Đa Kao, Quận 1, TP.HCM',
    lat: 10.7845,
    lng: 106.6967,
    isJci: false,
    hasEmergency: false,
    desc: 'Vinmec Sài Gòn • Phòng khám Đa khoa Quốc tế',
    phone: '028 3520 3388'
  },
  {
    id: 'Da Nang',
    code: 'VM-DN',
    name: 'BV ĐKQT Vinmec Đà Nẵng',
    shortName: 'Vinmec Đà Nẵng',
    region: 'central',
    address: 'Đường 30 Tháng 4, KDC 4 Nguyễn Tri Phương, Hải Châu, Đà Nẵng',
    lat: 16.0392,
    lng: 108.2173,
    isJci: true,
    hasEmergency: true,
    desc: 'Vinmec Đà Nẵng • Tầng 1, Sảnh Chính Tiếp đón',
    phone: '0236 3711 111'
  },
  {
    id: 'Nha Trang',
    code: 'VM-NT',
    name: 'BV ĐKQT Vinmec Nha Trang (Khánh Hòa)',
    shortName: 'Vinmec Nha Trang',
    region: 'central',
    address: '42A Trần Phú, Vĩnh Nguyên, TP. Nha Trang, Khánh Hòa',
    lat: 12.2198,
    lng: 109.1983,
    isJci: true,
    hasEmergency: true,
    desc: 'Vinmec Nha Trang • Tầng 1, Khu Tiếp đón Quốc tế',
    phone: '0258 3900 168'
  },
  {
    id: 'Hai Phong',
    code: 'VM-HP',
    name: 'BV ĐKQT Vinmec Hải Phòng',
    shortName: 'Vinmec Hải Phòng',
    region: 'other',
    address: 'Đường Võ Nguyên Giáp, Vĩnh Niệm, Lê Chân, Hải Phòng',
    lat: 20.8354,
    lng: 106.6892,
    isJci: true,
    hasEmergency: true,
    desc: 'Vinmec Hải Phòng • Tầng 1, Khu Khám Ngoại trú',
    phone: '0225 7309 888'
  },
  {
    id: 'Ha Long',
    code: 'VM-HL',
    name: 'BV ĐKQT Vinmec Hạ Long (Quảng Ninh)',
    shortName: 'Vinmec Hạ Long',
    region: 'other',
    address: '10A Lê Thánh Tông, Hồng Gai, TP. Hạ Long, Quảng Ninh',
    lat: 20.9505,
    lng: 107.0805,
    isJci: true,
    hasEmergency: true,
    desc: 'Vinmec Hạ Long • Tầng 1, Khu Khám Bệnh',
    phone: '0203 3828 188'
  },
  {
    id: 'Phu Quoc',
    code: 'VM-PQ',
    name: 'BV ĐKQT Vinmec Phú Quốc (Kiên Giang)',
    shortName: 'Vinmec Phú Quốc',
    region: 'other',
    address: 'Bãi Dài, Gành Dầu, TP. Phú Quốc, Kiên Giang',
    lat: 10.3283,
    lng: 103.8647,
    isJci: true,
    hasEmergency: true,
    desc: 'Vinmec Phú Quốc • Tầng 1, Khu Khám Đảo Ngọc',
    phone: '0297 3985 588'
  }
];

// Current coordinates (Simulated default: Hai Ba Trung, Hanoi ~1.2km to Times City)
let currentCoords = { lat: 21.0045, lng: 105.8500 };
let currentActiveRegion = 'all';

// Haversine formula to compute geodesic distance between two points in km
function calculateHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Compute distances for all facilities and sort by ascending distance
function getFacilitiesWithDistances(lat, lng) {
  return vinmecFacilities.map(fac => {
    const dist = calculateHaversine(lat, lng, fac.lat, fac.lng);
    return { ...fac, distanceKm: dist };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}

// Auto-Detect GPS Facility
function autoDetectGpsFacility(isUserInitiated = false) {
  const btnTrigger = document.getElementById('btnAutoGpsTrigger');
  const btnModal = document.getElementById('btnModalGpsScan');
  const gpsStatusEl = document.getElementById('gpsStatusText');
  const btnLabel = document.getElementById('autoGpsBtnLabel');

  if (btnTrigger) btnTrigger.classList.add('scanning');
  if (btnLabel) btnLabel.innerText = '🛰️ Đang quét...';
  if (btnModal) {
    btnModal.classList.add('loading');
    const textEl = document.getElementById('btnModalGpsText');
    if (textEl) textEl.innerText = 'Đang quét tín hiệu vệ tinh GPS...';
  }
  if (gpsStatusEl) gpsStatusEl.innerText = 'Đang dò vị trí...';

  const applyGpsLocation = (lat, lng, isRealGps = true) => {
    currentCoords = { lat, lng };
    const sorted = getFacilitiesWithDistances(lat, lng);
    const nearest = sorted[0];

    // Automatically select the nearest hospital in the dropdown
    selectFacility(nearest.id, false);

    if (btnTrigger) btnTrigger.classList.remove('scanning');
    if (btnLabel) btnLabel.innerText = '🛰️ Auto GPS';
    if (btnModal) {
      btnModal.classList.remove('loading');
      const textEl = document.getElementById('btnModalGpsText');
      if (textEl) textEl.innerText = 'Quét GPS & Chọn Bệnh viện gần nhất';
    }
    if (gpsStatusEl) {
      gpsStatusEl.innerText = isRealGps ? `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}` : 'Đã định vị mẫu';
    }

    renderFacilityCardsList();

    if (isUserInitiated) {
      showToast(`📍 GPS: Đã tự động chọn cơ sở gần bạn nhất: ${nearest.shortName} (~${nearest.distanceKm.toFixed(1)} km)`);
    }
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyGpsLocation(pos.coords.latitude, pos.coords.longitude, true);
      },
      (err) => {
        // Fallback to high-fidelity simulated location (Hanoi center near Times City)
        applyGpsLocation(21.0045, 105.8500, false);
      },
      { timeout: 4000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  } else {
    applyGpsLocation(21.0045, 105.8500, false);
  }
}

// Open / Close Facility Picker Modal
function openFacilityPickerModal() {
  openModal('facilityPickerModal');
  renderFacilityCardsList();
}

function closeFacilityPickerModal() {
  closeModal('facilityPickerModal');
}

// Select Facility (via Dropdown, Modal Card, or GPS auto-discovery)
function selectFacility(facilityId, closePickerModal = true) {
  const fac = vinmecFacilities.find(f => f.id === facilityId) || vinmecFacilities[0];
  appState.selectedFacilityId = fac.id;

  // Update native dropdown select element
  const selectEl = document.getElementById('patientFacility');
  if (selectEl && selectEl.value !== fac.id) {
    selectEl.value = fac.id;
  }

  // Compute distance from user's coordinates
  const dist = calculateHaversine(currentCoords.lat, currentCoords.lng, fac.lat, fac.lng);
  const sorted = getFacilitiesWithDistances(currentCoords.lat, currentCoords.lng);
  const isNearest = sorted.length > 0 && sorted[0].id === fac.id;

  // Update proximity sub-bar text and color
  const distTextEl = document.getElementById('facilityDistText');
  const distIndicator = document.getElementById('facilityGpsDistIndicator');

  if (distTextEl) {
    if (isNearest) {
      distTextEl.innerText = `Cách bạn: ~${dist.toFixed(1)} km • Gần nhất ⭐`;
    } else {
      const distStr = dist > 50 ? `${dist.toFixed(0)} km` : `${dist.toFixed(1)} km`;
      distTextEl.innerText = `Cách bạn: ~${distStr} • Bạn đã chọn cơ sở này`;
    }
  }

  if (distIndicator) {
    if (isNearest) {
      distIndicator.classList.remove('far');
    } else {
      distIndicator.classList.add('far');
    }
  }

  // Update companion QR and Result preview if active
  const qrDeptEl = document.getElementById('compQrDept');
  if (qrDeptEl && appState.currentResult) {
    qrDeptEl.innerText = `${appState.currentResult.department} • ${fac.shortName}`;
  }

  const facilityTagEl = document.getElementById('facilityTag');
  if (facilityTagEl) {
    facilityTagEl.innerText = `📍 ${fac.desc}`;
  }

  if (closePickerModal) {
    closeFacilityPickerModal();
    showToast(`📍 Đã chọn: ${fac.name}`);
  }
}

// User manually changed the dropdown select
function onFacilityDropdownChange(val) {
  selectFacility(val, false);
  const fac = vinmecFacilities.find(f => f.id === val);
  const name = fac ? fac.shortName : val;
  showToast(`📍 Đã chuyển cơ sở: ${name}`);
}

function onFacilitySelectChange(val) {
  selectFacility(val, false);
}

// Render Facility Cards in Modal
function renderFacilityCardsList(searchKeyword = '') {
  const container = document.getElementById('facilityCardsList');
  if (!container) return;

  const sorted = getFacilitiesWithDistances(currentCoords.lat, currentCoords.lng);
  const keyword = (searchKeyword || '').toLowerCase().trim();

  let filtered = sorted;
  if (currentActiveRegion !== 'all') {
    filtered = filtered.filter(f => f.region === currentActiveRegion);
  }
  if (keyword) {
    filtered = filtered.filter(f =>
      f.name.toLowerCase().includes(keyword) ||
      f.address.toLowerCase().includes(keyword) ||
      f.shortName.toLowerCase().includes(keyword)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:#94A3B8; font-size:0.8rem;">Không tìm thấy cơ sở phù hợp với từ khóa "${searchKeyword}".</div>`;
    return;
  }

  const nearestId = sorted[0].id;

  container.innerHTML = filtered.map(fac => {
    const isSelected = fac.id === appState.selectedFacilityId;
    const isNearest = fac.id === nearestId;
    const distStr = fac.distanceKm < 10 ? `${fac.distanceKm.toFixed(1)} km` : `${fac.distanceKm.toFixed(0)} km`;

    return `
      <div class="facility-card-item ${isSelected ? 'selected' : ''} ${isNearest ? 'nearest' : ''}" onclick="selectFacility('${fac.id}')">
        <div class="fitem-header">
          <div class="fitem-name">${fac.name}</div>
          <span class="fitem-distance">📍 ${distStr}</span>
        </div>
        <div class="fitem-addr">${fac.address}</div>
        <div class="fitem-badges">
          ${isNearest ? '<span class="fitem-badge nearest-star">⭐ GẦN BẠN NHẤT</span>' : ''}
          ${fac.isJci ? '<span class="fitem-badge jci">JCI Quốc tế</span>' : ''}
          ${fac.hasEmergency ? '<span class="fitem-badge emergency">Cấp cứu 24/7</span>' : ''}
          <span class="fitem-badge" style="background:#F0FDF4; color:#15803D; border:1px solid #BBF7D0;">Đang mở cửa</span>
          ${isSelected ? '<span class="fitem-badge" style="background:#1AA392; color:#FFFFFF; margin-left:auto; font-weight:800;">✓ Đang chọn</span>' : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Region Filter Handler
function filterByRegion(region, btnElement) {
  currentActiveRegion = region;
  document.querySelectorAll('.region-pill').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  const searchInput = document.getElementById('facilitySearchInput');
  renderFacilityCardsList(searchInput ? searchInput.value : '');
}

// Search Input Handler
function filterFacilityList() {
  const searchInput = document.getElementById('facilitySearchInput');
  renderFacilityCardsList(searchInput ? searchInput.value : '');
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Pre-load P1 scenario as an introductory demo in the background
  applyScenario('p1');
  // Always start on Main Home screen matching screenshot main.jpg
  goToPatientScreen('home');
  // Auto-run background GPS proximity check
  autoDetectGpsFacility(false);
});

// Switch between Patient Sub-Screens: 'home' (main 2x2 grid) vs 'booking' (specific booking view)
function goToPatientScreen(screenName) {
  appState.patientScreen = screenName;

  const homeScreen = document.getElementById('myvmScreenHome');
  const bookingScreen = document.getElementById('myvmScreenBooking');

  if (screenName === 'booking') {
    if (homeScreen) homeScreen.classList.remove('active');
    if (bookingScreen) bookingScreen.classList.add('active');

    // Scroll booking container to top
    const screenScroll = document.getElementById('smartphoneScreen');
    if (screenScroll) screenScroll.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Default to 'home'
    if (bookingScreen) bookingScreen.classList.remove('active');
    if (homeScreen) homeScreen.classList.add('active');

    // Scroll to top
    const screenScroll = document.getElementById('smartphoneScreen');
    if (screenScroll) screenScroll.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// 2x2 Grid Carousel Navigation (Scroll Left / Right)
function scrollGridCarousel(direction) {
  const carousel = document.getElementById('myvmGridCarousel');
  if (!carousel) return;

  const slideWidth = carousel.clientWidth;
  carousel.scrollBy({ left: slideWidth * direction, behavior: 'smooth' });
}

// Jump directly to specific carousel slide (0, 1, 2)
function goToSlide(slideIndex) {
  const carousel = document.getElementById('myvmGridCarousel');
  if (!carousel) return;

  const slideWidth = carousel.clientWidth;
  carousel.scrollTo({ left: slideWidth * slideIndex, behavior: 'smooth' });
  updateCarouselDots(slideIndex);
}

// Listen to scroll events on the carousel to update pagination dots dynamically
function handleCarouselScroll() {
  const carousel = document.getElementById('myvmGridCarousel');
  if (!carousel) return;

  const slideWidth = carousel.clientWidth;
  if (slideWidth === 0) return;

  const activeIndex = Math.round(carousel.scrollLeft / slideWidth);
  updateCarouselDots(activeIndex);
}

function updateCarouselDots(activeIndex) {
  for (let i = 0; i <= 2; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      if (i === activeIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    }
  }
}

// Apply Scenario and automatically transition into Booking view
function applyScenarioAndGoBooking(scenarioKey) {
  goToPatientScreen('booking');
  applyScenario(scenarioKey);
}

// View Switcher: Patient View <-> Doctor View
function switchView(viewName) {
  appState.currentView = viewName;

  const btnPatient = document.getElementById('btnPatientView');
  const btnDoctor = document.getElementById('btnDoctorView');
  const panelPatient = document.getElementById('patientViewSection');
  const panelDoctor = document.getElementById('doctorViewSection');

  if (viewName === 'patient') {
    btnPatient.classList.add('active');
    btnDoctor.classList.remove('active');
    panelPatient.classList.add('active');
    panelDoctor.classList.remove('active');
  } else {
    btnDoctor.classList.add('active');
    btnPatient.classList.remove('active');
    panelDoctor.classList.add('active');
    panelPatient.classList.remove('active');

    // Auto update timestamp
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const tsEl = document.getElementById('docTimestamp');
    if (tsEl) tsEl.innerText = formattedDate;
  }
}

// Apply Pre-configured Scenario
function applyScenario(scenarioKey) {
  appState.activeScenario = scenarioKey;
  appState.selectedDoctorIndex = 0;
  appState.selectedSlot = null;

  const data = scenarios[scenarioKey];
  if (!data) return;

  const inputEl = document.getElementById('symptomInput');
  const ageEl = document.getElementById('patientAge');
  const facilityEl = document.getElementById('patientFacility');
  const counterEl = document.getElementById('charCounter');

  if (inputEl) {
    inputEl.value = data.symptomText;
    if (counterEl) counterEl.innerText = `${data.symptomText.length}/120`;
  }
  if (ageEl) ageEl.value = data.age;
  if (facilityEl && data.facility) {
    facilityEl.value = data.facility;
    selectFacility(data.facility, false);
  }

  // Highlight active chip in Booking form & Desktop Companion Panel
  ['p1', 'p2', 'p3', 'emergency'].forEach(key => {
    const chipKey = key === 'emergency' ? 'chip-em' : `chip-${key}`;
    const deskKey = key === 'emergency' ? 'desk-chip-em' : `desk-chip-${key}`;
    const el = document.getElementById(chipKey);
    const deskEl = document.getElementById(deskKey);
    if (el) {
      if (key === scenarioKey) el.classList.add('active');
      else el.classList.remove('active');
    }
    if (deskEl) {
      if (key === scenarioKey) deskEl.classList.add('active');
      else deskEl.classList.remove('active');
    }
  });

  // Run analysis immediately for scenario demonstration
  runTriageAnalysis();
}

// Reset Form to Clean State
function resetForm() {
  document.getElementById('symptomInput').value = '';
  document.getElementById('patientAge').value = '27';
  appState.activeScenario = null;
  appState.currentResult = null;
  appState.selectedDoctorIndex = 0;
  appState.selectedSlot = null;

  document.getElementById('emptyState').style.display = 'block';
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('emergencyBox').style.display = 'none';
  document.getElementById('resultContent').style.display = 'none';
}

// Clinical Red-Flag Keywords Detector (Deterministic Layer)
function checkRedFlags(text) {
  const redFlagKeywords = [
    'đau thắt ngực', 'đè nặng ngực', 'đau ngực lan', 'vã mồ hôi', 'khó thở dữ dội',
    'méo miệng', 'yếu nửa người', 'liệt nửa người', 'nói ngọng', 'đột quỵ',
    'nôn ra máu', 'đi ngoài phân đen', 'bụng cứng như gỗ',
    'co giật', 'sốt cao co giật', 'thở rên', 'tím tái'
  ];

  const lower = text.toLowerCase();
  for (const kw of redFlagKeywords) {
    if (lower.includes(kw)) {
      return {
        found: true,
        keyword: kw,
        reason: 'Phát hiện triệu chứng nguy kịch: "' + kw + '". Bệnh nhân cần được cấp cứu y tế ngay lập tức!'
      };
    }
  }
  return { found: false };
}

// Core Clinical Triage Execution
function runTriageAnalysis() {
  const symptomText = document.getElementById('symptomInput').value.trim();
  if (!symptomText) {
    alert('Vui lòng nhập mô tả triệu chứng hoặc chọn 1 kịch bản mẫu.');
    return;
  }

  // UI state: Show loading
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('emergencyBox').style.display = 'none';
  document.getElementById('resultContent').style.display = 'none';
  document.getElementById('loadingState').style.display = 'block';

  // Step 1: Deterministic Red-Flag check
  const redFlagCheck = checkRedFlags(symptomText);

  setTimeout(() => {
    // Progress Step 2
    const stepItems = document.querySelectorAll('#progressSteps .step-item');
    if (stepItems.length > 1) {
      stepItems[0].classList.remove('active');
      stepItems[1].classList.add('active');
    }

    setTimeout(() => {
      // Progress Step 3
      if (stepItems.length > 2) {
        stepItems[1].classList.remove('active');
        stepItems[2].classList.add('active');
      }

      setTimeout(() => {
        document.getElementById('loadingState').style.display = 'none';

        // Check Emergency
        if (redFlagCheck.found || appState.activeScenario === 'emergency') {
          triggerEmergencyMode(redFlagCheck.reason || 'DẤU HIỆU CẢNH BÁO NGUY CƠ NHỒI MÁU CƠ TIM CẤP (ACUTE MYOCARDIAL INFARCTION)!');
          return;
        }

        // Render Normal Clinical Result
        renderClinicalResult(appState.activeScenario);
      }, 400);
    }, 400);
  }, 400);
}

// Trigger Emergency Red-Flag Mode
function triggerEmergencyMode(reason) {
  const emBox = document.getElementById('emergencyBox');
  const emReason = document.getElementById('emergencyReasonText');
  if (emReason) emReason.innerText = reason;
  if (emBox) emBox.style.display = 'block';

  // Update Doctor View with Emergency Notification
  document.getElementById('soapCC').innerText = '[CẤP CỨU RED-FLAG] Đau ngực dữ dội, khó thở cấp';
  document.getElementById('soapHPI').innerText = 'Hệ thống AI Triage phát hiện dấu hiệu đe dọa tính mạng. Đã ngắt luồng đặt hẹn thường và điều hướng cấp cứu 115 / Hotline Cấp cứu Vinmec.';
  document.getElementById('soapAssessment').innerText = 'NGUY CƠ HỘI CHỨNG VÀNH CẤP / CẤP CỨU TIM MẠCH NGUY KỊCH';
  document.getElementById('soapAssessment').style.background = '#FEE2E2';
  document.getElementById('soapAssessment').style.borderColor = '#EF4444';
  document.getElementById('soapAssessment').style.color = '#B91C1C';
  document.getElementById('soapRedFlag').innerText = 'DƯƠNG TÍNH 🚨';
  document.getElementById('soapRedFlag').className = 'vital-val alert';
}

// Render Clinical Triage Result & Dynamic Guidance
function renderClinicalResult(scenarioKey) {
  // Fallback to P1 if user typed custom text not in scenarios
  const data = scenarios[scenarioKey] || scenarios.p1;
  appState.currentResult = data;
  appState.selectedDoctorIndex = 0;
  appState.selectedSlot = data.doctors ? data.doctors[0].defaultSlot : '08:30 Sáng mai';

  // 1. Triage Summary
  document.getElementById('triageLevelBadge').innerText = data.triageLevel;
  document.getElementById('recommendedDept').innerText = data.department;
  document.getElementById('facilityTag').innerText = `📍 ${data.facilityDesc}`;
  document.getElementById('rationaleText').innerText = data.rationale;

  // 2. Render Doctor Recommendation Cards
  renderDoctorRecommendations(data);

  // 3. Dynamic Prep Card (One Medical style)
  document.getElementById('fastingHeadline').innerText = data.fastingHeadline;
  document.getElementById('fastingNote').innerText = data.fastingNote;
  document.getElementById('waterRuleText').innerText = data.waterRule;
  document.getElementById('medGuidanceText').innerText = data.medGuidance;
  document.getElementById('wayfindingText').innerText = data.wayfinding;

  // 4. Update Confirm Booking Button Text
  updateConfirmButtonText();

  // 5. Sync into Doctor View
  syncDoctorView(data);

  // 6. Sync into Desktop Companion Right Panel
  const compQrPatient = document.getElementById('compQrPatient');
  const compQrDept = document.getElementById('compQrDept');
  if (compQrPatient) compQrPatient.innerText = `${data.name} (${data.age}T)`;
  if (compQrDept) compQrDept.innerText = data.department;
  updateCompanionJourneyStep(3);

  // Display Result Container
  document.getElementById('resultContent').style.display = 'block';
}

// Render Doctor Recommendation List
function renderDoctorRecommendations(data) {
  const container = document.getElementById('doctorRecList');
  if (!container || !data.doctors) return;

  container.innerHTML = '';
  data.doctors.forEach((doc, idx) => {
    const isSelected = idx === appState.selectedDoctorIndex;
    const currentSlot = isSelected && appState.selectedSlot ? appState.selectedSlot : doc.defaultSlot;

    const docEl = document.createElement('div');
    docEl.className = `doctor-item ${isSelected ? 'selected' : ''}`;
    docEl.id = `docItem-${idx}`;
    docEl.onclick = () => selectDoctor(idx);

    let slotsHtml = '';
    doc.slots.forEach(slot => {
      const isSlotActive = slot === currentSlot && isSelected;
      slotsHtml += `<button type="button" class="slot-btn ${isSlotActive ? 'selected' : ''}" onclick="selectSlot(event, ${idx}, '${slot}')">${slot}</button>`;
    });

    docEl.innerHTML = `
      <div class="doc-info-row">
        <div class="doc-profile">
          <div class="doc-avatar-circle">${doc.avatarText}</div>
          <div>
            <div class="doc-name">${doc.name}</div>
            <div class="doc-title-text">${doc.title} • ${doc.exp}</div>
          </div>
        </div>
        <div class="doc-meta-badge">
          <span class="badge-match">Độ phù hợp: ${doc.matchRate}</span>
        </div>
      </div>
      <div class="doc-subspecialty">${doc.subspecialty}</div>
      <div>
        <div class="slot-selection-title">Khung giờ khám còn trống:</div>
        <div class="time-slots">${slotsHtml}</div>
      </div>
    `;

    container.appendChild(docEl);
  });
}

// Select Doctor
function selectDoctor(docIndex) {
  appState.selectedDoctorIndex = docIndex;
  const data = appState.currentResult || scenarios.p1;
  const doc = data.doctors[docIndex];
  appState.selectedSlot = doc.defaultSlot;

  // Re-render doctor cards and update button
  renderDoctorRecommendations(data);
  updateConfirmButtonText();
  syncDoctorView(data);
}

// Select Time Slot
function selectSlot(event, docIndex, slotText) {
  event.stopPropagation(); // prevent re-triggering card click
  appState.selectedDoctorIndex = docIndex;
  appState.selectedSlot = slotText;

  const data = appState.currentResult || scenarios.p1;
  renderDoctorRecommendations(data);
  updateConfirmButtonText();
  syncDoctorView(data);
  showToast(`Đã chọn bác sĩ và khung giờ: ${slotText}`);
}

// Update text on booking confirmation button
function updateConfirmButtonText() {
  const btnText = document.getElementById('btnConfirmText');
  if (!btnText) return;

  const data = appState.currentResult || scenarios.p1;
  if (data.doctors && data.doctors[appState.selectedDoctorIndex]) {
    const doc = data.doctors[appState.selectedDoctorIndex];
    const slot = appState.selectedSlot || doc.defaultSlot;
    btnText.innerText = `Xác nhận Đặt lịch với ${doc.name} (${slot})`;
  } else {
    btnText.innerText = 'Xác nhận Đặt lịch Khám & Lưu Thẻ Hướng Dẫn';
  }
}

// Synchronize Doctor View Components
function syncDoctorView(data) {
  // 1. Demographics & Header
  document.getElementById('docPatientName').innerText = data.name;
  document.getElementById('docPatientAge').innerText = data.age;
  document.getElementById('docDept').innerText = data.department;

  const assignedDocEl = document.getElementById('docAssignedDoctor');
  const apptSlotEl = document.getElementById('docApptSlot');
  const currentDoc = data.doctors ? data.doctors[appState.selectedDoctorIndex] : null;
  const currentSlot = appState.selectedSlot || (currentDoc ? currentDoc.defaultSlot : '08:30 Sáng mai');

  if (assignedDocEl && currentDoc) assignedDocEl.innerText = currentDoc.name;
  if (apptSlotEl) apptSlotEl.innerText = currentSlot;

  // 2. Render Section 1: Symptom Breakdown
  const breakdownGrid = document.getElementById('docBreakdownGrid');
  if (breakdownGrid && data.symptomBreakdown) {
    breakdownGrid.innerHTML = '';
    data.symptomBreakdown.forEach(item => {
      const box = document.createElement('div');
      box.className = 'breakdown-item';
      box.innerHTML = `
        <div class="breakdown-label">${item.label}</div>
        <div class="breakdown-value">${item.value}</div>
      `;
      breakdownGrid.appendChild(box);
    });
  }

  // 3. Render Section 2: Doctor Action Tasks Checklist
  const taskChecklistEl = document.getElementById('docTaskChecklist');
  if (taskChecklistEl && data.doctorTasks) {
    taskChecklistEl.innerHTML = '';
    data.doctorTasks.forEach((task, idx) => {
      const taskEl = document.createElement('div');
      taskEl.className = `task-item ${task.done ? 'completed' : ''}`;
      taskEl.onclick = () => toggleDoctorTask(idx);

      taskEl.innerHTML = `
        <input type="checkbox" ${task.done ? 'checked' : ''} onclick="event.stopPropagation(); toggleDoctorTask(${idx});">
        <span class="task-text">${task.text}</span>
        <span class="task-priority-badge ${task.priority}">${task.priority === 'high' ? 'Ưu tiên cao' : 'Tiêu chuẩn'}</span>
      `;
      taskChecklistEl.appendChild(taskEl);
    });
  }

  // 4. Render Section 3: Past EMR Card
  const pastEmrEl = document.getElementById('docPastEmrCard');
  if (pastEmrEl && data.pastEMR) {
    const emr = data.pastEMR;
    pastEmrEl.innerHTML = `
      <div class="emr-meta-banner">
        <div class="emr-tag-group">
          <span class="emr-badge">${emr.recordCode}</span>
          <strong>Lần khám gần nhất:</strong> <span>${emr.lastVisit}</span>
          <span style="color:var(--text-muted); font-size:0.75rem;">(${emr.facility})</span>
        </div>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="viewPastEmrDetail()">
          📄 Xem bản gốc EMR
        </button>
      </div>

      <div class="emr-detail-grid">
        <div class="emr-box">
          <div class="emr-box-title">Chẩn đoán lần khám trước</div>
          <div class="emr-box-content" style="color:#B45309; font-weight:700;">${emr.diagnosis}</div>
        </div>
        <div class="emr-box">
          <div class="emr-box-title">Cận lâm sàng đã thực hiện</div>
          <div class="emr-box-content">${emr.tests}</div>
        </div>
        <div class="emr-box">
          <div class="emr-box-title">Đơn thuốc đã kê đợt trước</div>
          <div class="emr-box-content">${emr.prescription}</div>
        </div>
        <div class="emr-box">
          <div class="emr-box-title">Tiền sử Dị ứng ghi nhận</div>
          <div class="emr-box-content" style="color:#047857; font-weight:600;">${emr.allergies}</div>
        </div>
      </div>

      <div class="emr-compare-callout">
        <strong>💡 ĐỐI CHIẾU TIẾN TRIỂN LÂM SÀNG TỰ ĐỘNG:</strong>
        <p style="margin-top:4px;">${emr.clinicalComparison}</p>
      </div>
    `;
  }

  // 5. SOAP Card
  document.getElementById('soapCC').innerText = data.soap.cc;
  document.getElementById('soapHPI').innerText = data.soap.hpi;
  document.getElementById('soapHistory').innerText = data.soap.history;
  document.getElementById('soapMeds').innerText = data.soap.meds;
  document.getElementById('soapAssessment').innerText = data.soap.assessment;
  document.getElementById('soapAssessment').style.background = '#FEF3C7';
  document.getElementById('soapAssessment').style.borderColor = '#FCD34D';
  document.getElementById('soapAssessment').style.color = '#92400E';

  document.getElementById('soapFastingStatus').innerText = data.fastingRequired ? 'Cần nhịn ăn 8h' : 'Không cần nhịn ăn';
  document.getElementById('soapRedFlag').innerText = 'Âm tính (An toàn)';
  document.getElementById('soapRedFlag').className = 'vital-val safe';

  // Render Doctor Orders List
  const ordersListEl = document.getElementById('soapOrders');
  if (ordersListEl && data.soap.orders) {
    ordersListEl.innerHTML = '';
    data.soap.orders.forEach(order => {
      const li = document.createElement('li');
      li.innerText = order;
      ordersListEl.appendChild(li);
    });
  }
}

// Toggle Doctor Action Task
function toggleDoctorTask(taskIndex) {
  const data = appState.currentResult || scenarios.p1;
  if (!data.doctorTasks || !data.doctorTasks[taskIndex]) return;

  data.doctorTasks[taskIndex].done = !data.doctorTasks[taskIndex].done;
  syncDoctorView(data);

  if (data.doctorTasks[taskIndex].done) {
    showToast('Đã đánh dấu hoàn thành nhiệm vụ khám!');
  }
}

// Confirmation of Appointment (Opens Success Modal & fills breakdown)
function confirmAppointment() {
  const data = appState.currentResult || scenarios.p1;
  const currentDoc = data.doctors ? data.doctors[appState.selectedDoctorIndex] : null;
  const currentSlot = appState.selectedSlot || (currentDoc ? currentDoc.defaultSlot : '08:30 Sáng mai');

  // Fill Modal Ticket
  const modalDocEl = document.getElementById('modalDoctorName');
  const modalPatientEl = document.getElementById('modalPatientName');
  const modalFacilityEl = document.getElementById('modalFacilityText');
  const modalApptTimeEl = document.getElementById('modalApptTime');
  const modalFastingEl = document.getElementById('modalFastingSummary');

  if (modalDocEl && currentDoc) modalDocEl.innerText = `${currentDoc.name} (${currentDoc.title})`;
  const curFac = vinmecFacilities.find(f => f.id === appState.selectedFacilityId) || vinmecFacilities[0];
  if (modalFacilityEl) modalFacilityEl.innerText = `${data.department} • ${curFac.name}`;
  if (modalApptTimeEl) modalApptTimeEl.innerText = currentSlot;
  if (modalFastingEl) modalFastingEl.innerText = `${data.fastingHeadline}. ${data.fastingNote}`;

  // Fill Modal Clinical Breakdown Grid
  const modalBreakdownGrid = document.getElementById('modalBreakdownGrid');
  if (modalBreakdownGrid && data.symptomBreakdown) {
    modalBreakdownGrid.innerHTML = '';
    data.symptomBreakdown.slice(0, 4).forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'breakdown-item';
      itemEl.innerHTML = `
        <div class="breakdown-label">${item.label}</div>
        <div class="breakdown-value">${item.value}</div>
      `;
      modalBreakdownGrid.appendChild(itemEl);
    });
  }

  openModal('bookingSuccessModal');
  updateCompanionJourneyStep(5);
}

// Transition from confirmation modal into Doctor View
function viewDoctorFromConfirmation() {
  closeModal('bookingSuccessModal');
  switchView('doctor');
  showToast('Đã chuyển sang Góc nhìn Bác sĩ: Bản phân rã lý do khám, nhiệm vụ và bệnh án cũ sẵn sàng!');
}

// View Full Past EMR Record Modal
function viewPastEmrDetail() {
  const data = appState.currentResult || scenarios.p1;
  const emr = data.pastEMR;
  const bodyEl = document.getElementById('pastEmrModalBody');
  if (!bodyEl || !emr) return;

  bodyEl.innerHTML = `
    <div style="background:#F1F5F9; padding:12px; border-radius:6px; margin-bottom:14px; font-family:monospace; font-size:0.85rem;">
      <strong>MÃ HỒ SƠ:</strong> ${emr.recordCode} | <strong>MÃ BỆNH NHÂN:</strong> ${emr.patientCode}<br/>
      <strong>NGÀY KHÁM:</strong> ${emr.lastVisit} | <strong>BÁC SĨ KHÁM:</strong> ${emr.attendingDoctor}
    </div>
    <h4 style="margin-bottom:4px; color:var(--vm-navy);">1. Chẩn đoán xác định lần trước:</h4>
    <p style="margin-bottom:12px; color:#B45309; font-weight:600;">${emr.diagnosis}</p>
    
    <h4 style="margin-bottom:4px; color:var(--vm-navy);">2. Chi tiết kết quả cận lâm sàng lưu trữ:</h4>
    <p style="margin-bottom:12px; background:#FFFFFF; border:1px solid #E2E8F0; padding:10px; border-radius:6px;">${emr.tests}</p>
    
    <h4 style="margin-bottom:4px; color:var(--vm-navy);">3. Đơn thuốc & Liều dùng đã kê:</h4>
    <p style="margin-bottom:12px; background:#FFFFFF; border:1px solid #E2E8F0; padding:10px; border-radius:6px;">${emr.prescription}</p>
    
    <h4 style="margin-bottom:4px; color:var(--vm-navy);">4. Tiền sử dị ứng & Cảnh báo:</h4>
    <p style="color:#047857; font-weight:600;">${emr.allergies}</p>
  `;

  openModal('pastEmrModal');
}

// Copy SOAP to Clipboard for Doctor EMR
function copySoapToClipboard() {
  const patient = document.getElementById('docPatientName').innerText;
  const age = document.getElementById('docPatientAge').innerText;
  const dept = document.getElementById('docDept').innerText;
  const cc = document.getElementById('soapCC').innerText;
  const hpi = document.getElementById('soapHPI').innerText;
  const assessment = document.getElementById('soapAssessment').innerText;

  const clipText = `[VINMEC PRE-VISIT SOAP SUMMARY]
BỆNH NHÂN: ${patient} | TUỔI: ${age}
CHUYÊN KHOA TRIAGE: ${dept}

[S - SUBJECTIVE]
- Lý do vào viện (CC): ${cc}
- Bệnh sử hiện tại (HPI): ${hpi}

[O - OBJECTIVE]
- Trạng thái nhịn ăn: Đã xác thực trên VinCare Copilot
- Red-flag: Âm tính

[A - ASSESSMENT]
- Đánh giá sơ bộ: ${assessment}

(Tự động đồng bộ từ VinCare Copilot AI)`;

  navigator.clipboard.writeText(clipText).then(() => {
    showToast('Đã sao chép tóm tắt SOAP vào bộ nhớ tạm! Sẵn sàng dán vào Bệnh án điện tử EMR.');
  }).catch(() => {
    showToast('Sao chép thành công!');
  });
}

// Toast helper
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Modal open/close helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// Speech recognition simulation
function toggleSpeechRecognition() {
  const micBtn = document.getElementById('micBtn');
  if (!micBtn) return;

  micBtn.classList.toggle('recording');
  if (micBtn.classList.contains('recording')) {
    showToast('Đang lắng nghe giọng nói... (Nói vào micro của bạn)');
    setTimeout(() => {
      micBtn.classList.remove('recording');
      document.getElementById('symptomInput').value = 'Tôi bị đau quặn bụng vùng thượng vị sau khi ăn, ợ chua và đầy hơi 2 ngày nay...';
      updateCharCount(document.getElementById('symptomInput'));
      showToast('Đã nhận diện giọng nói thành công!');
    }, 2500);
  }
}

// Toggle Patient Display Mode (Mobile Smartphone Frame vs Desktop View)
function togglePatientDisplayMode(mode) {
  const wrapper = document.getElementById('mobilePhoneWrapper');
  const btnMobile = document.getElementById('btnModeMobile');
  const btnDesktop = document.getElementById('btnModeDesktop');
  const stageContainer = document.querySelector('.desktop-stage-container');
  const companionPanels = document.querySelectorAll('.desktop-companion-panel');

  if (!wrapper || !btnMobile || !btnDesktop) return;

  if (mode === 'desktop') {
    wrapper.classList.add('desktop-mode');
    btnDesktop.classList.add('active');
    btnMobile.classList.remove('active');
    companionPanels.forEach(p => p.style.display = 'none');
    if (stageContainer) stageContainer.style.height = 'auto';
    showToast('Đã chuyển sang Chế độ Mở rộng Desktop');
  } else {
    wrapper.classList.remove('desktop-mode');
    btnMobile.classList.add('active');
    btnDesktop.classList.remove('active');
    companionPanels.forEach(p => p.style.display = '');
    if (stageContainer) stageContainer.style.height = '';
    showToast('Đã chuyển sang Chế độ Mobile MyVinmec (Khuyên dùng)');
  }
}

// Select Date Card in Booking Form
function selectDateCard(element, day) {
  const allCards = document.querySelectorAll('.myvm-date-card');
  allCards.forEach(card => card.classList.remove('active'));
  element.classList.add('active');
  showToast(`Đã chọn ngày khám: Ngày ${day} Tháng 10`);
}

// Update Character Counter (0/120 from booking.jpg)
function updateCharCount(textarea) {
  const counterEl = document.getElementById('charCounter');
  if (!counterEl || !textarea) return;
  const len = textarea.value.length;
  counterEl.innerText = `${len}/120`;
}

// Update Stanford Biodesign Companion Journey Steps (1 - 5)
function updateCompanionJourneyStep(stepNumber) {
  for (let i = 1; i <= 5; i++) {
    const stepEl = document.getElementById(`cStep${i}`);
    if (stepEl) {
      stepEl.classList.remove('active', 'done');
      if (i < stepNumber) {
        stepEl.classList.add('done');
      } else if (i === stepNumber) {
        stepEl.classList.add('active');
      }
    }
  }
}

