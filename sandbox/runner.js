import fs from "fs";
import { spawn,exec } from "child_process";
import path from "path";
import { stdout } from "process";


const SANDBOX_PATH = path.join(process.cwd(), "sandbox");

// Tạo folder sandbox nếu chưa tồn tại
if (!fs.existsSync(SANDBOX_PATH)) fs.mkdirSync(SANDBOX_PATH);

export async function saveCodeToFile(code) {
    const filePath = path.join(SANDBOX_PATH, "Main.cpp");

    await fs.writeFileSync(filePath, code);
    return filePath;
}


export function compileCpp() {
    return new Promise((resolve) => {
        const compileCmd = `g++ "${path.join(SANDBOX_PATH, "Main.cpp")}" -o "${path.join(SANDBOX_PATH, "Main.exe")}"`;
        //const compileCmd = `g++ sandbox/Main.cpp -o sandbox/Main.exe`;

        exec(compileCmd, (error, stdout, stderr) => {
            if (error) {
                resolve({
                    success: false,
                    error: stderr
                });
            } else {
                resolve({
                    success: true,
                    error: null
                });
            }
        });
    });
}


export function runCpp(input, timeLimit , memoryLimit ) {
    return new Promise((resolve) => {
        const exePath = path.join(SANDBOX_PATH, "Main.exe");
        //const child=spawn(cmd);

        // Giới hạn bộ nhớ bằng --max-old-space-size (MB)
        const child = spawn(exePath, {
            env: {
                ...process.env,
                NODE_OPTIONS: `--max-old-space-size=${memoryLimit}`
            }
        });


         let output = "";
        let errorOutput = "";

        //
        const startTime = Date.now();

        // Nhận stdout
        child.stdout.on("data", (data) => {
            output += data.toString();
        });

        // Nhận stderr
        child.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        // Khi chương trình kết thúc
        child.on("close", (code) => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= timeLimit) {
                return resolve({
                    status: "TLE",
                    stdout: "",
                    stderr: "Time Limit Exceeded",
                    time: elapsed,
                    memory: memoryLimit
                });
            }

            if (errorOutput.includes("Cannot allocate memory")) {
                return resolve({
                    status: "MLE",
                    stdout: "",
                    stderr: "Memory Limit Exceeded",
                    time: elapsed,
                    memory: memoryLimit
                });
            }

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
                stdout: output.trim(),
                stderr: "",
                time: elapsed,
                memory: memoryLimit
            });
            // if (code !== 0) {
            //     resolve({
            //         success: false,
            //         error: errorOutput || `Exit code ${code}`
            //     });
            // } else {
            //     resolve({
            //         success: true,
            //         output: output.trim()
            //     });
            // }
        });

        // Gửi input vào stdin
        if (input) {
            child.stdin.write(input + "\n");
        }
        child.stdin.end();

        // Timeout xử lý an toàn
        setTimeout(() => {
            if (!child.killed) {
                child.kill();
                resolve({
                    status: "TLE",
                    stdout: "",
                    stderr: "Time Limit Exceeded",
                    time: timeLimit,
                    memory: memoryLimit
                });
                // resolve({
                //     success: false,
                //     error: "Time Limit Exceeded"
                // });
            }
        }, timeLimit);
    
    });

}


