@echo off
title Allow GelScan Port 5173 in Windows Firewall
echo ====================================================================
echo     Allowing Port 5173 in Windows Defender Firewall (Inbound)
echo ====================================================================
echo.
echo Adding firewall rule for TCP port 5173...
netsh advfirewall firewall add rule name="GelScan Port 5173" dir=in action=allow protocol=TCP localport=5173
echo.
echo If you saw "Ok.", the rule was successfully added!
echo Other phones and laptops on your Wi-Fi/Hotspot can now connect to http://172.20.10.8:5173
echo.
pause
