import { redisClient } from "../model/redis.js";
import { groupById } from "../controller/apiReport.js";

export async function processQueue() {
  if (redisClient.isReady) {
    let tasks = await redisClient.brPop("orderTotal", 5);

    if (Array.isArray(tasks)) {
      tasks.forEach(async (task) => {
        let totalGroupbyId = groupById(JSON.parse(task));
        let result = {};
        const userIds = 6;
        result.data = [];
        for (let i = 1; i < userIds; i++) {
          let total = totalGroupbyId[i];
          result.data.push({ user_id: i, total });
        }
        await redisClient.rPop("orderTotal");
        console.log(result); //write how to send data to client in pr
      });
    } else {
      console.log("No task in the queue.");
    }
  }
}
