@echo off
cd /d "%~dp0"
rem Lists come from the folders now (node/libraryIndex.mjs), so the start-up
rem manifest rebuild is no longer run. Utilities > Rebuild & Validate still runs it.
npm run start:sketchpad
pause
