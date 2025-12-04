import fs from "fs";
import { spawn,exec } from "child_process";
import path from "path";


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


// async function test() {
//     await saveCodeToFile(`
//         #include <iostream>
//         using namespace std;
//         int main(){
//             cout << "Hello test";
//             return 0;
//         }
//     `);

//     const result = await compileCpp();
//     console.log(result);
// }

// test();  // bật khi muốn kiểm tra


export function runCpp(input, timeout = 2000) {
    return new Promise((resolve) => {
        const cmd = path.join(SANDBOX_PATH, "Main.exe");
        const child=spawn(cmd);


        // const process = exec(cmd, { timeout }, (error, stdout, stderr) => {
        //     if (error) {
        //         if (error.killed) {
        //             return resolve({
        //                 success: false,
        //                 error: "Time Limit Exceeded"
        //             });
        //         }

        //         return resolve({
        //             success: false,
        //             error: stderr || error.message
        //         });
        //     }

        //     resolve({
        //         success: true,
        //         output: stdout.trim()
        //     });
        // });

        // // Gửi input vào chương trình
        // if (input) {
        //     process.stdin.write(input);
        // }

        // process.stdin.end();
    
         let output = "";
        let errorOutput = "";

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
            if (code !== 0) {
                resolve({
                    success: false,
                    error: errorOutput || `Exit code ${code}`
                });
            } else {
                resolve({
                    success: true,
                    output: output.trim()
                });
            }
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
                    success: false,
                    error: "Time Limit Exceeded"
                });
            }
        }, timeout);
    
    });

}


// async function runAllTestCases(testcases) {
//     let results = [];

//     for (let tc of testcases) {
//         const r = await runCpp(tc.input);

//         results.push({
//             input: tc.input,
//             expected: tc.output,
//             actual: r.output || r.error,
//             pass: r.success && r.output == tc.output
//         });
//     }

//     return results;
// }
