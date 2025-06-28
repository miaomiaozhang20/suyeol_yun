import { Question } from './problem-statement';

export const customerPersonaQuestions: Question[] = [
  {
    id: 'talked_to_users',
    text: 'Have you already talked to real users or potential customers?',
    type: 'select',
    options: ['Yes, extensively', 'Yes, a few', 'Not yet', 'Planning to soon'],
    followUp: (answer) => {
      if (answer.includes('Not yet') || answer.includes('Planning')) {
        return {
          id: 'caveat_acknowledgment',
          text: 'Important: This persona is a starting point. Real customer interviews are essential for validation. Do you understand this is a hypothesis to be tested?',
          type: 'select',
          options: ['Yes, I understand']
        };
      }
      return null;
    }
  },
  {
    id: 'persona_name',
    text: 'Give this customer a memorable nickname that captures who they are',
    type: 'text',
    placeholder: 'e.g., "Marketing Mary", "Startup Steve", "Developer Dan"'
  },
  {
    id: 'venture_type',
    text: 'Is your venture B2C or B2B?',
    type: 'select',
    options: ['B2C (Business to Consumer)', 'B2B (Business to Business)', 'Both'],
    followUp: (answer) => {
      if (answer.includes('B2C')) {
        return {
          id: 'b2c_demographics',
          text: 'What are their key demographics? (age, gender, location, income)',
          type: 'textarea',
          placeholder: 'e.g., 25-35 years old, urban professionals, $50-80k income'
        };
      } else {
        return {
          id: 'b2b_demographics',
          text: 'What is their role and company profile?',
          type: 'textarea',
          placeholder: 'e.g., Marketing Manager at 50-200 person SaaS companies'
        };
      }
    }
  },
  {
    id: 'job_description',
    text: 'What do they do for a living? What are their key responsibilities?',
    type: 'textarea',
    placeholder: 'Describe their role, daily tasks, and what success looks like for them'
  },
  {
    id: 'task_frequency',
    text: 'How often do they perform the task you\'re solving for?',
    type: 'select',
    options: ['Multiple times daily', 'Daily', 'Weekly', 'Monthly', 'Occasionally']
  },
  {
    id: 'current_tools',
    text: 'What tools or processes are they currently using to get the job done?',
    type: 'textarea',
    placeholder: 'List specific tools, software, or manual processes they use'
  },
  {
    id: 'task_context',
    text: 'Describe what they do before, during, and after the task',
    type: 'textarea',
    placeholder: 'Walk through their complete workflow and context'
  },
  {
    id: 'functional_needs',
    text: 'What do they need the solution to do well? What features are must-haves?',
    type: 'textarea',
    placeholder: 'List the key functional requirements from their perspective'
  },
  {
    id: 'emotional_needs',
    text: 'How do they want to feel when using a solution? What emotional needs are at play?',
    type: 'textarea',
    placeholder: 'e.g., Feel in control, appear competent, reduce anxiety, save face'
  },
  {
    id: 'motivations',
    text: 'What motivates them most?',
    type: 'multiselect',
    options: ['Efficiency', 'Recognition', 'Security', 'Innovation', 'Cost savings', 'Growth', 'Reputation', 'Avoiding failure']
  },
  {
    id: 'frustrations',
    text: 'What frustrates them most about their current solutions?',
    type: 'textarea',
    placeholder: 'List specific pain points and frustrations they experience'
  },
  {
    id: 'constraints',
    text: 'What holds them back from trying new solutions?',
    type: 'textarea',
    placeholder: 'e.g., Budget limits, approval process, learning curve, integration concerns'
  },
  {
    id: 'memorable_quote',
    text: 'What\'s a quote that captures their perspective? (from interviews or imagined)',
    type: 'textarea',
    placeholder: 'e.g., "I spend half my day just trying to find the right information"'
  }
];

export function generatePersona(answers: Record<string, string>): any {
  return {
    name: answers.persona_name,
    demographics: {
      profile: answers.b2c_demographics || answers.b2b_demographics || '',
      jobDescription: answers.job_description
    },
    behaviors: {
      taskFrequency: answers.task_frequency,
      toolsUsed: answers.current_tools?.split(',').map(t => t.trim()) || [],
      processDescription: answers.task_context
    },
    needs: {
      functional: answers.functional_needs?.split('\n').filter(n => n.trim()) || [],
      psychological: answers.emotional_needs?.split('\n').filter(n => n.trim()) || []
    },
    frustrations: answers.frustrations?.split('\n').filter(f => f.trim()) || [],
    constraints: answers.constraints?.split('\n').filter(c => c.trim()) || [],
    quotes: [answers.memorable_quote].filter(q => q),
    motivations: answers.motivations?.split(',') || [],
    userResearch: answers.talked_to_users
  };
}