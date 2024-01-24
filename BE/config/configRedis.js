require('dotenv').config()
import { createClient } from 'redis';
// const Redis = require("ioredis");
// const redis = new Redis();
// redis.get("key").then((result) => {
//   console.log(result); // Prints "value"
// });
// import { createClient } from 'redis';

// (async () => {
//   const redisClient = createClient(process.env.PORT_REDIS);

//   redisClient.on("error", (error) => console.error(`Error : ${error}`));

//   await redisClient.connect();
//   // await redisClient.set('key', 'value');
//   const value = await redisClient.get('key');
//   console.log(value)
//   await redisClient.disconnect();
// })();

let configRedis = async () => {
    let redisClient = await createClient();

    redisClient.on("error", (error) => console.error(`Error : ${error}`)).connect();

    // await redisClient.connect();
    // const value = await redisClient.get('key');
    // console.log(value)
};

module.exports = configRedis;