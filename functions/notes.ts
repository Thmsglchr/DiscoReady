import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  API_KEY_ERROR,
  callOpenAI,
  Message,
  OpenAIModel,
} from "./openai.ts";

export const def = DefineFunction({
  callback_id: "notes",
  title: "Structure meeting notes from draft",
  source_file: "functions/notes.ts",
  input_parameters: {
    properties: {
      notes: { type: Schema.types.string },
    },
    required: ["notes"],
  },
  output_parameters: {
    properties: { answer: { type: Schema.types.string } },
    required: ["answer"],
  },
});

export default SlackFunction(def, async ({ inputs, env, token }) => {
  const apiKey = env.OPENAI_API_KEY;
  let prompt = "";

  if (!apiKey) {
    console.log(API_KEY_ERROR);
    return { error: API_KEY_ERROR };
  }

  prompt = `Here are my Sales meeting notes: ${inputs.notes}.\n`;
  prompt += `Reorder and structure them so they are very clear, highly professional, and can easily be shared with the rest of the Sales team in an official document. When needed, use sections, bullet points, etc.\n`;
  prompt += `Do not answer me as if I was asking a question but provide me with the reordered and structured meeting notes, and ONLY the reordered and structured meeting notes. It is more than essential that you do not make any extra comment, and extremely crucial that the meeting notes are professionally formatted so they can easily be pasted in Slack canvas.`;

  const messages: Message[] = [
    {
      "role": "user",
      "content": prompt,
    },
  ];

  const model = env.OPENAI_MODEL
    ? env.OPENAI_MODEL as OpenAIModel
    : OpenAIModel.GPT_3_5_TURBO;
  const maxTokensForThisReply = 1024;

  const body = JSON.stringify({
    "model": model,
    "messages": messages,
    "max_tokens": maxTokensForThisReply,
  });

  const answer = await callOpenAI(apiKey, 45, body);
  return { outputs: { answer } };
});
