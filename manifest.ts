import { Manifest } from "deno-slack-sdk/mod.ts";
import Discovery from "./workflows/discovery.ts";
import Notes from "./workflows/notes.ts";

export default Manifest({
  name: "SalesMate",
  description: "AI-powered app to help Sales teams",
  icon: "assets/SlackChatGPT.png",
  workflows: [Discovery, Notes],
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
