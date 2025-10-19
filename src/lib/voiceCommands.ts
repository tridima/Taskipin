// Voice command processing with OpenAI

export interface ProcessedCommand {
  action: 'create' | 'update' | 'complete' | 'delete' | 'createGroup' | 'unknown';
  taskTitle?: string;
  taskDescription?: string;
  groupName?: string;
  targetId?: string;
}

export async function transcribeAudio(
  audioBlob: Blob,
  apiKey: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to transcribe audio');
  }

  const data = await response.json();
  return data.text;
}

export async function parseCommand(
  transcript: string,
  apiKey: string
): Promise<ProcessedCommand> {
  const systemPrompt = `You are a task management assistant. Parse the user's voice command and return a JSON object with the following structure:
{
  "action": "create" | "update" | "complete" | "delete" | "createGroup" | "unknown",
  "taskTitle": "string (for create/update actions)",
  "taskDescription": "string (optional, for create/update actions)",
  "groupName": "string (for createGroup action)",
  "targetId": "string (task or group identifier if mentioned)"
}

Examples:
- "Create a task to buy groceries" → {"action": "create", "taskTitle": "buy groceries"}
- "Add a new task call mom with a reminder to ask about dinner" → {"action": "create", "taskTitle": "call mom", "taskDescription": "ask about dinner"}
- "Mark buy groceries as complete" → {"action": "complete", "taskTitle": "buy groceries"}
- "Delete the task buy groceries" → {"action": "delete", "taskTitle": "buy groceries"}
- "Create a group called work tasks" → {"action": "createGroup", "groupName": "work tasks"}

Only return valid JSON, no explanations.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcript },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to parse command');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch {
    return { action: 'unknown' };
  }
}

