@echo off
title GelScan - Instant Mobile Share via HTTPS Tunnel
echo ====================================================================
echo             GelScan - Live Mobile Connect via HTTPS Tunnel
echo ====================================================================
echo.
echo Starting secure HTTPS tunnel for port 5173...
echo This bypasses Windows Firewall and enables the camera on iPhone/Android.
echo.
echo Your public HTTPS URL will appear below:
echo --------------------------------------------------------------------
npx localtunnel --port 5173
pause
