export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  faculty: number | string; // Can be number or string
  facultyName?: string;
  rank: string;
  phoneNumber: string;
  email: string;
  group: string;
  lastDegree: string;
  employmentStatus: number | string;
  isTeaching: boolean;
  nationalCode: string;
  points: number;
  // Additional detailed fields
  facultyNameInEnglish?: string;
  facultyNameInPersian?: string;
  groupNameInPersian?: string;
  groupNameInEnglish?: string;
  tId?: string;
  createTime?: string;
  gender?: number;
  fatherName?: string;
  maritalStatus?: number;
  birthDate?: string;
  nationality?: string;
  birthPlace?: string;
  birthCertificateNumber?: string;
  birthCertificateSerialAndSerie?: string;
  birthCertificateIssuingPlace?: string;
  religion?: string;
  firstNameInEnglish?: string;
  lastNameInEnglish?: string;
  gregorianBirthDate?: string;
  personalNumber?: string;
  emailAddress?: string;
  websiteAddress?: string;
  address?: string;
  officeNumber?: string;
  homeTelephoneNumber?: string;
  userNumber?: string;
  employeeNumber?: string;
  employmentEndDate?: string;
  degreeObtainingDate?: string;
  degreeObtainingDateGregorian?: string;
  universityOfStudy?: string;
  studyField?: string;
  educationalOrientation?: string;
  paye?: number;
  academicRank?: number;
  academicPromotionDate?: string;
  halatOstad?: string;
  employmentDate?: string;
  insuranceTypeAndNumber?: string;
  bankAndAccountNumber?: string;
  shebaNumber?: string;
  mablaghAkharinHokmEstekhdami?: string;
  lastStatus?: string;
  lastStatusDate?: string;
  facultyOfMission?: string;
  lastPromotionDate?: string;
  payeType?: string;
  bandeAyeenName?: string;
  universityEmail?: string;
  educationalRecords?: EducationalRecord[] | null;
  industrialRecords?: IndustrialRecord[] | null;
  executiveRecords?: ExecutiveRecord[] | null;
  researchRecords?: ResearchRecord[] | null;
  promotionRecords?: PromotionRecord[] | null;
  statusChangeRecords?: StatusChangeRecord[] | null;
  courses?: Course[] | null;
}

// Generic Record interface (deprecated - kept for backward compatibility)
export interface Record {
  id: number;
  title: string;
  date: string;
  description: string;
}

// Specific record types based on actual API response
export interface IndustrialRecord {
  id: number;
  createTime: string;
  description: string;
  organizationName: string;
  date: string;
}

export interface ExecutiveRecord {
  id: number;
  createdTime: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface ResearchRecord {
  id: number;
  createTime: string;
  reference: string;
  url: string;
}

export interface PromotionRecord {
  id: number;
  createTime: string;
  fromAcademicRank: number;
  toAcademicRank: number;
  promotionDate: string;
}

export interface StatusChangeRecord {
  id: number;
  createTime: string;
  fromStatus: number;
  toStatus: number;
  statusChangeDate: string;
}

export interface EducationalRecord {
  id: number;
  createTime: string;
  title: string;
  description: string;
  date: string;
}

export interface Course {
  id: number;
  createTime: string;
  title: string;
  creditHour: number;
  isActive: boolean;
  activeDays: number[];
  time: string;
}
