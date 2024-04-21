const express = require("express");
const child_process = require("child_process");
const exec = child_process.exec;

const batteryWarriorRouter = express.Router();

batteryWarriorRouter.get("/execute-command", (req, res) => {
  exec("upower -i `upower -e | grep 'BAT'`", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    //Transforming Response to valid JSON
    const batteryInfo = {};
    const lines = stdout.split("\n");

    lines.forEach((line) => {
      const parts = line.trim().split(":");
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        batteryInfo[key] = value;
      }
    });
    res.status(200).json(batteryInfo);
  });
});

module.exports = batteryWarriorRouter;
