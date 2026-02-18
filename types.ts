
export enum UserRole {
  ADMIN = 'Admin',
  OFFICER = 'Officer',
  ACCOUNTANT = 'Accountant'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export enum MeterStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export interface Meter {
  id: string;
  meterNumber: string; // Exactly 11 digits
  tenantName: string;
  property: string;
  unit: string;
  status: MeterStatus;
  createdAt: string;
}

export enum ServiceChargeType {
  FLAT = 'Flat',
  PERCENTAGE = 'Percentage'
}

export interface Token {
  id: string;
  tokenCode: string;
  meterId: string;
  meterNumber: string;
  amount: number;
  tariffRate: number;
  serviceCharge: number;
  serviceChargeType: ServiceChargeType;
  totalServiceCharge: number;
  netAmount: number;
  units: number;
  generatedBy: string; // User ID
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface ReportData {
  date: string;
  revenue: number;
  serviceCharges: number;
  tokenCount: number;
}
