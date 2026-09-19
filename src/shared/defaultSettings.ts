/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2026 Vendicated and Vesktop contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings } from "./settings";

const isLinux = typeof process !== "undefined" && process.platform === "linux";
const isGnome = isLinux && Boolean(process.env.XDG_CURRENT_DESKTOP?.includes("GNOME"));

export const DefaultVesktopSettings: Settings = {
    discordBranch: "stable",
    hardwareAcceleration: true,
    hardwareVideoAcceleration: isLinux,
    nativeTitleBar: false,
    staticTitle: false,
    enableMenu: false,
    enableShadow: true,
    enableRoundedCorners: true,
    enableSplashScreen: true,
    splashTheming: true,
    // On GNOME (Fedora Workstation default), there is no system tray by default.
    // Defaulting minimizeToTray to false prevents the window from vanishing into nowhere.
    tray: !isGnome,
    minimizeToTray: !isGnome,
    clickTrayToShowHide: false,
    disableMinSize: false,
    disableSmoothScroll: false,
    enableTaskbarFlashing: false,
    arRPC: true,
    openLinksWithElectron: false,
    autoStartMinimized: false,
    splashPixelated: false,
    webRTCIPHandlingPolicy: "default",
    appBadge: true,
    transparencyOption: "none"
};
