export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  bannerImage?: string;
}

export const courses: Course[] = [
  {
    id: "indonesia-2026",
    title: "인도네시아 시장 진출 과정",
    subtitle: "KOTRA-aSSIST",
    description: "인도네시아 비즈니스 환경 이해 및 진출 전략 수립 역량 강화 과정",
    date: "2026.04.01",
  },
  // 앞으로 여기에 신규 과정을 추가하면 됩니다.
];
