
import { GeminiAPIResponse } from './types';

// Function to fetch a response from Gemini API
export const fetchAIResponse = async (userInput: string, apiKey: string): Promise<string> => {
  // Updated to use the correct API version and endpoint format
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "You are a helpful study assistant. Provide concise, practical advice about studying, time management, coordination with study groups, and academic resources. Keep responses under 150 words and be supportive but direct. Here's the user's query: " + userInput
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error("Gemini API error details:", error);
    throw new Error(error.error?.message || 'Failed to fetch AI response');
  }
  
  const data: GeminiAPIResponse = await response.json();
  
  // Check if the response was blocked by safety settings
  if (data.promptFeedback?.blockReason) {
    throw new Error(`Response blocked: ${data.promptFeedback.blockReason}`);
  }
  
  // Extract the text from the response
  if (data.candidates && data.candidates.length > 0 && 
      data.candidates[0].content && data.candidates[0].content.parts && 
      data.candidates[0].content.parts.length > 0) {
    return data.candidates[0].content.parts[0].text;
  }
  
  throw new Error('No valid response from Gemini API');
};

// Generate a local response based on user input (improved fallback)
export const generateLocalResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  // Study techniques
  if (input.includes('study tip') || input.includes('how to study') || input.includes('study better') || input.includes('effective study')) {
    return "Here are some evidence-based study techniques:\n\n1. Active recall - test yourself instead of re-reading\n2. Spaced repetition - space out your study sessions over time\n3. Pomodoro Technique - 25 minutes focused work, 5 minute break\n4. Interleaving - mix different subjects in one study session\n5. Elaboration - explain concepts in your own words\n\nThe most effective one for you will depend on your learning style and the subject.";
  }
  
  // Resources and tools
  if (input.includes('resource') || input.includes('tool') || input.includes('website') || input.includes('app')) {
    return "Here are some top study resources:\n\n• Khan Academy - Free video lectures and practice exercises\n• Anki - Flashcard app using spaced repetition\n• Google Scholar - Academic paper search engine\n• Notion - Note-taking and organization\n• Quizlet - Study tools and flashcards\n• Zotero - Reference management\n• Forest App - Focus timer that gamifies concentration\n\nWhich specific subject are you looking for resources on?";
  }
  
  // Time management
  if (input.includes('time') || input.includes('schedule') || input.includes('plan') || input.includes('productive')) {
    return "Effective time management strategies:\n\n1. Create a weekly master schedule with fixed commitments\n2. Use time-blocking for study sessions (2-hour max blocks)\n3. Prioritize tasks using Eisenhower Matrix (urgent/important)\n4. Set specific goals for each study session\n5. Build in buffer time between activities\n6. Track where your time actually goes for a week\n7. Schedule breaks and downtime - they're essential!\n\nWhich aspect of time management do you struggle with most?";
  }
  
  // Group study
  if (input.includes('group') || input.includes('collaborate') || input.includes('team') || input.includes('partner')) {
    return "For effective group studying:\n\n1. Set an agenda before each session with clear goals\n2. Assign roles (facilitator, timekeeper, note-taker)\n3. Use the Jigsaw method: each person masters a section, then teaches it\n4. Implement peer quizzing to improve recall\n5. Keep groups small (3-5 people is optimal)\n6. Meet regularly but not excessively (1-2 times per week)\n7. Use collaborative tools like shared documents\n\nWhat subject is your study group focusing on?";
  }
  
  // Exam preparation
  if (input.includes('exam') || input.includes('test') || input.includes('quiz') || input.includes('final')) {
    return "Exam preparation strategy:\n\n1. Start early - at least 1-2 weeks before major exams\n2. Create a study schedule with specific topics for each day\n3. Practice with past papers under timed conditions\n4. Focus on understanding concepts, not just memorizing\n5. Teach the material to someone else or explain it aloud\n6. Use mind maps to connect related concepts\n7. Get proper sleep, especially the night before the exam\n\nHow soon is your exam, and what subject is it for?";
  }
  
  // Motivation and focus
  if (input.includes('focus') || input.includes('concentrate') || input.includes('distract') || input.includes('motivat')) {
    return "To improve focus and motivation:\n\n1. Remove digital distractions (try apps like Forest or Freedom)\n2. Use implementation intentions: \"When I sit at my desk, I will work on X for 30 minutes\"\n3. Create a dedicated study environment\n4. Break large tasks into smaller, manageable chunks\n5. Reward yourself after completing difficult tasks\n6. Find your biological prime time when you're naturally most alert\n7. Connect your current work to your long-term goals\n\nWhich distraction impacts you most?";
  }
  
  // Note taking
  if (input.includes('note') || input.includes('write') || input.includes('summary') || input.includes('information')) {
    return "Effective note-taking methods:\n\n1. Cornell Method - divide page into sections for notes, cues, and summary\n2. Mind Mapping - visual organization with central concept and branches\n3. Outline Method - hierarchical organization with main points and sub-points\n4. Charting Method - organized in columns and rows for comparison\n5. Sentence Method - write complete sentences for each main point\n\nDon't just copy verbatim - process and reword information in your own terms for better retention.";
  }
  
  // Reading and comprehension
  if (input.includes('read') || input.includes('book') || input.includes('textbook') || input.includes('article') || input.includes('paper')) {
    return "For better reading comprehension:\n\n1. Use the SQ3R method: Survey, Question, Read, Recite, Review\n2. Preview material before deep reading (scan headings, summaries)\n3. Highlight and annotate strategically, not excessively\n4. Summarize key points in your own words after each section\n5. Connect new information to concepts you already know\n6. Read difficult material when you're most alert\n7. Take short breaks every 25-30 minutes of reading\n\nWhat type of material are you reading?";
  }
  
  // Default response
  return "I'm your Study Assistant with tips on effective learning strategies. You can ask me about:\n\n• Study techniques and methods\n• Time management and productivity\n• Group study coordination\n• Resource recommendations\n• Exam preparation strategies\n• Note-taking methods\n• Reading comprehension\n• Handling academic stress\n\nWhat would you like help with today?";
};
