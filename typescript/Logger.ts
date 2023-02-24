import fs from 'fs'
import path from 'path'
import chalk from 'chalk';

function genTimestamp(f: string, s:string) {
    const pad = (inp: number) => {return (inp > 9 ? "" : "0") + inp}

    const date = new Date();
            const [month, day, year] = [
                date.getMonth(),
                date.getDate(),
                date.getFullYear(),
            ];
            const [hour, minutes, seconds] = [
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            ];
            return `${year}${f}${pad(month)}${f}${pad(day)} ${pad(hour)}${s}${pad(minutes)}${s}${pad(seconds)}`
}

interface ILogOptions {
    methods: any[],
    outDir: string
}

interface IFileOptions1 {
    oneFile: true
    filename: string
}
interface IFileOptions2 {
    oneFile: false
    filename?: never
}
type IFileOptions = IFileOptions1 | IFileOptions2

interface IConsoleOptions {
    formatLog?: boolean
}

enum LogMethods {
    File = "file",
    Console = "console",
    Html = "html"
}

function htmlContent(fname: string) {
    return "<head><title>"+fname+"</title></head><style>:root{--color-text:rgba(255, 255, 255, .87)}body{background-color:#1f1f1f;font-family:'Lucida Console','Courier New',monospace;padding:2rem;padding-top:9rem;overflow-y:auto;color:var(--color-text)}.log>*{margin-top:.2rem;margin-bottom:.2rem}.s{margin-right:.5rem}.s.warn{color:#dadd1e;margin-right:2.3rem}.s.success{color:#19c53e}.s.error{color:#d63939;margin-right:1.8rem}.s.info{color:#0059fd;margin-right:2.3rem}.log{display:flex;flex-direction:row;gap:.5rem}.settings{display:flex;flex-direction:row;margin-bottom:1.5rem;padding:.2rem;gap:1rem;align-items:center}.top{padding-top:2rem;position:fixed;top:0;background-color:#1f1f1f;width:calc(100% - 5rem)}.log:hover{background-color:#181818}.settings>button{background-color:#07f;border:none;cursor:pointer;font-size:1rem;color:var(--color-text);border-radius:.5rem;height:1.7rem}.divider{height:.2rem;background-color:var(--color-text);width:auto}.settings>button:hover{background-color:#005ac2}.hidden{display:none}.information>p{margin:unset}pre{font-size:1rem;font-weight:400}</style><script>function toggleTimestamp(){document.querySelectorAll('.t').forEach(e=>{e.classList.toggle('hidden')})};function toggleType(){document.querySelectorAll('.s').forEach(e=>{e.classList.toggle('hidden')})};</script><div class='top'><div class='settings'><button onclick='toggleTimestamp()'>Toggle Timestamp</button><button onclick='toggleType()'>Toggle Type</button><div class='information'><p>Current file: "+fname+"</p></div></div><div class='divider'></div></div>"
} 

class Method {
    public Console(options?: IConsoleOptions) {
        return {
            type: LogMethods.Console,
            options
        }
    }

    public File(options?: IFileOptions) {
        return {
            type: LogMethods.File,
            options
        }
    }

    public Html(options?: IFileOptions) {
        return {
            type: LogMethods.Html,
            options
        }
    }
}

interface IFLogOptions {
    type: string,
    message: string,
    colorify: (text: string) => void
}

export class LogModule {
    private outDir: string = path.join(__dirname, 'logs')
    private methods: any[]

    private logfilePath: string;
    private loghtmlPath: string;

    private logFile: boolean
    private logConsole: boolean
    private logHtml: boolean

    private formatConsoleLog: boolean

    constructor(options: ILogOptions) {
        if (options.methods.length < 1) throw Error("Please provide at least one method");
        if (options.outDir) this.outDir = options.outDir;
        this.methods = options.methods
    }

    public async init() {
        for await (const option of this.methods) {
            switch (option.type) {
                case LogMethods.Console:
                    await this.createConsoleLog(option)
                    break
                case LogMethods.File:
                    await this.createFileLog(option)
                    break
                case LogMethods.Html:
                    await this.createHtmlLog(option)
                    break
                default:
                    throw Error("Unknown method, type: " + option.type)
            }
        }

        [
            'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM', 'exit'
        ].forEach(function (sig) {
            process.on(sig, async function () {
                process.exit(0)
            });
        });
    }

    private async createFileLog({ options }: any) {
        this.logFile = true
        if (options && options.oneFile) {
            const { filename } = options

            if (filename.length < 5) throw Error("Filename, including file extention must be atleast 5 characters long.")
        
            if (!fs.existsSync(path.join(this.outDir, filename))) {
                await this.createFile(filename)
                this.logfilePath = path.join(this.outDir, filename)
            } else {
                this.logfilePath = path.join(this.outDir, filename)
            }

        } else {
            const filename = `${genTimestamp('-', '_')}.log`
            await this.createFile(filename)
            this.logfilePath = path.join(this.outDir, filename)
        }
    }

    private genMessage(type: string, content: string, color = chalk.blueBright) {
        return {timestamp: genTimestamp('-', ':'), type, message: content, colorify: color}
    }

    private async createConsoleLog({options}: any) {
        this.logConsole = true
        if (options && options.formatLog) {
            this.formatConsoleLog = true
            return
        }
    }

    private async createHtmlLog({options}: any) {
        this.logHtml = true
        if (options && options.oneFile) {
            const { filename } = options

            if (filename.length < 5 && !filename.endsWith('.html')) throw Error("Filename, including file extention (.html) must be atleast 5 characters long.")
        
            if (!fs.existsSync(path.join(this.outDir, filename))) {
                await this.createFile(filename, htmlContent(filename))
                this.loghtmlPath = path.join(this.outDir, filename)
            } else {
                this.loghtmlPath = path.join(this.outDir, filename)
            }

        } else {
            const filename = `${genTimestamp('-', '_')}.html`
            await this.createFile(filename, htmlContent(filename))
            this.loghtmlPath = path.join(this.outDir, filename)
        }
    }
    
    private async createFile(filename: string, content: string = "") {
        console.log("Creating file", path.join(this.outDir, filename))
        if (!fs.existsSync(this.outDir)) {
            fs.mkdirSync(this.outDir)
        }
        fs.writeFileSync(path.join(this.outDir, filename),
            content,
            {
                flag: "w"
            })
    }

    private writeFile(content: object | string) {
        fs.writeFileSync(this.logfilePath,
            typeof content === "string" ? content : JSON.stringify(content),
            {
                flag: "a"
            })
    }

    private log({type, message, colorify}: IFLogOptions) {
        const timestamp = genTimestamp('-', ':')
        const content = {
            timestamp,
            type,
            message
        }

        if (this.logConsole) {
            if (this.formatConsoleLog) {
                console.log(`[${timestamp}] ${colorify("["+type+"]")} ${message}`)
            } else {
                console.log(content)
            }
        }

        if (this.logFile) {
            this.writeFile(content)
        }

        if (this.logHtml) {
            fs.writeFileSync(this.loghtmlPath,
                `<div class="log"><p class="t">[${timestamp}]</p><p class="s ${type.toLowerCase()}">[${type}]</p><pre>${message}</pre></div>`,
                {
                    flag: "a"
                })
        }
    }

    public info(message: string) {
        this.log({type: "INFO", message, colorify: chalk.blueBright})
    }

    public success(message: string) {
        this.log({type: "SUCCESS", message, colorify: chalk.greenBright})
    }

    public warn(message: string) {
        this.log({type: "WARN", message, colorify: chalk.yellow})
    }

    public error(message: string) {
        this.log({type: "ERROR", message, colorify: chalk.redBright})
    }
}


interface IUseLogger {
    simpleSyntax?: boolean
    default?: "info" | "error" | "warn" | "success"
}

function useLoggerFunc(log: LogModule, app: any, options: IUseLogger = {}) {
    if (!options.default) options.default = "info"
    if (options.simpleSyntax) {
        
        app.log = (message: string) => log[options.default](message)
        app.logInfo = (message: string) => log.info(message)
        app.logSuccess = (message: string) => log.success(message)
        app.logWarn = (message: string) => log.warn(message)
        app.logError = (message: string) => log.error(message)
    }
    else {
        app.log = log
    }
}

async function createLogFunc(options: ILogOptions) {
    const log = new LogModule(options)
    await log.init()
    return log
}

export type DefaultLogType = LogModule['info'] | LogModule['success'] | LogModule['warn'] | LogModule['error']

//Exports
export const method = new Method()
export const useLogger = useLoggerFunc
export const createLog = createLogFunc

export class SimpleSyntax {
    log: DefaultLogType
    logInfo: LogModule['info']
    logSuccess: LogModule['success']
    logWarn: LogModule['warn']
    logError: LogModule['error']
}

export interface DefaultSyntax {
    log?: LogModule
}
