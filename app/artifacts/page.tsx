'use client';

import { useState, useEffect } from 'react';
import { FileText, Users, ClipboardList, MessageSquare, TrendingUp, Download, Eye, Trash2 } from 'lucide-react';

const artifactIcons = {
  problem_statement: FileText,
  customer_persona: Users,
  interview_guide: ClipboardList,
  interview_insights: MessageSquare,
  market_sizing: TrendingUp,
};

const artifactNames = {
  problem_statement: 'Problem Statement',
  customer_persona: 'Customer Persona',
  interview_guide: 'Interview Guide',
  interview_insights: 'Interview Insights',
  market_sizing: 'Market Sizing',
};

export default function ArtifactsPage() {
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtifact, setSelectedArtifact] = useState<any>(null);

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const fetchArtifacts = async () => {
    try {
      const response = await fetch('/api/artifacts');
      if (response.ok) {
        const data = await response.json();
        setArtifacts(data.map((a: any) => ({
          ...a,
          content: JSON.parse(a.content)
        })));
      }
    } catch (error) {
      console.error('Error fetching artifacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArtifact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artifact?')) return;
    
    try {
      const response = await fetch(`/api/artifacts/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setArtifacts(artifacts.filter(a => a.id !== id));
        if (selectedArtifact?.id === id) {
          setSelectedArtifact(null);
        }
      }
    } catch (error) {
      console.error('Error deleting artifact:', error);
    }
  };

  const downloadArtifact = (artifact: any) => {
    const data = JSON.stringify(artifact.content, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.type}_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">Loading artifacts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Artifacts</h1>
        <p className="mt-2 text-gray-600">
          View and manage all your startup artifacts in one place.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">All Artifacts</h2>
          <div className="space-y-3">
            {artifacts.length === 0 ? (
              <p className="text-gray-500 text-sm">No artifacts yet. Start by creating a problem statement.</p>
            ) : (
              artifacts.map((artifact) => {
                const Icon = artifactIcons[artifact.type as keyof typeof artifactIcons] || FileText;
                return (
                  <div
                    key={artifact.id}
                    onClick={() => setSelectedArtifact(artifact)}
                    className={`
                      p-4 bg-white rounded-lg border cursor-pointer transition-all
                      ${selectedArtifact?.id === artifact.id 
                        ? 'border-blue-500 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <Icon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {artifactNames[artifact.type as keyof typeof artifactNames]}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(artifact.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`
                        text-xs px-2 py-1 rounded
                        ${artifact.status === 'complete' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                        }
                      `}>
                        {artifact.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedArtifact ? (
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {artifactNames[selectedArtifact.type as keyof typeof artifactNames]}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Created on {new Date(selectedArtifact.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadArtifact(selectedArtifact)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteArtifact(selectedArtifact.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                {selectedArtifact.type === 'problem_statement' && (
                  <div>
                    <h3>Problem Statement</h3>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                      {selectedArtifact.content.statement}
                    </pre>
                  </div>
                )}

                {selectedArtifact.type === 'customer_persona' && (
                  <div>
                    <h3>{selectedArtifact.content.persona.name}</h3>
                    <div className="space-y-4">
                      <div>
                        <h4>Demographics</h4>
                        <p>{selectedArtifact.content.persona.demographics.profile}</p>
                        <p>{selectedArtifact.content.persona.demographics.jobDescription}</p>
                      </div>
                      <div>
                        <h4>Behaviors</h4>
                        <p>Task frequency: {selectedArtifact.content.persona.behaviors.taskFrequency}</p>
                        <p>Tools used: {selectedArtifact.content.persona.behaviors.toolsUsed}</p>
                      </div>
                      <div>
                        <h4>Frustrations</h4>
                        <ul>
                          {selectedArtifact.content.persona.frustrations.map((f: string, i: number) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                      {selectedArtifact.content.persona.quotes[0] && (
                        <div>
                          <h4>Quote</h4>
                          <p className="italic">"{selectedArtifact.content.persona.quotes[0]}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select an artifact to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}