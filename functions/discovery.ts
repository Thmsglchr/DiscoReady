import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  API_KEY_ERROR,
  buildSystemMessage,
  calculateNumTokens, 
  callOpenAI,
  Message,
  OpenAIModel,
} from "./openai.ts";

export const def = DefineFunction({
  callback_id: "discovery",
  title: "Generate a Discovery questionnaire",
  source_file: "functions/discovery.ts",
  input_parameters: {
    properties: {
      customer_role: { type: Schema.types.string },
      company_sector: { type: Schema.types.string },
      company_size: { type: Schema.types.string },
      extra_info: { type: Schema.types.string },
    },
    required: ["customer_role", "company_sector", "company_size"],
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

  prompt = `I am part of the Go-To-Market Team at Slack. Create a Sales Discovery questionnaire for a ${inputs.customer_role} working in a ${inputs.company_size.toLowerCase()} ${inputs.company_sector} company using the PURPOSE framework.\n`;
  prompt += `PURPOSE stands for Pain, Use Cases, ROI, Process, Obstacles, Stakeholders, Execution.\n`;
  prompt += `- Pain focuses on Challenges, Business Impact, Deadlines\n`;
  prompt += `- Use Cases focuses on Current Setup, Desired Change, Possible Solution\n`;
  prompt += `- ROI focuses on Business Value, Personal Value, Metrics\n`;
  prompt += `- Process focuses on Approval Sequence\n`;
  prompt += `- Obstacles focuses on Solution Alignement, Competition\n`;
  prompt += `- Execution focuses on Challenges, Business Impact, Deadlines\n`;

  if(inputs.extra_info != null)
    prompt += `Take also into account the following information into the questions: ${inputs.extra_info}\n`;

  prompt += `Do not answer me as if I was asking a question but provide me with the questionnaire, and ONLY the questionnaire. It is more than essential and extremely crucial that the questionnaire is formatted so it can be easily pasted in a Slack canva.`;

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
  const modelLimit = model === OpenAIModel.GPT_4 ? 6000 : 4000;

  const body = JSON.stringify({
    "model": model,
    "messages": messages,
    "max_tokens": maxTokensForThisReply,
  });

  const answer = await callOpenAI(apiKey, 60, body);
  return { outputs: { answer } };
});
