import fs from "fs";
import morganBody from "morgan-body";

const logFilePath = path.join(process.env.logPath, "console.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

console.log = (message) => {
  process.stdout.write(message + "\n");
  logStream.write(message + "\n");
};

const errorLogFilePath = path.join(process.env.logPath, "error.log");
const errorLogStream = fs.createWriteStream(errorLogFilePath, { flags: "a" });

console.error = (message) => {
  process.stdout.write(message + "\n");
  errorLogStream.write(message + "\n");
};

const httpLog = fs.createWriteStream(
  path.join(process.env.logPath, "httpLog.log"),
  {
    flags: "a",
  }
);

morganBody(app, {
  noColors: true,
  stream: httpLog,
});
