'use client';

import { useState } from 'react';
import { FileText, Users, ClipboardList, MessageSquare, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import ProblemStatementModule from './components/modules/ProblemStatementModule';
import CustomerPersonaModule from './components/modules/CustomerPersonaModule';
import AIProblemStatementModule from './components/modules/AIProblemStatementModule';

const modules = [
  {
    id: 'problem_statement',
    title: 'Problem Statement',
    description: 'Define the core problem you\'re solving',
    icon: FileText,
    isFoundational: true,
    component: ProblemStatementModule,
  },
  {
    id: 'customer_persona',
    title: 'Customer Personas',
    description: 'Create detailed profiles of your target customers',
    icon: Users,
    isFoundational: false,
    component: CustomerPersonaModule,
  },
  {
    id: 'interview_guide',
    title: 'Interview Guide',
    description: 'Generate questions for customer discovery',
    icon: ClipboardList,
    isFoundational: false,
    component: null, // To be implemented
  },
  {
    id: 'interview_insights',
    title: 'Interview Insights',
    description: 'Summarize and analyze customer interviews',
    icon: MessageSquare,
    isFoundational: false,
    component: null, // To be implemented
  },
  {
    id: 'market_sizing',
    title: 'Market Sizing',
    description: 'Calculate your TAM with AI-assisted research',
    icon: TrendingUp,
    isFoundational: false,
    component: null, // To be implemented
  },
];

export default function Home() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [useAI, setUseAI] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);

  const handleModuleComplete = (artifact: any) => {
    setArtifacts([...artifacts, artifact]);
    setCompletedModules([...completedModules, artifact.type]);
    setSelectedModule(null);
    setUseAI(false);
  };

  const canAccessModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return false;
    
    // Check if foundational modules are completed
    const foundationalModules = modules.filter(m => m.isFoundational);
    const foundationalCompleted = foundationalModules.every(m => 
      completedModules.includes(m.id)
    );
    
    return module.isFoundational || foundationalCompleted;
  };

  if (selectedModule) {
    const module = modules.find(m => m.id === selectedModule);
    const ModuleComponent = module?.component;
    
    if (selectedModule === 'problem_statement' && useAI) {
      return (
        <AIProblemStatementModule
          ventureId="demo-venture"
          onComplete={handleModuleComplete}
          existingArtifact={artifacts.find(a => a.type === selectedModule)}
        />
      );
    }
    
    if (ModuleComponent) {
      return (
        <ModuleComponent
          ventureId="demo-venture"
          onComplete={handleModuleComplete}
          existingArtifact={artifacts.find(a => a.type === selectedModule)}
        />
      );
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Build Your Startup Foundation
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create high-quality startup artifacts through guided conversations. 
          Start with your problem statement and build from there.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;
          const isCompleted = completedModules.includes(module.id);
          const isAccessible = canAccessModule(module.id);
          const hasComponent = module.component !== null;

          return (
            <div
              key={module.id}
              onClick={() => {
                if (isAccessible && hasComponent) {
                  if (module.id === 'problem_statement') {
                    setShowModeSelection(true);
                  } else {
                    setSelectedModule(module.id);
                  }
                }
              }}
              className={`
                relative p-6 bg-white rounded-lg shadow-sm border-2 transition-all
                ${isAccessible && hasComponent
                  ? 'border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer' 
                  : 'border-gray-100 opacity-60 cursor-not-allowed'
                }
                ${isCompleted ? 'border-green-400' : ''}
              `}
            >
              {module.isFoundational && (
                <span className="absolute top-2 right-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Foundational
                </span>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <Icon className={`w-8 h-8 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                {isCompleted && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Completed
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {module.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {module.description}
              </p>
              
              {isAccessible && hasComponent && (
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  {isCompleted ? 'Edit' : 'Start'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              )}
              
              {!hasComponent && (
                <span className="text-xs text-gray-500">Coming soon</span>
              )}
              
              {!isAccessible && hasComponent && (
                <p className="text-xs text-gray-500">
                  Complete foundational modules first
                </p>
              )}
            </div>
          );
        })}
      </div>

      {completedModules.length > 0 && (
        <div className="mt-12 text-center">
          <a 
            href="/artifacts"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            View All Artifacts
            <ChevronRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      )}

      {showModeSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Choose Your Approach</h2>
            <p className="text-gray-600 mb-6">
              How would you like to create your problem statement?
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <button
                onClick={() => {
                  setUseAI(true);
                  setSelectedModule('problem_statement');
                  setShowModeSelection(false);
                }}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">AI Conversation</h3>
                    <p className="text-gray-600 text-sm">
                      Have an interactive conversation with an AI mentor who will guide you through 
                      refining your problem statement with personalized questions and feedback.
                    </p>
                    <p className="text-purple-600 text-sm font-medium mt-2">
                      Recommended for first-time founders
                    </p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setUseAI(false);
                  setSelectedModule('problem_statement');
                  setShowModeSelection(false);
                }}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Guided Form</h3>
                    <p className="text-gray-600 text-sm">
                      Answer a structured set of questions at your own pace with the ability to 
                      go back and forth between questions.
                    </p>
                    <p className="text-blue-600 text-sm font-medium mt-2">
                      Quick and straightforward
                    </p>
                  </div>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowModeSelection(false)}
              className="mt-6 w-full py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}