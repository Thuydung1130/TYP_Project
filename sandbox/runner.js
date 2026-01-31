

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawn } from "child_process";

const SANDBOX_PATH = path.join(process.cwd(), "sandbox");
if (!fs.existsSync(SANDBOX_PATH)) fs.mkdirSync(SANDBOX_PATH);

//
// 1. TẠO SUBMISSION FOLDER
//
export function createSubmissionDir() {
    const id = "sub_" + crypto.randomUUID();
    const dir = path.join(SANDBOX_PATH, id);
    fs.mkdirSync(dir);
    return dir;
}

//
// 2. LƯU CODE
//
export function saveCodeToFile(code, submissionDir) {
    const filePath = path.join(submissionDir, "Main.cpp");
    fs.writeFileSync(filePath, code);
    return filePath;
}


//
// 3. COMPILE (DOCKER)
//
export function compileCpp(submissionDir) {
    return new Promise((resolve) => {
        const dockerArgs = [
            "run", "--rm",
            "-v", `${submissionDir}:/work`,
            "-w", "/work",
            "gcc:latest",
            "g++", "Main.cpp", "-o", "Main"
        ];

        const child = spawn("docker", dockerArgs);

        let stderr = "";
        child.stderr.on("data", d => stderr += d.toString());

        child.on("close", (code) => {
            if (code !== 0) {
                resolve({ success: false, error: stderr });
            } else {
                resolve({ success: true, error: null });
            }
        });
    });
}

//
// 4. RUN (DOCKER) – GIỮ NGUYÊN FORMAT KẾT QUẢ
//
export function runCpp(submissionDir, input, timeLimit, memoryLimit) {
    return new Promise((resolve) => {
        let finished = false;
        let timer = null;
        
        const dockerArgs = [
            "run", "--rm",
            "--memory", `${memoryLimit}m`,
            "--cpus", "0.5",
            "--pids-limit", "64",
            "--network", "none",
            "-v", `${submissionDir}:/work`,
            "-w", "/work",
            "gcc:latest",
            "sh", "-c",
            `echo "${input ?? ""}" | ./Main`
        ];

        const startTime = Date.now();
        const child = spawn("docker", dockerArgs);

        let output = "";
        let errorOutput = "";

        timer = setTimeout(() => {
            if (finished) return;
            finished = true;
            

            child.kill("SIGKILL");

            resolve({
                status: "TLE",
                stdout: "",
                stderr: "Time Limit Exceeded",
                time: timeLimit,
                memory: memoryLimit
            });
        }, timeLimit);

        

        child.stdout.on("data", d => {

            output += d.toString()
        });
        child.stderr.on("data", d => {

            errorOutput += d.toString()
        });

        

        child.on("close", (code) => {
            if (finished) return;        // 👈 CHỐT CHẶN
            finished = true;

            if (timer) clearTimeout(timer);
            

            const elapsed = Date.now() - startTime;


            const err = (errorOutput || "").toLowerCase();


            // 2️⃣ Runtime Error
            if (code !== 0) {
                return resolve({
                    status: "RTE",
                    stdout: "",
                    stderr: errorOutput || `Exit code ${code}`,
                    time: elapsed,
                    memory: memoryLimit
                });
            }

            
            resolve({
                status: "OK",
                stdout: output.replace(/\r\n/g, "\n").trim(),
                stderr: "",
                time: elapsed,
                memory: memoryLimit
            });
        });
    });
}

//
// 5. CLEANUP (RẤT QUAN TRỌNG)
//
export function cleanupSubmission(submissionDir, retries = 15) {
    //fs.rmSync(submissionDir, { recursive: true, force: true });
    try {
        fs.rmSync(submissionDir, { recursive: true, force: true });
    } catch (err) {
        if (retries <= 0) {
            console.error("Cleanup failed:", err.message);
            return;
        }

        // Docker chưa nhả mount → đợi rồi thử lại
        setTimeout(() => {
            cleanupSubmission(submissionDir, retries - 1);
        }, 500);
    }
}




