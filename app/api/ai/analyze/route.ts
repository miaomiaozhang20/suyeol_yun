import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { problemStatement, stage } = await request.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert startup advisor analyzing problem statements. 
    Provide specific, actionable feedback on the problem statement focusing on:
    1. Clarity and specificity
    2. Target customer definition
    3. Problem severity and urgency
    4. Solution opportunity
    5. Market potential
    
    Be constructive and suggest specific improvements. Format your response with clear sections.`;
    
    const userPrompt = `Please analyze this problem statement and provide detailed feedback:
    
    ${problemStatement}
    
    Stage: ${stage}
    
    Provide:
    1. Strengths (what's good)
    2. Areas for improvement
    3. Specific suggestions to make it stronger
    4. Questions that need answering`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    return NextResponse.json({
      analysis: response.content[0].text,
      usage: response.usage
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze' },
      { status: 500 }
    );
  }
}