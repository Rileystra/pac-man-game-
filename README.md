# React Pac-Man Game

A simple Pac-Man-style game built with React and JavaScript.

## Why this version is pinned

This project intentionally uses pinned package versions instead of `latest`:

- `vite@4.5.14`
- `@vitejs/plugin-react@4.2.1`
- `react@18.2.0`
- `react-dom@18.2.0`

This avoids newer Vite/Rolldown native bindings that can be blocked by Windows Application Control policies.

## Run the game

Open a terminal inside this folder and run:

```bash
npm install
npm run dev
```

Then open the local URL shown in your terminal, usually:

```text
http://127.0.0.1:5173
```

## If you already tried installing before

If you previously saw an error like `Cannot find native binding` or `Application Control policy has blocked this file`, delete the old install first:

### Windows PowerShell

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache clean --force
npm install
npm run dev
```

### Command Prompt

```cmd
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
npm run dev
```

## Controls

Use the arrow keys to move Pac-Man.

## Goal

Eat all pellets while avoiding the ghost.
