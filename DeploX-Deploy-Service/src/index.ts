import { createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";

async function main() {
  const subscriber = createClient();
  const publisher = createClient();

  await subscriber.connect();
  await publisher.connect();

  while (true) {
    const response = await subscriber.brPop('build-queue', 0);
    if (!response) continue;

    console.log(response);

    const id = response.element;

    await downloadS3Folder(`/output/${id}`);
    await buildProject(id);
    copyFinalDist(id);

    await publisher.hSet("status", id, "deployed");
  }
}

main();
