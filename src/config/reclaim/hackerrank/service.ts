import { getHackerrankProfileByApi } from "@/lib/apiUtils";
import { setHackerrankDatabyGithubId, setUsername } from "@/utils/dbUtils";
import { logToDiscord } from "@/utils/logger";

export async function processHackerRankData(
  githubId: any,
  proof: any,
  providerName: string
) {
  const username = JSON.parse(proof[0].claimData.context).extractedParameters
    .username;
  const lastUpdateTimeStamp = proof[0].claimData.timestampS;
  await setUsername(githubId, {
    hackerrankUsername: username,
  });
  const { currentPoints, stars } = await getHackerrankStats(username);
  await setHackerrankDatabyGithubId(BigInt(githubId), currentPoints, stars);
  return true;
}

export async function getHackerrankStats(username: string) {
  try {
    const data = await getHackerrankProfileByApi(username);
    let stars = 0;
    let currentPoints = 0;
    data.models.forEach((model: any) => {
      currentPoints += model.current_points;
      stars += model.stars;
    });
    return { currentPoints, stars };
  } catch (error) {
    await logToDiscord(`getHackerrankStats: ${(error as any).message}`, "ERROR");

    console.error("Error fetching Hackerrank stats:", error);
    return { currentPoints: 0, stars: 0 };
  }
}
