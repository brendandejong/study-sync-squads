
// Function to fetch a response from OpenAI API
export const fetchAIResponse = async (userInput: string, apiKey: string): Promise<string> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful study assistant. Provide concise, practical advice about studying, time management, coordination with study groups, and academic resources. Keep responses under 150 words and be supportive but direct."
        },
        {
          role: "user",
          content: userInput
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch AI response');
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
};

// Generate a local response based on user input (fallback)
export const generateLocalResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  if (input.includes('study tip') || input.includes('how to study') || input.includes('study better')) {
    return "Try the Pomodoro Technique: study for 25 minutes, then take a 5-minute break. This helps maintain focus and prevent burnout while studying.";
  }
  
  if (input.includes('resource') || input.includes('tool') || input.includes('website') || input.includes('app')) {
    return "I recommend checking out Khan Academy for free courses, Anki for flashcards using spaced repetition, or Google Scholar for academic papers. These are great for supplementing your studies.";
  }
  
  if (input.includes('time') || input.includes('schedule') || input.includes('plan')) {
    return "For effective time management, create a weekly schedule with study blocks, breaks, and other activities. Studies show that consistent study sessions of 1-2 hours are more effective than cramming.";
  }
  
  if (input.includes('group') || input.includes('collaborate') || input.includes('team')) {
    return "For effective group studying, set clear goals for each session, assign roles, and make sure everyone participates. You can use the calendar feature to schedule your sessions.";
  }
  
  if (input.includes('exam') || input.includes('test') || input.includes('quiz')) {
    return "When preparing for exams, create a study plan, practice with past exams if available, and form a study group. Research shows that teaching concepts to others is one of the best ways to solidify your understanding.";
  }
  
  return "I'm here to help with your study needs. You can ask me about study techniques, time management, resources, or how to make the most of your study groups.";
};
