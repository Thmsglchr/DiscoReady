import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as Notes } from "../functions/notes.ts";

const workflow = DefineWorkflow({
  callback_id: "notes-step",
  title: "Structure meeting notes",
  input_parameters: {
    properties: {
      notes: { type: Schema.types.string },
    },
    required: ["notes"],
  },
});

workflow.addStep(Notes, {
  notes: workflow.inputs.notes,
});

export default workflow;