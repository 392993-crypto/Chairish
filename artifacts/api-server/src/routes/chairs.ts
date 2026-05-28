import { Router, type IRouter } from "express";
import fs from "fs";
import path from "path";

const router: IRouter = Router();

// process.cwd() is the api-server package root, which is stable after compilation
const CHAIRS_FILE = path.join(process.cwd(), "data", "chairs.json");

function readChairs(): unknown[] {
  try {
    const raw = fs.readFileSync(CHAIRS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeChairs(chairs: unknown[]): void {
  fs.mkdirSync(path.dirname(CHAIRS_FILE), { recursive: true });
  fs.writeFileSync(CHAIRS_FILE, JSON.stringify(chairs, null, 2), "utf8");
}

router.get("/chairs", (_req, res) => {
  res.json(readChairs());
});

router.post("/chairs", (req, res) => {
  const chairs = readChairs();
  const newChair = { id: "chair_" + Date.now(), ...req.body };
  chairs.push(newChair);
  writeChairs(chairs);
  res.status(201).json({ success: true, chair: newChair });
});

export default router;
