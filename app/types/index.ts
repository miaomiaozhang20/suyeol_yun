export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  currentVentureId?: string;
}

export interface Venture {
  id: string;
  name: string;
  type?: string;
  industry?: string;
  country?: string;
  description?: string;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  status: 'draft' | 'complete';
  content: any;
  conversationLog?: ConversationLog[];
  moduleId: ModuleId;
  isFoundational: boolean;
  ventureId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ArtifactType = 
  | 'problem_statement'
  | 'customer_persona'
  | 'interview_guide'
  | 'interview_insights'
  | 'market_sizing';

export type ModuleId = 'problem' | 'solution' | 'product' | 'gtm';

export interface ConversationLog {
  question: string;
  answer: string;
  timestamp: Date;
}

export interface ProblemStatement {
  problem: string;
  targetCustomer: string;
  painPoints: string[];
  currentSolutions: string[];
  opportunity: string;
}

export interface CustomerPersona {
  name: string;
  demographics: {
    age?: string;
    gender?: string;
    location?: string;
    income?: string;
    jobTitle?: string;
    company?: string;
    industry?: string;
  };
  behaviors: {
    taskFrequency: string;
    toolsUsed: string[];
    processDescription: string;
  };
  needs: {
    functional: string[];
    psychological: string[];
  };
  frustrations: string[];
  constraints: string[];
  quotes: string[];
}

export interface InterviewGuide {
  objective: string;
  targetAudience: string;
  warmupQuestions: string[];
  coreQuestions: string[];
  validationQuestions: string[];
  wrapupQuestions: string[];
}

export interface InterviewInsights {
  interviewee: {
    name: string;
    role: string;
    company?: string;
  };
  date: Date;
  keyTakeaways: {
    painPoints: string[];
    currentSolutions: string[];
    workarounds: string[];
    unmetNeeds: string[];
    emotionalSignals: string[];
  };
  quotes: string[];
  nextSteps: string[];
}

export interface MarketSizing {
  tam: number;
  assumptions: {
    totalCustomers: number;
    revenuePerCustomer: number;
    pricingModel: string;
  };
  sources: string[];
  calculations: string;
}