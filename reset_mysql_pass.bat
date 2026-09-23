@echo off
echo =========================================================
echo  MySQL Password Reset & Hospital DB Configuration Tool
echo =========================================================
echo.

NET SESSION >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Please right-click this file and select "Run as Administrator"!
    echo.
    pause
    exit /b
)

echo Stopping MySQL80 service...
net stop MySQL80

echo Resetting root password to 'root' and creating 'hospital_db'...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" --init-file="%~dp0reset_mysql_script.sql" --console

echo Starting MySQL80 service...
net start MySQL80

echo.
echo =========================================================
echo  SUCCESS! MySQL root password is now set to 'root'
echo  Database 'hospital_db' created successfully!
echo =========================================================
pause
