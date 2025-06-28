export interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect';
  options?: string[];
  followUp?: (answer: string) => Question | null;
  validation?: (answer: string) => boolean;
  placeholder?: string;
}

export const problemStatementQuestions: Question[] = [
  {
    id: 'target_customer',
    text: 'Who is experiencing this problem? Describe your target customer.',
    type: 'textarea',
    placeholder: 'e.g., Small business owners in retail who struggle with inventory management',
    followUp: (answer) => {
      if (answer.toLowerCase().includes('business')) {
        return {
          id: 'business_size',
          text: 'What size businesses are you targeting?',
          type: 'select',
          options: ['1-10 employees', '11-50 employees', '51-200 employees', '200+ employees']
        };
      }
      return null;
    }
  },
  {
    id: 'problem_description',
    text: 'What specific problem are they facing? Be as detailed as possible.',
    type: 'textarea',
    placeholder: 'Describe the core problem your customers experience',
    followUp: (answer) => ({
      id: 'problem_frequency',
      text: 'How often does this problem occur for your customers?',
      type: 'select',
      options: ['Daily', 'Weekly', 'Monthly', 'Occasionally', 'Constantly']
    })
  },
  {
    id: 'current_solutions',
    text: 'How are they currently solving this problem? What tools or methods do they use?',
    type: 'textarea',
    placeholder: 'e.g., Excel spreadsheets, manual processes, existing software',
    followUp: (answer) => ({
      id: 'solution_pain_points',
      text: 'What frustrates them most about their current solution?',
      type: 'textarea',
      placeholder: 'List the main pain points and frustrations'
    })
  },
  {
    id: 'impact',
    text: 'What happens if this problem is not solved? What are the consequences?',
    type: 'textarea',
    placeholder: 'Describe the negative impact on their business or life'
  },
  {
    id: 'urgency',
    text: 'How urgent is it for them to find a better solution?',
    type: 'select',
    options: [
      'Critical - they need a solution immediately',
      'High - actively looking for solutions',
      'Medium - would adopt if the right solution came along',
      'Low - nice to have but not essential'
    ],
    followUp: (answer) => {
      if (answer.includes('Critical') || answer.includes('High')) {
        return {
          id: 'budget_willingness',
          text: 'What are they currently spending (time or money) to address this problem?',
          type: 'textarea',
          placeholder: 'e.g., 10 hours per week, $500/month on current tools'
        };
      }
      return null;
    }
  },
  {
    id: 'unique_insights',
    text: 'What unique insights do you have about this problem that others might miss?',
    type: 'textarea',
    placeholder: 'Share any personal experience or deep understanding you have'
  }
];

export function generateProblemStatement(answers: Record<string, string>): string {
  const template = `
## Problem Statement

**Target Customer**: ${answers.target_customer}

**Core Problem**: ${answers.problem_description}

**Current Solutions**: ${answers.current_solutions}

**Pain Points**: ${answers.solution_pain_points || 'Not specified'}

**Impact of Unsolved Problem**: ${answers.impact}

**Urgency Level**: ${answers.urgency}

**Unique Insights**: ${answers.unique_insights}

**Opportunity**: By addressing this problem, we can help ${answers.target_customer} overcome ${answers.solution_pain_points || 'their current frustrations'} and achieve better outcomes.
  `;

  return template.trim();
}