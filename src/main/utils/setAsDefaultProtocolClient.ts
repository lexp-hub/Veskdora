/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2025 Vendicated and Vesktop contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { app } from "electron";
import fs from "fs";
import os from "os";
import path from "path";

let registrationQueue = Promise.resolve(true);

export function setAsDefaultProtocolClient(protocol: string | string[]): Promise<boolean> {
    const protocols = Array.isArray(protocol) ? protocol : [protocol];
    registrationQueue = registrationQueue
        .then(() => registerProtocols(protocols))
        .catch(err => {
            console.error("Failed to set default protocol client:", err);
            return false;
        });
    return registrationQueue;
}

function registerProtocols(protocols: string[]): boolean {
    if (process.platform !== "linux") {
        let ok = true;
        for (const protocol of protocols) {
            if (!app.setAsDefaultProtocolClient(protocol)) {
                ok = false;
            }
        }
        return ok;
    }

    try {
        const desktopId =
            process.env.CHROME_DESKTOP && process.env.CHROME_DESKTOP.includes("veskdora")
                ? process.env.CHROME_DESKTOP
                : "veskdora.desktop";

        const configHome =
            process.env.XDG_CONFIG_HOME && !process.env.XDG_CONFIG_HOME.includes("/.var/app/")
                ? process.env.XDG_CONFIG_HOME
                : path.join(os.homedir(), ".config");
        if (!fs.existsSync(configHome)) {
            fs.mkdirSync(configHome, { recursive: true });
        }

        let mimeappsPath = path.join(configHome, "mimeapps.list");
        if (fs.existsSync(mimeappsPath)) {
            try {
                mimeappsPath = fs.realpathSync(mimeappsPath);
            } catch {
                // Ignore symlink resolution failure and use original path
            }
        }

        let content = "";
        if (fs.existsSync(mimeappsPath)) {
            content = fs.readFileSync(mimeappsPath, "utf-8");
        }

        const lines = content ? content.split(/\r?\n/) : [];

        // Check which protocols actually need to be added or updated
        const needed = new Set(protocols);
        let inDefaultApps = false;
        let defaultAppsIndex = -1;
        const protocolLineIndices = new Map<string, number>();

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("[") && line.endsWith("]")) {
                if (line === "[Default Applications]") {
                    inDefaultApps = true;
                    defaultAppsIndex = i;
                } else {
                    inDefaultApps = false;
                }
                continue;
            }

            if (inDefaultApps && line && !line.startsWith("#")) {
                const eqIdx = line.indexOf("=");
                if (eqIdx !== -1) {
                    const key = line.slice(0, eqIdx).trim();
                    const val = line.slice(eqIdx + 1).trim();
                    if (key.startsWith("x-scheme-handler/")) {
                        const scheme = key.slice("x-scheme-handler/".length);
                        protocolLineIndices.set(scheme, i);
                        if (needed.has(scheme) && val === desktopId) {
                            needed.delete(scheme);
                        }
                    }
                }
            }
        }

        // If all protocols are already mapped to desktopId, no disk write needed
        if (needed.size === 0) {
            return true;
        }

        if (defaultAppsIndex === -1) {
            // If [Default Applications] section doesn't exist, create it
            if (lines.length > 0 && lines[lines.length - 1].trim() !== "") {
                lines.push("");
            }
            lines.push("[Default Applications]");
            for (const scheme of needed) {
                lines.push(`x-scheme-handler/${scheme}=${desktopId}`);
            }
        } else {
            const toInsert: string[] = [];
            for (const scheme of needed) {
                if (protocolLineIndices.has(scheme)) {
                    const idx = protocolLineIndices.get(scheme)!;
                    lines[idx] = `x-scheme-handler/${scheme}=${desktopId}`;
                } else {
                    toInsert.push(`x-scheme-handler/${scheme}=${desktopId}`);
                }
            }
            if (toInsert.length > 0) {
                lines.splice(defaultAppsIndex + 1, 0, ...toInsert);
            }
        }

        const dir = path.dirname(mimeappsPath);
        const tempPath = path.join(dir, `.mimeapps.list.tmp.${process.pid}.${Date.now()}`);
        fs.writeFileSync(tempPath, lines.join("\n"), "utf-8");
        fs.renameSync(tempPath, mimeappsPath);

        return true;
    } catch (err) {
        console.error("Failed to register default protocol client on Linux:", err);
        return false;
    }
}
