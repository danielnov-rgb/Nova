import type { Script, VideoContext } from "../types.js";
import { BaseVideoAgent } from "./base.js";

export class ScriptAgent extends BaseVideoAgent<VideoContext, Script> {
  constructor() {
    super({
      stageId: "script",
      stageName: "Script Generator",
      description: "Generates structured video script via Claude",
    });
  }

  protected async buildOutput(context: VideoContext): Promise<Script> {
    return context.clients.anthropic.generateScript({
      videoType: context.videoType,
      clientProfile: context.clientProfile,
    });
  }
}
