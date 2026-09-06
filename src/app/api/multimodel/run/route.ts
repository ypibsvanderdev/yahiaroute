import { NextRequest, NextResponse } from "next/server";
import { executeMultiModelRun, type MultiModelRunRequest } from "@/lib/multimodel/orchestrator";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MultiModelRunRequest;

    if (!body || !body.task || !body.task.trim()) {
      return NextResponse.json(
        { error: "Task description is required." },
        { status: 400 }
      );
    }

    const runResult = await executeMultiModelRun({
      task: body.task.trim(),
      mode: body.mode || "collaborative",
      selectedModels: Array.isArray(body.selectedModels) ? body.selectedModels : [],
      synthesizerModel: body.synthesizerModel,
      systemPrompt: body.systemPrompt,
      temperature: body.temperature,
    });

    return NextResponse.json(runResult);
  } catch (error: any) {
    console.error("MultiModel API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during multi-model execution" },
      { status: 500 }
    );
  }
}
