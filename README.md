<div align="center">
  <img src="build/icon.svg" alt="Veskdora" width="128" height="128" />
  <h1>Veskdora</h1>
  <p align="center">
    <strong>A fork of Vesktop optimized for Fedora Workstation</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Fork_of-Vesktop-7289DA?style=flat-square&logo=discord&logoColor=white" alt="Vesktop Fork" />
    <img src="https://img.shields.io/badge/Fedora-Workstation_40+-51A2DA?style=flat-square&logo=fedora&logoColor=white" alt="Fedora" />
    <img src="https://img.shields.io/badge/Display-Native_Wayland-4E9A06?style=flat-square&logo=wayland&logoColor=white" alt="Wayland" />
    <img src="https://img.shields.io/badge/Audio-PipeWire-009688?style=flat-square" alt="PipeWire" />
    <img src="https://img.shields.io/badge/Packaging-Native_RPM-CC342D?style=flat-square&logo=redhat" alt="RPM" />
    <img src="https://img.shields.io/badge/License-GPL--3.0-blue?style=flat-square" alt="License" />
  </p>
</div>

<br>

Veskdora is an open-source fork of Vesktop tailored specifically for Fedora Workstation (GNOME, Wayland, and PipeWire). It provides a native Discord client experience with pre-installed Vencord and out-of-the-box system optimizations.

## Features

- **Native Wayland**: Direct Wayland rendering via Ozone auto, providing sharp UI rendering with fractional scaling on HiDPI displays.
- **PipeWire Integration**: Screen sharing through XDG Desktop Portal and system/application audio capture via virtual microphone on PipeWire PulseAudio.
- **Hardware Acceleration**: VA-API video decode and encode enabled by default for Intel, AMD, and NVIDIA.
- **IBus Support**: Wayland input method enabled out of the box.
- **GNOME Shell Integration**: Safe window close behavior by default, avoiding hidden background processes when no system tray is available.
- **Automatic Migration**: Automatically imports configuration and plugins from `~/.config/vesktop` on first launch.
- **RPM Packaging**: Built-in RPM target with AppStream metadata for GNOME Software.

## Installation

Install the RPM package using DNF:

```sh
sudo dnf install ./dist/veskdora-1.6.7.x86_64.rpm
```

## Building from Source

### Prerequisites

Install build tools and development libraries:

```sh
sudo dnf install @development-tools python3 nodejs curl pkgconf-pkg-config glib2-devel pipewire-devel
npm install -g pnpm
```

### Build

```sh
git clone https://github.com/lexp-hub/Veskdora.git
cd Veskdora
pnpm i
pnpm package:rpm
```

### Development

- Run development build: `pnpm start`
- Type check: `pnpm testTypes`
- Lint: `pnpm lint`

## License

GNU General Public License v3.0 (GPL-3.0-or-later). See [LICENSE](LICENSE).
