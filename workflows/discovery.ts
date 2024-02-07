import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as Discovery } from "../functions/discovery.ts";

const workflow = DefineWorkflow({
  callback_id: "discovery-step",
  title: "Create a Discovery questionnaire",
  input_parameters: {
    properties: {
      customer_role: { type: Schema.types.string },
      company_sector: { type: Schema.types.string },
      company_size: { type: Schema.types.string },
      extra_info: { type: Schema.types.string },
    },
    required: ["customer_role", "company_sector", "company_size"],
  },
});

workflow.addStep(Discovery, {
  customer_role: workflow.inputs.customer_role,
  company_sector: workflow.inputs.company_sector,
  company_size: workflow.inputs.company_size,
  extra_info: workflow.inputs.extra_info,
});

export default workflow;