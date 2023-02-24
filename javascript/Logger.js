"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSyntax = exports.createLog = exports.useLogger = exports.method = exports.LogModule = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
function genTimestamp(f, s) {
    const pad = (inp) => { return (inp > 9 ? "" : "0") + inp; };
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
    return `${year}${f}${pad(month)}${f}${pad(day)} ${pad(hour)}${s}${pad(minutes)}${s}${pad(seconds)}`;
}
var LogMethods;
(function (LogMethods) {
    LogMethods["File"] = "file";
    LogMethods["Console"] = "console";
    LogMethods["Html"] = "html";
})(LogMethods || (LogMethods = {}));
function htmlContent(fname) {
    return "<head><title>" + fname + "</title></head><style>:root{--color-text:rgba(255, 255, 255, .87)}body{background-color:#1f1f1f;font-family:'Lucida Console','Courier New',monospace;padding:2rem;padding-top:9rem;overflow-y:auto;color:var(--color-text)}.log>*{margin-top:.2rem;margin-bottom:.2rem}.s{margin-right:.5rem}.s.warn{color:#dadd1e;margin-right:2.3rem}.s.success{color:#19c53e}.s.error{color:#d63939;margin-right:1.8rem}.s.info{color:#0059fd;margin-right:2.3rem}.log{display:flex;flex-direction:row;gap:.5rem}.settings{display:flex;flex-direction:row;margin-bottom:1.5rem;padding:.2rem;gap:1rem;align-items:center}.top{padding-top:2rem;position:fixed;top:0;background-color:#1f1f1f;width:calc(100% - 5rem)}.log:hover{background-color:#181818}.settings>button{background-color:#07f;border:none;cursor:pointer;font-size:1rem;color:var(--color-text);border-radius:.5rem;height:1.7rem}.divider{height:.2rem;background-color:var(--color-text);width:auto}.settings>button:hover{background-color:#005ac2}.hidden{display:none}.information>p{margin:unset}pre{font-size:1rem;font-weight:400}</style><script>function toggleTimestamp(){document.querySelectorAll('.t').forEach(e=>{e.classList.toggle('hidden')})};function toggleType(){document.querySelectorAll('.s').forEach(e=>{e.classList.toggle('hidden')})};</script><div class='top'><div class='settings'><button onclick='toggleTimestamp()'>Toggle Timestamp</button><button onclick='toggleType()'>Toggle Type</button><div class='information'><p>Current file: " + fname + "</p></div></div><div class='divider'></div></div>";
}
class Method {
    Console(options) {
        return {
            type: LogMethods.Console,
            options
        };
    }
    File(options) {
        return {
            type: LogMethods.File,
            options
        };
    }
    Html(options) {
        return {
            type: LogMethods.Html,
            options
        };
    }
}
class LogModule {
    constructor(options) {
        this.outDir = path_1.default.join(__dirname, 'logs');
        if (options.methods.length < 1)
            throw Error("Please provide at least one method");
        if (options.outDir)
            this.outDir = options.outDir;
        this.methods = options.methods;
    }
    init() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _d = true, _e = __asyncValues(this.methods), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const option = _c;
                        switch (option.type) {
                            case LogMethods.Console:
                                yield this.createConsoleLog(option);
                                break;
                            case LogMethods.File:
                                yield this.createFileLog(option);
                                break;
                            case LogMethods.Html:
                                yield this.createHtmlLog(option);
                                break;
                            default:
                                throw Error("Unknown method, type: " + option.type);
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            [
                'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM', 'exit'
            ].forEach(function (sig) {
                process.on(sig, function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        process.exit(0);
                    });
                });
            });
        });
    }
    createFileLog({ options }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logFile = true;
            if (options && options.oneFile) {
                const { filename } = options;
                if (filename.length < 5)
                    throw Error("Filename, including file extention must be atleast 5 characters long.");
                if (!fs_1.default.existsSync(path_1.default.join(this.outDir, filename))) {
                    yield this.createFile(filename);
                    this.logfilePath = path_1.default.join(this.outDir, filename);
                }
                else {
                    this.logfilePath = path_1.default.join(this.outDir, filename);
                }
            }
            else {
                const filename = `${genTimestamp('-', '_')}.log`;
                yield this.createFile(filename);
                this.logfilePath = path_1.default.join(this.outDir, filename);
            }
        });
    }
    genMessage(type, content, color = chalk_1.default.blueBright) {
        return { timestamp: genTimestamp('-', ':'), type, message: content, colorify: color };
    }
    createConsoleLog({ options }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logConsole = true;
            if (options && options.formatLog) {
                this.formatConsoleLog = true;
                return;
            }
        });
    }
    createHtmlLog({ options }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logHtml = true;
            if (options && options.oneFile) {
                const { filename } = options;
                if (filename.length < 5 && !filename.endsWith('.html'))
                    throw Error("Filename, including file extention (.html) must be atleast 5 characters long.");
                if (!fs_1.default.existsSync(path_1.default.join(this.outDir, filename))) {
                    yield this.createFile(filename, htmlContent(filename));
                    this.loghtmlPath = path_1.default.join(this.outDir, filename);
                }
                else {
                    this.loghtmlPath = path_1.default.join(this.outDir, filename);
                }
            }
            else {
                const filename = `${genTimestamp('-', '_')}.html`;
                yield this.createFile(filename, htmlContent(filename));
                this.loghtmlPath = path_1.default.join(this.outDir, filename);
            }
        });
    }
    createFile(filename, content = "") {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creating file", path_1.default.join(this.outDir, filename));
            if (!fs_1.default.existsSync(this.outDir)) {
                fs_1.default.mkdirSync(this.outDir);
            }
            fs_1.default.writeFileSync(path_1.default.join(this.outDir, filename), content, {
                flag: "w"
            });
        });
    }
    writeFile(content) {
        fs_1.default.writeFileSync(this.logfilePath, typeof content === "string" ? content : JSON.stringify(content), {
            flag: "a"
        });
    }
    log({ type, message, colorify }) {
        const timestamp = genTimestamp('-', ':');
        const content = {
            timestamp,
            type,
            message
        };
        if (this.logConsole) {
            if (this.formatConsoleLog) {
                console.log(`[${timestamp}] ${colorify("[" + type + "]")} ${message}`);
            }
            else {
                console.log(content);
            }
        }
        if (this.logFile) {
            this.writeFile(content);
        }
        if (this.logHtml) {
            fs_1.default.writeFileSync(this.loghtmlPath, `<div class="log"><p class="t">[${timestamp}]</p><p class="s ${type.toLowerCase()}">[${type}]</p><pre>${message}</pre></div>`, {
                flag: "a"
            });
        }
    }
    info(message) {
        this.log({ type: "INFO", message, colorify: chalk_1.default.blueBright });
    }
    success(message) {
        this.log({ type: "SUCCESS", message, colorify: chalk_1.default.greenBright });
    }
    warn(message) {
        this.log({ type: "WARN", message, colorify: chalk_1.default.yellow });
    }
    error(message) {
        this.log({ type: "ERROR", message, colorify: chalk_1.default.redBright });
    }
}
exports.LogModule = LogModule;
function useLoggerFunc(log, app, options = {}) {
    if (!options.default)
        options.default = "info";
    if (options.simpleSyntax) {
        app.log = (message) => log[options.default](message);
        app.logInfo = (message) => log.info(message);
        app.logSuccess = (message) => log.success(message);
        app.logWarn = (message) => log.warn(message);
        app.logError = (message) => log.error(message);
    }
    else {
        app.log = log;
    }
}
function createLogFunc(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const log = new LogModule(options);
        yield log.init();
        return log;
    });
}
//Exports
exports.method = new Method();
exports.useLogger = useLoggerFunc;
exports.createLog = createLogFunc;
class SimpleSyntax {
}
exports.SimpleSyntax = SimpleSyntax;
//# sourceMappingURL=Logger.js.map
