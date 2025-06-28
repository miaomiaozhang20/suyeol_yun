import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please add ANTHROPIC_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    // Build system prompt based on context
    const systemPrompt = buildSystemPrompt(context);
    
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages
    });

    return NextResponse.json({
      content: response.content[0].text,
      usage: response.usage
    });
  } catch (error: any) {
    console.error('Claude API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get AI response' },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(context: any): string {
  const { stage, previousAnswers, currentModule } = context;
  
  let basePrompt = `You are an experienced startup mentor helping founders refine their problem statements through iterative conversation. Your role is to:

1. Ask thoughtful, probing questions that help founders think deeper
2. Challenge assumptions constructively
3. Help identify blind spots
4. Guide them toward clearer, more specific problem definitions
5. Provide feedback on their responses
6. Suggest improvements and refinements

Current module: ${currentModule || 'Problem Statement'}
Stage: ${stage || 'initial'}
`;

  if (previousAnswers) {
    basePrompt += `\n\nPrevious context from the founder:\n`;
    Object.entries(previousAnswers).forEach(([key, value]) => {
      basePrompt += `${key}: ${value}\n`;
    });
  }

  basePrompt += `\n\nGuidelines:
- Be conversational and encouraging
- Ask one focused question at a time
- Provide specific examples when helpful
- If their answer is vague, ask for clarification
- Help them move from broad problems to specific, solvable ones
- When appropriate, summarize what you've learned and ask for confirmation
- If they seem stuck, provide gentle suggestions or frameworks`;

  return basePrompt;
}