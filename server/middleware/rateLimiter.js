
export function checkKey(reqCountTable, ip, resetWindow, limit) {
  if (reqCountTable.hasOwnProperty(ip)) {
    let clinetMemory = reqCountTable[ip].memory;

    if (clinetMemory.resetTime > Date.now()) {
      clinetMemory.totalHits += 1;
      clinetMemory.timeBeforExpireSec =
        (clinetMemory.resetTime - Date.now()) / 1000;
      if (clinetMemory.totalHits > limit - 1) {
        return false;
      }
    } else {
      delete reqCountTable[ip];
      createNewKey(reqCountTable, resetWindow, ip);
    }
  } else {
    createNewKey(reqCountTable, resetWindow, ip);
  }
  return true;
}


export function createNewKey(reqCountTable, resetWindow, ip) {
  let client = {};
  client.totalHits = 0;
  client.resetTime = new Date();
  client.resetTime.setTime(Date.now() + resetWindow);
  client.timeBeforExpireSec = (client.resetTime - Date.now()) / 1000;
  let oneIP = {};
  oneIP[ip] = {};
  oneIP[ip].memory = client;
  Object.assign(reqCountTable, oneIP);
  return reqCountTable;
}

const reqCountTable = {};

export const ratelimiter = async (req, res, next) => {
  const { ip } = req;
  const rateLimitResult = checkKey(reqCountTable, ip, 30000, 20);
  if (!rateLimitResult) {
    return res.status(429).json("Too many request.");
  }
  return next();
};

