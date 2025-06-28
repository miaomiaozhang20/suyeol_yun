'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { customerPersonaQuestions, generatePersona } from '@/app/lib/questions/customer-persona';
import { Question } from '@/app/lib/questions/problem-statement';
import { ChevronRight, ChevronLeft, Save, Check, AlertCircle } from 'lucide-react';

const answerSchema = z.object({
  answer: z.string().min(1, 'Please provide an answer'),
});

type AnswerFormData = z.infer<typeof answerSchema>;

interface CustomerPersonaModuleProps {
  ventureId: string;
  onComplete: (artifact: any) => void;
  existingArtifact?: any;
}

export default function CustomerPersonaModule({ 
  ventureId, 
  onComplete,
  existingArtifact 
}: CustomerPersonaModuleProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(
    existingArtifact?.content?.answers || {}
  );
  const [additionalQuestions, setAdditionalQuestions] = useState<Question[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showCaveat, setShowCaveat] = useState(false);

  const allQuestions = [...customerPersonaQuestions, ...additionalQuestions];
  const currentQuestion = allQuestions[currentQuestionIndex];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: answers[currentQuestion?.id] || ''
    }
  });

  useEffect(() => {
    reset({ answer: answers[currentQuestion?.id] || '' });
  }, [currentQuestionIndex, currentQuestion, answers, reset]);

  useEffect(() => {
    if (currentQuestion?.id === 'caveat_acknowledgment') {
      setShowCaveat(true);
    }
  }, [currentQuestion]);

  const onSubmit = (data: AnswerFormData) => {
    const newAnswers = { ...answers, [currentQuestion.id]: data.answer };
    setAnswers(newAnswers);

    // Check for follow-up questions
    if (currentQuestion.followUp) {
      const followUpQuestion = currentQuestion.followUp(data.answer);
      if (followUpQuestion && !additionalQuestions.find(q => q.id === followUpQuestion.id)) {
        setAdditionalQuestions([...additionalQuestions, followUpQuestion]);
      }
    }

    // Move to next question or complete
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete(newAnswers);
    }
  };

  const handleComplete = async (finalAnswers: Record<string, string>) => {
    const persona = generatePersona(finalAnswers);
    
    try {
      const response = await fetch('/api/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'customer_persona',
          status: 'complete',
          content: {
            persona,
            answers: finalAnswers
          },
          moduleId: 'problem',
          isFoundational: false,
          ventureId
        })
      });
      
      if (response.ok) {
        setIsComplete(true);
        const artifact = await response.json();
        onComplete(artifact);
      }
    } catch (error) {
      console.error('Error saving artifact:', error);
    }
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Customer Persona Complete!
          </h2>
          <p className="text-green-700">
            Your customer persona "{answers.persona_name}" has been saved.
          </p>
        </div>
        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">{answers.persona_name}</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold">Demographics & Role</h4>
              <p>{answers.b2c_demographics || answers.b2b_demographics}</p>
              <p className="mt-2">{answers.job_description}</p>
            </div>
            <div>
              <h4 className="font-semibold">Key Behaviors</h4>
              <p>Task frequency: {answers.task_frequency}</p>
              <p className="mt-1">Current tools: {answers.current_tools}</p>
            </div>
            <div>
              <h4 className="font-semibold">Frustrations</h4>
              <p>{answers.frustrations}</p>
            </div>
            <div>
              <h4 className="font-semibold">Quote</h4>
              <p className="italic">"{answers.memorable_quote}"</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Customer Persona</h1>
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {allQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {showCaveat && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900">Remember: Talk to Real Users</h3>
              <p className="text-amber-800 text-sm mt-1">
                Building on assumptions is risky. This persona is a hypothesis to help you ask better questions. 
                You must validate it with real customer interviews.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion?.text}</h2>
          
          {currentQuestion?.type === 'textarea' ? (
            <textarea
              {...register('answer')}
              rows={5}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={currentQuestion.placeholder}
            />
          ) : currentQuestion?.type === 'select' ? (
            <select
              {...register('answer')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an option</option>
              {currentQuestion.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : currentQuestion?.type === 'multiselect' ? (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    onChange={(e) => {
                      const current = answers[currentQuestion.id]?.split(',').filter(Boolean) || [];
                      const updated = e.target.checked 
                        ? [...current, option]
                        : current.filter(v => v !== option);
                      setAnswers({ ...answers, [currentQuestion.id]: updated.join(',') });
                    }}
                    checked={answers[currentQuestion.id]?.includes(option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : (
            <input
              {...register('answer')}
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={currentQuestion?.placeholder}
            />
          )}
          
          {errors.answer && (
            <p className="mt-2 text-red-600 text-sm">{errors.answer.message}</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleComplete(answers)}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </button>
            
            <button
              type="submit"
              className="flex items-center px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {currentQuestionIndex === allQuestions.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}