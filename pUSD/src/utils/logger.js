"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    constructor() {
        this.level = LogLevel.INFO;
    }
    setLevel(level) {
        this.level = level;
    }
    formatMessage(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const formattedArgs = args.length > 0 ? ` ${args.map(arg => {
            if (typeof arg === 'bigint') {
                return arg.toString();
            }
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2);
                }
                catch {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ')}` : '';
        return `[${timestamp}] ${level}: ${message}${formattedArgs}`;
    }
    debug(message, ...args) {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(this.formatMessage('DEBUG', message, ...args));
        }
    }
    info(message, ...args) {
        if (this.level <= LogLevel.INFO) {
            console.info(this.formatMessage('INFO', message, ...args));
        }
    }
    warn(message, ...args) {
        if (this.level <= LogLevel.WARN) {
            console.warn(this.formatMessage('WARN', message, ...args));
        }
    }
    error(message, ...args) {
        if (this.level <= LogLevel.ERROR) {
            console.error(this.formatMessage('ERROR', message, ...args));
        }
    }
}
exports.logger = new Logger();
