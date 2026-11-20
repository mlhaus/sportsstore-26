import { readFileSync } from "fs";
import { getEnvironment, Env } from "./environment";
import { merge } from "./merge";
import { config as dotenvconfig } from "dotenv";
const file = process.env.SERVER_CONFIG ?? "server.config.json"
const data = JSON.parse(readFileSync(file).toString());
dotenvconfig({
    path: getEnvironment().toString() + ".env"
});
try {
    const envFile = getEnvironment().toString() + "." + file;
    const envData = JSON.parse(readFileSync(envFile).toString());
    merge(data, envData);
} catch {
    // do nothing - file doesn't exist or isn't readable
}

const appUrl = process.env.APP_URL?.replace(/\/+$/, "");

if (process.env.AUTH_REDIRECT_URL || appUrl) {
    data.auth ??= {};
    data.auth.openauth ??= {};
    data.auth.openauth.redirectionUrl =
        process.env.AUTH_REDIRECT_URL || `${appUrl}/signin-google`;
}

if (process.env.ADMIN_AUTH_REDIRECT_URL || appUrl) {
    data.admin ??= {};
    data.admin.openauth ??= {};
    data.admin.openauth.redirectionUrl =
        process.env.ADMIN_AUTH_REDIRECT_URL || `${appUrl}/auth-signin-google`;
}

export const getConfig = (path: string, defaultVal: any = undefined) : any => {
    const paths = path.split(":");
    let val = data;
    paths.forEach(p => val = val[p]);
    return val ?? defaultVal;
}
export const getSecret = (name: string) => {
    const secret = process.env[name];
    if(secret === undefined) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return secret;
}
export const getDatabaseSettings = (settings: Record<string, any> = {}) => {
    if (settings.dialect === "sqlite") {
        return { ...settings };
    }
    const port = Number(getSecret("DB_PORT"));
    if (Number.isNaN(port)) {
        throw new Error("Invalid environment variable: DB_PORT must be a number");
    }
    return {
        ...settings,
        host: getSecret("DB_HOST"),
        database: getSecret("DB_DATABASE"),
        port,
        username: getSecret("DB_USERNAME"),
        password: getSecret("DB_PASSWORD")
    };
}
export { getEnvironment, Env };
