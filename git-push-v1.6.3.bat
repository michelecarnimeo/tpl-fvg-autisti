@echo off
echo ============================================
echo   TPL FVG - Git Push v1.6.3
echo ============================================
echo.

echo [1/4] Aggiungo tutti i file modificati...
git add .
if %errorlevel% neq 0 (
    echo ERRORE: git add fallito!
    pause
    exit /b 1
)
echo ✅ File aggiunti con successo
echo.

echo [2/4] Creo commit con messaggio dettagliato...
git commit -m "✨ v1.6.3 - Modulo LocalStorage completo (22 test) + UI professionale" -m "" -m "- 22 test LocalStorage in 6 gruppi organizzati" -m "  * Base (3), Complessi (5), Edge Cases (6)" -m "  * Avanzati (2), Robustezza (3), PWA Specifici (3)" -m "- Header statistiche con progress bar animata" -m "- 22 pulsanti test singoli sempre visibili" -m "- Animazioni sobrie e professionali" -m "  * Header thin mode al scroll (da demo-finale.html)" -m "  * Click gruppi con press + highlight delicato" -m "- Modularizzazione CSS (6 nuovi file, ~1,259 righe)" -m "- File JS test-localstorage.js (1,257 righe)" -m "- Colori distintivi per 6 gruppi" -m "- Bug fix: loadAnimationPreference, file JS mancanti" -m "" -m "Versione: 1.6.3" -m "Data: 5 Novembre 2025"
if %errorlevel% neq 0 (
    echo ERRORE: git commit fallito!
    pause
    exit /b 1
)
echo ✅ Commit creato con successo
echo.

echo [3/4] Verifico lo stato...
git status
echo.

echo [4/4] Push su GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERRORE: git push fallito!
    echo Verifica la tua connessione e le credenziali GitHub
    pause
    exit /b 1
)

echo.
echo ============================================
echo   🎉 PUSH COMPLETATA CON SUCCESSO!
echo   Versione 1.6.3 pubblicata su GitHub
echo ============================================
echo.
pause

