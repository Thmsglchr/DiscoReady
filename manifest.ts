import { Manifest } from "deno-slack-sdk/mod.ts";
import Discovery from "./workflows/discovery.ts";

export default Manifest({
  name: "NextGenChatGPT",
  description: "ChatGPT on Slack's Next Gen platform",
  icon: "assets/openai.png",
  workflows: [Discovery],
  outgoingDomains: ["api.openai.com"],
  botScopes: [
    "commands",
    "app_mentions:read",
    "chat:write",
    "chat:write.public",
    "channels:join",
    "channels:history",
    "triggers:read",
    "triggers:write",
  ],
});
