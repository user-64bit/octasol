import { NextRequest, NextResponse } from "next/server";
import { getInstallationId } from "@/utils/dbUtils";

interface RequestData {
  githubId: number;
}

export async function POST(req: NextRequest) {
  try {
    const data: RequestData = await req.json();
    const githubId: number = data.githubId;
    const installationId = await getInstallationId(BigInt(githubId));
    return NextResponse.json({ installationId: Number(installationId) });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}
