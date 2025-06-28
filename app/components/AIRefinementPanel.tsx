'use client';

import { useState } from 'react';
import { Lightbulb, CheckCircle, AlertCircle, Target } from 'lucide-react';

interface AIRefinementPanelProps {
  problemStatement: string;
  onApplySuggestion: (suggestion: string) => void;
}

export default function AIRefinementPanel({ 
  problemStatement, 
  onApplySuggestion 
}: AIRefinementPanelProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeProblemStatement = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemStatement,
          stage: 'refinement'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(parseAnalysis(data.analysis));
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAnalysis = (text: string) => {
    // Simple parsing - in production, this would be more sophisticated
    const sections = {
      strengths: [],
      improvements: [],
      suggestions: [],
      questions: []
    };

    const lines = text.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      if (line.toLowerCase().includes('strength')) {
        currentSection = 'strengths';
      } else if (line.toLowerCase().includes('improvement')) {
        currentSection = 'improvements';
      } else if (line.toLowerCase().includes('suggestion')) {
        currentSection = 'suggestions';
      } else if (line.toLowerCase().includes('question')) {
        currentSection = 'questions';
      } else if (line.trim() && currentSection) {
        sections[currentSection as keyof typeof sections].push(line.trim());
      }
    });

    return sections;
  };

  if (!problemStatement) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          Complete your problem statement to get AI-powered refinement suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold">AI Refinement Assistant</h3>
          <p className="text-sm text-gray-600 mt-1">
            Get intelligent feedback to strengthen your problem statement
          </p>
        </div>
        <button
          onClick={analyzeProblemStatement}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {analysis && (
        <div className="space-y-6">
          {analysis.strengths.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Strengths</h4>
              </div>
              <ul className="space-y-2">
                {analysis.strengths.map((strength: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.improvements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-amber-800">Areas for Improvement</h4>
              </div>
              <ul className="space-y-2">
                {analysis.improvements.map((improvement: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Suggestions</h4>
              </div>
              <div className="space-y-2">
                {analysis.suggestions.map((suggestion: string, i: number) => (
                  <div key={i} className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{suggestion}</p>
                    <button
                      onClick={() => onApplySuggestion(suggestion)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Apply this suggestion →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.questions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Questions to Consider</h4>
              </div>
              <ul className="space-y-2">
                {analysis.questions.map((question: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <span className="text-purple-600 mr-2">?</span>
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!analysis && !isAnalyzing && (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            Click "Analyze" to get AI-powered feedback on your problem statement
          </p>
        </div>
      )}
    </div>
  );
}