import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/capacity';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface ComponentData {
  id: number;
  componentName: string;
  currentUsageP95: number;
  currentUsageP99: number;
  priority: string;
  saturationSeverity: string;
  predictedSaturationDate: string;
  expansionPlan?: string;
  workHours?: number;
  expectedImprovement?: string;
  businessImpact?: string;
  userImpact?: string;
  riskLevel?: string;
  deadline?: string;
  recommendation?: string;
  daysToSaturation?: number;
  saturationDate?: string;
  requiredResources?: string;
  completionWeek?: string;
  currentStatus?: {
    usageP95: number;
    usageP99: number;
    saturationSeverity: string;
  };
  expansionSteps?: string[];
  totalWorkHours?: number;
  expectedOutcome?: string;
  verificationMethods?: string[];
  potentialRisks?: string[];
}

export interface WeeklyPlan {
  [key: string]: ComponentData[];
}

export interface OpsDirectorData {
  sortedComponents: ComponentData[];
  weeklyPlan: WeeklyPlan;
  totalWorkHours: number;
  estimatedCompletion: number;
}

export const capacityAPI = {
  // CTO Dashboard
  getCTODashboard: (): Promise<ComponentData[]> => {
    return api.get('/cto-dashboard').then(response => response.data);
  },

  // CEO Dashboard
  getCEODashboard: (): Promise<ComponentData[]> => {
    return api.get('/ceo-dashboard').then(response => response.data);
  },

  // Operations Director Dashboard
  getOpsDirectorDashboard: (): Promise<OpsDirectorData> => {
    return api.get('/ops-director-dashboard').then(response => response.data);
  },

  // Operations Engineer Dashboard
  getOpsEngineerDashboard: (): Promise<ComponentData[]> => {
    return api.get('/ops-engineer-dashboard').then(response => response.data);
  },

  // Component Details
  getComponentDetails: (componentId: string): Promise<any> => {
    return api.get(`/component/${componentId}`).then(response => response.data);
  }
};

export default capacityAPI;