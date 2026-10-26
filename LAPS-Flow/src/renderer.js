const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const EN_TRANSLATIONS = {
  'Backup erstellen': 'Create backup', 'Backup wiederherstellen': 'Restore backup', 'Flow prüfen': 'Validate flow', 'Historie löschen': 'Clear history',
  'Debug-Modus': 'Debug mode', 'Erster Schritt läuft…': 'Running first step…', 'Weiter zum nächsten Schritt': 'Continue to next step', 'Debug stoppen': 'Stop debug',
  'Automatisch gespeichert': 'Auto-saved', 'Speichert…': 'Saving…', 'Speichern fehlgeschlagen': 'Save failed', 'Flow-Prüfung abgeschlossen': 'Flow check complete',
  'Prüfung hat Probleme gefunden': 'Validation found problems', 'Zu behebende Fehler': 'Errors to fix', 'Warnungen': 'Warnings', 'Keine blockierenden Fehler gefunden.': 'No blocking errors found.', 'Ausblenden': 'Hide',
  'Flow wurde wegen Validierungsfehlern nicht gestartet.': 'Flow was not started because validation found errors.', 'Flow abgebrochen.': 'Flow cancelled.',
  'Flow wurde lokal gespeichert.': 'Flow saved locally.', 'Lokal gespeichert': 'Saved locally', 'Automatisches Speichern aktiv': 'Auto-save is enabled',
  'Öffnet Lernplattform, Dokumente und Kalender für eine Lerneinheit.': 'Opens your learning platform, documents, and calendar for a study session.',
  'Öffnet E-Mail, Aufgaben und Dateien für den Arbeitsstart.': 'Opens email, tasks, and files for the start of your workday.',
  'Öffnet zentrale Entwicklungsressourcen und zeigt einen Start-Hinweis.': 'Opens key development resources and shows a startup notification.',
  'Lernumgebung ist bereit. Viel Erfolg!': 'Your study workspace is ready. Good luck!',
  'Deine Arbeitsumgebung ist bereit.': 'Your workspace is ready.',
  'Entwicklungsressourcen geöffnet. Starte dein Projekt oder deine Tests.': 'Development resources are open. Start your project or tests.',
  'Startet automatisch, wenn eine Datei im Downloads-Ordner vollständig geladen wurde.': 'Triggers when a download finishes in the Downloads folder.',
  'Beobachtet lokal den Downloads-Ordner und meldet neue PDF-Dateien.': 'Watches the Downloads folder locally and reports new PDF files.',
  'Beispiel für Variablen, Bedingungen und wiederverwendbare Schritte.': 'Demonstrates variables, conditions, and reusable steps.',
  'Download abgeschlossen: ${trigger.fileName}': 'Download complete: ${trigger.fileName}',
  '${trigger.fileName} wurde erstellt.': '${trigger.fileName} was created.',
  'Die Bedingung war erfüllt – Variablen können in Texten als ${status} verwendet werden.': 'The condition passed—variables can be used in text as ${status}.',
  'LAPS Flow · Download fertig': 'LAPS Flow · Download complete', 'Neue PDF entdeckt': 'New PDF detected', 'bereit': 'ready',

  'Sprache wechseln': 'Switch language', 'Language / Sprache': 'Language', 'Eigenschaften anzeigen': 'Show properties', 'Eigenschaften ausblenden': 'Hide properties', 'Workflow auswählen': 'Choose workflow', 'Flow-Einstellungen': 'Flow settings',
  'AKTION': 'ACTION', 'VERZÖGERUNG VOR DEM ÖFFNEN (SEK.)': 'DELAY BEFORE OPENING (SEC.)', 'VERGLEICHSWERT': 'COMPARISON VALUE',
  'Flow Marketplace': 'Flow Marketplace', 'Time Machine': 'Time Machine', 'Flow importieren': 'Import flow', 'Aktuellen Flow teilen': 'Share current flow',
  'Keine passenden Dateien gefunden.': 'No matching files found.', 'Dieser Flow enthält noch keine Aktionen.': 'This flow has no actions yet.', 'Nichts auszuführen.': 'Nothing to run.',
  'Alle Aktionen wurden abgeschlossen. Geplante App-Schließungen laufen weiter.': 'All actions completed. Scheduled app closures will continue.', 'Flow mit Fehler beendet.': 'Flow ended with an error.',
  'Windows-Benachrichtigungen werden auf diesem System nicht unterstützt.': 'Windows notifications are not supported on this system.', 'Unbekannter Fehler': 'Unknown error',
  'Abbruch angefordert. Bereits gestartete externe Programme werden nicht automatisch beendet.': 'Cancellation requested. Already launched external programs will not be closed automatically.',
  'z. B. Öffne mein Postfach und meinen Kalender für die Arbeit …': 'e.g. Open my inbox and calendar for work…', '↥ Flow importieren': '↥ Import flow', '↧ Aktuellen Flow teilen': '↧ Share current flow', '↻ Aktualisieren': '↻ Refresh',
  'SPRACHE': 'LANGUAGE', 'DESKTOP AUTOMATION': 'DESKTOP AUTOMATION', 'WORKSPACE': 'WORKSPACE', 'Workflow Studio': 'Workflow Studio',
  'Aktivitätsprotokoll': 'Activity Log', 'DEIN WORKSPACE': 'YOUR WORKSPACE', 'LAPS Workspace': 'LAPS Workspace',
  'Lokaler Arbeitsbereich': 'Local workspace', 'Lokal & privat': 'Local & private', 'Deine Flows bleiben auf diesem PC.': 'Your flows stay on this PC.',
  'Workspace': 'Workspace', 'Windows Automation': 'Windows Automation', 'VISUAL AUTOMATION BUILDER': 'VISUAL AUTOMATION BUILDER',
  'Dein PC. Deine Regeln.': 'Your PC. Your rules.', 'Baue intelligente Workflows mit Logik, Schleifen, Unter-Flows und lokalen Ereignis-Triggern.': 'Build smart workflows with logic, loops, subflows, and local event triggers.',
  'Lokal gespeichert': 'Saved locally', 'Automatisches Speichern aktiv': 'Auto-save is enabled', 'Nicht gespeichert': 'Unsaved changes', 'Neuer Flow': 'New Flow', 'Importieren': 'Import', 'Exportieren': 'Export', 'Speichern': 'Save',
  'Flow ausführen': 'Run Flow', 'Abbrechen': 'Cancel', 'LOCAL FLOW ARCHITECT': 'LOCAL FLOW ARCHITECT',
  'Beschreiben. Entwurf erstellen. Selbst kontrollieren.': 'Describe. Generate a draft. Stay in control.',
  'Regelbasierte Vorschläge direkt auf deinem PC. Keine KI-Anfrage, kein Cloud-Server.': 'Rule-based suggestions directly on your PC. No AI request, no cloud server.',
  'Entwurf erstellen': 'Generate draft', 'STARTVORLAGEN': 'STARTER TEMPLATES', 'Lernplattform · Drive · Kalender': 'Learning platform · Drive · Calendar',
  'Outlook · Aufgaben · OneDrive': 'Outlook · Tasks · OneDrive', 'Aktionen': 'Actions', 'Baustein hinzufügen': 'Add a block',
  'Pro-Tipp': 'Pro tip', 'Verbinde mehrere Aktionen, um deine Routine mit einem Klick zu starten.': 'Connect multiple actions to run your routine with one click.',
  'Workflow-Canvas': 'Workflow canvas', 'Manueller Start': 'Manual start', 'Du startest diesen Flow per Klick': 'You start this flow with a click',
  'TRIGGER': 'TRIGGER', 'Flow abgeschlossen': 'Flow completed', 'Alle Aktionen wurden ausgeführt': 'All actions have been executed',
  'Dein Flow startet hier': 'Your flow starts here', 'Wähle links eine Aktion aus, um deinen ersten Ablauf zu bauen.': 'Choose an action on the left to build your first workflow.',
  'Änderungen werden automatisch gespeichert; mit „Speichern“ speicherst du sofort': 'Changes are saved automatically; use “Save” to save immediately', 'Windows-Aktionen · Mail · Dateien · Browser': 'Windows actions · Email · Files · Browser',
  'Eigenschaften': 'Properties', 'Flow-Konfiguration': 'Flow settings', 'Wähle einen Schritt': 'Select a step',
  'Klicke auf eine Aktion im Canvas, um ihre Eigenschaften zu bearbeiten.': 'Click an action on the canvas to edit its properties.',
  'Kontrollierte Ausführung': 'Controlled execution', 'Jeder Flow wird erst nach deinem Klick gestartet. Es werden keine beliebigen Shell-Befehle ausgeführt.': 'Flows only start after you click. Arbitrary shell commands are not executed.',
  'Was dein Flow zuletzt gemacht hat': 'What your flow did most recently', 'Protokoll leeren': 'Clear log',
  'Noch keine Ausführung. Starte einen Flow, um die Ergebnisse hier zu sehen.': 'No runs yet. Start a flow to see its results here.',
  'Ausführungen nachvollziehen und reparieren': 'Inspect and repair runs',
  'Lokale Historie mit Schrittstatus, Eingaben, Ausgaben und Fehlern. Eine Fortsetzung ab einem gespeicherten Schritt ist möglich.': 'Local history with step status, inputs, outputs, and errors. You can resume from a saved step.',
  'Aktualisieren': 'Refresh', 'Noch keine gespeicherten Ausführungen.': 'No saved runs yet.', 'Ausführung auswählen': 'Select a run',
  'Wähle links einen Lauf, um die einzelnen Schritte und ihre Ergebnisse zu prüfen.': 'Select a run on the left to inspect its individual steps and results.',
  'Vorlagen & Integrationen': 'Templates & Integrations',
  'Starte mit fertigen Workflows oder teile deine eigenen über Export/Import als .lapsflow-Datei. Der Katalog arbeitet lokal; es gibt keinen externen Marketplace-Server.': 'Start with ready-made workflows or share your own by exporting/importing a .lapsflow file. The catalog works locally; there is no external marketplace server.',
  'Flow importieren': 'Import flow', 'Aktuellen Flow teilen': 'Share current flow', 'VORLAGEN-KATALOG': 'TEMPLATE CATALOG',
  'INTEGRATIONEN · LOKAL & VORINSTALLIERT': 'INTEGRATIONS · LOCAL & BUILT-IN', 'Dateisystem': 'File system',
  'Ordner, Dateioperationen, Downloads, Dateisuchen und Sortierregeln': 'Folders, file operations, downloads, file searches, and sorting rules',
  'Direkt auf diesem PC': 'Directly on this PC', 'Windows-Programme': 'Windows apps',
  'Apps starten, Fenster steuern und Prozessstarts überwachen': 'Launch apps, control windows, and monitor process starts', 'Windows-API': 'Windows API',
  'Browser & Web-Apps': 'Browser & web apps', 'URLs, Mailboxen und E-Mail-Entwürfe öffnen': 'Open URLs, mailboxes, and email drafts',
  'Standardbrowser / URL': 'Default browser / URL', 'Benachrichtigungen': 'Notifications',
  'Windows-Hinweise, Zwischenablage und lokale Ereignisse': 'Windows notifications, clipboard, and local events', 'Ohne Cloud-Konto': 'No cloud account',
  'Unabhängig entwickelt · Für Windows': 'Independently developed · For Windows', 'Über LAPS ↗': 'About LAPS ↗',
  'Über LAPS': 'About LAPS', 'Entdecke LAPS und die unabhängigen Softwareprojekte.': 'Discover LAPS and its independent software projects.',
  'Klicke auf den Link oder öffne die Website in deinem Standardbrowser.': 'Click the link or open the website in your default browser.', 'Schließen': 'Close', 'Website öffnen ↗': 'Open website ↗',
  'Flow jetzt ausführen?': 'Run flow now?', 'Die Aktionen in diesem Ablauf werden auf deinem PC ausgeführt.': 'The actions in this workflow will run on your PC.',
  'Ausführung starten': 'Start run', 'Hilfe': 'Help', 'Alle Aktionen entfernen': 'Remove all actions', 'Canvas zurücksetzen': 'Reset canvas',
  'Workflow-Name': 'Workflow name', 'Gespeicherten Flow auswählen': 'Choose saved flow', 'Aktion suchen...': 'Search actions...',
  'Baustein hinzufügen': 'Add a block', 'Aktion': 'Action', 'Aktionen': 'Actions', 'Aktion suchen': 'Search actions',
  'Aktion bearbeiten': 'Edit action', 'Noch kein Pfad eingetragen': 'No path entered yet', 'Keine Anwendung ausgewählt': 'No application selected',
  'Zuletzt gestartete App': 'Last launched app', 'Ziel auswählen': 'Select target', 'In Vordergrund': 'Bring to foreground',
  'Minimieren': 'Minimize', 'Maximieren': 'Maximize', 'Wiederherstellen': 'Restore', 'Fenster steuern': 'Control window',
  'Ziel fehlt': 'Target missing', 'Zum nächsten sichtbaren Fenster wechseln': 'Switch to the next visible window', 'Sek. schließen': 'sec. then close',
  'E-Mail-Entwurf vorbereiten': 'Prepare email draft', 'Postfachfenster schließen': 'Close mailbox window', 'Datei erstellen': 'Create file',
  'Datei kopieren': 'Copy file', 'Datei verschieben': 'Move file', 'Datei umbenennen': 'Rename file', 'Dateioperation': 'File operation',
  'Dateiendungen eintragen': 'Enter file extensions', 'Nach Dateiendung sortieren': 'Sort by file extension', 'Noch kein Link eingetragen': 'No link entered yet',
  'Web-App konfigurieren': 'Configure web app', 'Vom Flow geöffnetes Browserfenster': 'Browser window opened by flow', 'Fensterziel auswählen': 'Select window target',
  'Text für die Zwischenablage': 'Text for clipboard', 'Benachrichtigung anzeigen': 'Show notification', 'Pause im Ablauf': 'Pause in workflow',
  'Wert speichern und weiterverwenden': 'Store and reuse value', 'Wenn/dann-Logik mit Sprung': 'If/then logic with jump', 'Schritte mehrfach ausführen': 'Repeat steps',
  'Wiederholung abschließen': 'End repetition', 'Gespeicherten Flow wiederverwenden': 'Reuse saved flow',
  'APPS & FENSTER': 'APPS & WINDOWS', 'E-MAIL': 'EMAIL', 'DATEIEN': 'FILES', 'WEB & BROWSER': 'WEB & BROWSER', 'TOOLS': 'TOOLS', 'FLOW CONTROL': 'FLOW CONTROL',
  'App starten': 'Launch app', 'Startet eine lokale Windows-Anwendung.': 'Launches a local Windows application.', 'Programm ausführen': 'Run program',
  'App / Fenster schließen': 'Close app / window', 'Fordert das ausgewählte Programm zum normalen Schließen auf.': 'Requests the selected program to close normally.', 'Fenster kontrolliert schließen': 'Close window gracefully',
  'Fenster steuern': 'Control window', 'Minimieren, maximieren, wiederherstellen oder aktivieren.': 'Minimize, maximize, restore, or activate.', 'Fensterstatus ändern': 'Change window state',
  'Programm wechseln': 'Switch app', 'Wechselt zum nächsten sichtbaren Programmfenster.': 'Switches to the next visible application window.', 'Zum nächsten Fenster wechseln': 'Switch to next window',
  'App zeitgesteuert schließen': 'Close app after delay', 'Schließt eine vom Flow gestartete App nach einer Wartezeit.': 'Closes an app launched by the flow after a delay.', 'App nach Zeit schließen': 'Close app after delay',
  'E-Mail-Postfach öffnen': 'Open email inbox', 'Öffnet Gmail, Outlook oder ein anderes Webpostfach.': 'Opens Gmail, Outlook, or another webmail inbox.', 'Postfach im Browser öffnen': 'Open mailbox in browser',
  'E-Mail vorbereiten': 'Prepare email', 'Erstellt einen Entwurf mit Empfänger, Betreff und Nachricht.': 'Creates a draft with recipient, subject, and message.', 'E-Mail-Entwurf öffnen': 'Open email draft',
  'E-Mail-Konto auswählen': 'Select email account', 'Legt den Anbieter und Kontoindex für nachfolgende Mail-Aktionen fest.': 'Sets the provider and account index for subsequent email actions.', 'Mailkonto für den Flow setzen': 'Set flow email account',
  'Mailfenster schließen': 'Close mail window', 'Schließt ein passendes Postfach-Fenster auf normale Weise.': 'Closes a matching mailbox window normally.',
  'Ordner öffnen': 'Open folder', 'Öffnet einen ausgewählten Ordner im Explorer.': 'Opens a selected folder in File Explorer.', 'Ordner im Explorer öffnen': 'Open folder in File Explorer',
  'Datei / Pfad öffnen': 'Open file / path', 'Öffnet Datei oder Ordner mit der Standardanwendung.': 'Opens a file or folder with the default app.', 'Datei oder Pfad öffnen': 'Open file or path',
  'Datei bearbeiten': 'File operation', 'Datei erstellen, kopieren, verschieben oder umbenennen.': 'Create, copy, move, or rename a file.', 'Dateioperation ausführen': 'Run file operation',
  'Dateien nach Typ suchen': 'Search files by type', 'Sucht Dateiendungen in einem Ordner.': 'Searches for file extensions in a folder.', 'Dateien finden': 'Find files',
  'Download abwarten': 'Wait for download', 'Wartet, bis eine passende Datei vollständig geladen ist.': 'Waits until a matching file has finished downloading.', 'Auf fertigen Download warten': 'Wait for completed download',
  'Dateien automatisch sortieren': 'Sort files automatically', 'Verschiebt Dateien anhand ihrer Endung in Zielordner.': 'Moves files to target folders based on their extension.', 'Dateien nach Regeln sortieren': 'Sort files by rules',
  'Website öffnen': 'Open website', 'Öffnet eine URL im Standardbrowser oder gewählten Browser.': 'Opens a URL in the default or selected browser.', 'Link im Browser starten': 'Open link in browser',
  'Web-App öffnen': 'Open web app', 'Öffnet eine bestimmte Webanwendung.': 'Opens a specific web application.', 'Web-App starten': 'Launch web app',
  'Webseiten-Serie öffnen': 'Open sequence of websites', 'Öffnet mehrere URLs der Reihe nach.': 'Opens multiple URLs in sequence.', 'Mehrere Seiten im Ablauf öffnen': 'Open multiple pages in workflow',
  'Browserfenster schließen': 'Close browser window', 'Schließt ein zugeordnetes oder anhand Titel/Prozess gewähltes Fenster.': 'Closes an assigned window or one selected by title/process.', 'Browserfenster schließen': 'Close browser window',
  'Text kopieren': 'Copy text', 'Legt Text in die Zwischenablage.': 'Copies text to the clipboard.', 'In Zwischenablage': 'Copy to clipboard',
  'Benachrichtigung': 'Notification', 'Zeigt eine Windows-Benachrichtigung.': 'Shows a Windows notification.', 'Hinweis anzeigen': 'Show notification',
  'Warten': 'Wait', 'Pausiert den Flow für eine Dauer.': 'Pauses the flow for a duration.', 'Variable setzen': 'Set variable',
  'Speichert einen Wert für spätere Schritte und Bedingungen.': 'Stores a value for later steps and conditions.', 'Bedingung prüfen': 'Check condition',
  'Vergleicht einen Wert oder prüft eine lokale Datei bzw. einen Prozess.': 'Compares a value or checks a local file or process.', 'Schleife starten': 'Start loop',
  'Wiederholt alle Schritte bis zum passenden Schleifenende.': 'Repeats all steps until the matching loop end.', 'Schleife beenden': 'End loop',
  'Markiert das Ende einer Wiederholung.': 'Marks the end of a repetition.', 'Unter-Flow ausführen': 'Run subflow',
  'Ruft einen anderen gespeicherten Flow als wiederverwendbaren Baustein auf.': 'Calls another saved flow as a reusable block.',
  'ANWENDUNGSPFAD': 'APPLICATION PATH', 'Wähle eine EXE-Datei. Die gestartete App kann später über „App schließen“ adressiert werden.': 'Choose an EXE file. The launched app can later be targeted with “Close app”.',
  'Anwendung auswählen …': 'Choose application…', 'OPTIONAL: NACH X SEKUNDEN SCHLIESSEN': 'OPTIONAL: CLOSE AFTER X SECONDS', '0 = nie automatisch schließen': '0 = never close automatically',
  '0 deaktiviert das automatische Schließen. Schließen erfolgt über das normale Fenster-Schließen.': '0 disables automatic closing. Closing uses a normal window-close request.',
  'ZIELTYP': 'TARGET TYPE', 'Zuletzt von diesem Flow gestartete App': 'App last launched by this flow', 'Zuletzt vom Flow gestartete App': 'App last launched by the flow',
  'Prozessname (z. B. notepad)': 'Process name (e.g. notepad)', 'Prozessname': 'Process name', 'Fenstertitel enthält': 'Window title contains',
  'PROZESSNAME ODER FENSTERTITEL': 'PROCESS NAME OR WINDOW TITLE', 'z. B. notepad oder Gmail': 'e.g. notepad or Gmail',
  'Mit „Fensterliste laden“ kannst du ein sichtbares Fenster auswählen.': 'Use “Load window list” to select a visible window.', 'Fensterliste laden …': 'Load window list…',
  'FENSTERAKTION': 'WINDOW ACTION', 'In den Vordergrund holen': 'Bring to front', 'ZIEL': 'TARGET', 'HINWEIS': 'NOTE',
  'VERZÖGERUNG (SEKUNDEN)': 'DELAY (SECONDS)', 'Leer lassen, wenn zuletzt gestartete App': 'Leave blank to use the last launched app',
  'Das Programm erhält eine normale Schließen-Anforderung. Ungespeicherte Arbeiten können verhindern, dass es geschlossen wird.': 'The program receives a normal close request. Unsaved work may prevent it from closing.',
  'POSTFACH-ANBIETER': 'MAILBOX PROVIDER', 'Outlook Web': 'Outlook Web', 'Anderes Webpostfach': 'Other webmail', 'Kontowahl aus Flow verwenden': 'Use account selected by flow',
  'GMAIL-KONTOINDEX': 'GMAIL ACCOUNT INDEX', 'Nur für „Anderes Webpostfach“ erforderlich.': 'Only required for “Other webmail”.',
  'Gmail: 0 = erstes angemeldetes Konto, 1 = zweites usw. Bei Outlook wird das aktuell angemeldete Microsoft-Webkonto verwendet.': 'Gmail: 0 = first signed-in account, 1 = second, etc. Outlook uses the currently signed-in Microsoft web account.',
  'ALTERNATIVE POSTFACH-URL': 'ALTERNATIVE MAILBOX URL', 'OPTIONALER BROWSER-PFAD': 'OPTIONAL BROWSER PATH', 'Pfad zu chrome.exe / msedge.exe': 'Path to chrome.exe / msedge.exe',
  'Leer lassen, um den Standardbrowser zu verwenden. Ein ausgewählter Browser wird mit neuem Fenster gestartet, sofern er das unterstützt.': 'Leave blank to use the default browser. A selected browser opens a new window if supported.',
  'Browser-EXE auswählen …': 'Choose browser EXE…', 'MAIL-ANBIETER': 'EMAIL PROVIDER', 'Gmail Web': 'Gmail Web',
  'Standard-Mailprogramm (mailto)': 'Default email app (mailto)', 'Wird bei Gmail verwendet; 0 = erstes Konto.': 'Used for Gmail; 0 = first account.',
  'EMPFÄNGER': 'RECIPIENT', 'BETREFF': 'SUBJECT', 'Betreff der Nachricht': 'Email subject', 'NACHRICHT': 'MESSAGE', 'Nachrichtentext …': 'Message text…',
  'Öffnet nur einen Entwurf. LAPS Flow versendet E-Mails nicht selbst.': 'Opens a draft only. LAPS Flow does not send emails itself.', 'ANBIETER': 'PROVIDER', 'KONTOINDEX': 'ACCOUNT INDEX',
  'Bei Gmail wählt der Index das Konto aus. Bei Outlook wird das aktuell angemeldete Microsoft-Webkonto verwendet.': 'For Gmail, the index selects the account. Outlook uses the currently signed-in Microsoft web account.',
  'PFAD': 'PATH', 'Wähle einen Ordner, der im Windows-Explorer geöffnet werden soll.': 'Choose a folder to open in Windows File Explorer.', 'Datei oder Ordner, der mit der Standardanwendung geöffnet werden soll.': 'File or folder to open with the default app.',
  'Ordner auswählen …': 'Choose folder…', 'Datei oder Ordner auswählen …': 'Choose file or folder…', 'DATEIAKTION': 'FILE ACTION',
  'Neue Textdatei erstellen': 'Create new text file', 'NEUER DATEIPFAD': 'NEW FILE PATH', 'C:\\Users\\...\\Neue-Datei.txt': 'C:\\Users\\...\\New-file.txt',
  'Die Datei wird neu erstellt. Vorhandene Dateien werden nicht überschrieben.': 'A new file will be created. Existing files will not be overwritten.', 'Dateipfad festlegen …': 'Set file path…',
  'DATEIINHALT': 'FILE CONTENT', 'Inhalt der Textdatei …': 'Text file content…', 'QUELLDATEI': 'SOURCE FILE', 'Wähle die existierende Datei, die kopiert, verschoben oder umbenannt werden soll.': 'Choose the existing file to copy, move, or rename.',
  'Quelldatei auswählen …': 'Choose source file…', 'ZIEL-/NEUER DATEIPFAD': 'DESTINATION / NEW FILE PATH', 'Vollständigen Pfad der Zieldatei angeben.': 'Enter the full destination file path.', 'Zielpfad festlegen …': 'Set destination path…',
  'SUCHORDNER': 'SEARCH FOLDER', 'DATEIENDUNGEN': 'FILE EXTENSIONS', 'Kommagetrennt, mit oder ohne Punkt.': 'Comma-separated, with or without a dot.', 'Unterordner durchsuchen': 'Search subfolders',
  'Gefundene Pfade kopieren': 'Copy found paths', 'Die Treffer werden zusätzlich ins Protokoll geschrieben (maximal die ersten 8 Pfade).': 'Matches are also added to the log (up to the first 8 paths).',
  'DOWNLOAD-ORDNER': 'DOWNLOAD FOLDER', 'Leer = Windows-Downloads-Ordner': 'Blank = Windows Downloads folder', 'Leerlassen, um den Downloads-Ordner des aktuellen Benutzers zu verwenden.': 'Leave blank to use the current user’s Downloads folder.',
  'Download-Ordner auswählen …': 'Choose download folder…', 'DATEINAMENMUSTER': 'FILENAME PATTERN', '* = beliebige Zeichen, ? = ein Zeichen.': '* = any characters, ? = one character.', 'ZEITLIMIT (SEKUNDEN)': 'TIMEOUT (SECONDS)',
  'Die Datei muss existieren und ihre Größe muss über mehrere Prüfungen stabil sein.': 'The file must exist and its size must remain stable across multiple checks.', 'QUELLORDNER': 'SOURCE FOLDER', 'Ordner mit unsortierten Dateien': 'Folder with unsorted files',
  'ZIELORDNER': 'DESTINATION FOLDER', 'Ordner für sortierte Unterordner': 'Folder for sorted subfolders', 'SORTIERREGELN': 'SORTING RULES',
  'Eine Regel pro Zeile: .pdf=PDFs oder .png,.jpg=Images. Nur Dateien direkt im Quellordner werden sortiert.': 'One rule per line: .pdf=PDFs or .png,.jpg=Images. Only files directly inside the source folder are sorted.',
  'DATEINAMENSKONFLIKT': 'FILENAME CONFLICT', 'Vorhandene Datei überspringen (sicher)': 'Skip existing file (safe)', 'Neue Datei mit Nummer umbenennen': 'Rename new file with number',
  'NAME DER WEB-APP': 'WEB APP NAME', 'WEBADRESSE': 'WEB ADDRESS', 'Es werden nur http:// und https:// Adressen geöffnet.': 'Only http:// and https:// addresses are opened.',
  'FENSTERTITEL-HINWEIS': 'WINDOW TITLE HINT', 'Hilft später beim Schließen eines Fensters, wenn kein eigener Browser-Pfad gewählt wurde.': 'Helps identify a window later when closing it if no custom browser path was selected.',
  'WEBADRESSEN (EINE PRO ZEILE)': 'WEB ADDRESSES (ONE PER LINE)', 'PAUSE ZWISCHEN SEITEN (SEK.)': 'DELAY BETWEEN PAGES (SEC.)', 'TEXTINHALT': 'TEXT CONTENT',
  'Text, den du kopieren möchtest …': 'Text you want to copy…', 'Der Text wird direkt in die Windows-Zwischenablage kopiert.': 'Text is copied directly to the Windows clipboard.', 'TITEL': 'TITLE', 'NACHRICHT': 'MESSAGE',
  'Deine Nachricht …': 'Your message…', 'VARIABLENNAME': 'VARIABLE NAME', 'Variablen stehen später über ${name} in Textfeldern zur Verfügung.': 'Variables are available in text fields later via ${name}.',
  'DATENTYP': 'DATA TYPE', 'Wahr/Falsch': 'True/False', 'Aktueller Zeitstempel': 'Current timestamp', 'WERT': 'VALUE', 'z. B. bereit oder 42': 'e.g. ready or 42',
  'Bei Zeitstempel wird der Wert zur Laufzeit durch das aktuelle Datum ersetzt.': 'For a timestamp, the value is replaced with the current date at runtime.', 'PRÜFTYP': 'CHECK TYPE', 'Variable vergleichen': 'Compare variable',
  'Datei existiert': 'File exists', 'Windows-Prozess läuft': 'Windows process is running', 'VERGLEICH': 'COMPARISON', 'ist gleich': 'equals', 'ist ungleich': 'does not equal',
  'enthält': 'contains', 'enthält nicht': 'does not contain', 'größer als (Zahlen)': 'greater than (numbers)', 'kleiner als (Zahlen)': 'less than (numbers)',
  'DATEIPFAD': 'FILE PATH', 'Datei auswählen …': 'Choose file…', 'PROZESSNAME': 'PROCESS NAME', 'BEI FALSE: NÄCHSTE SCHRITTE ÜBERSPRINGEN': 'IF FALSE: SKIP NEXT STEPS',
  'Überspringt so viele nachfolgende Schritte, wenn die Bedingung nicht erfüllt ist. Schleifenmarker nicht überspringen.': 'Skips this many following steps if the condition is false. Do not skip loop markers.',
  'ANZAHL DER DURCHLÄUFE': 'NUMBER OF ITERATIONS', 'Alle Bausteine bis zum nächsten passenden „Schleife beenden“ werden wiederholt. Maximal 100 Durchläufe; insgesamt sind 1.000 Schritt-Auswertungen erlaubt.': 'All blocks up to the next matching “End loop” are repeated. Maximum 100 iterations; up to 1,000 step evaluations in total.',
  'SCHLEIFENBLOCK': 'LOOP BLOCK', 'Setze „Schleife beenden“ NACH die Aktionen, die wiederholt werden sollen. Verschachtelte Schleifen sind möglich.': 'Place “End loop” AFTER the actions to repeat. Nested loops are supported.',
  'SCHLEIFENENDE': 'LOOP END', 'Dieser Baustein muss innerhalb eines „Schleife starten“-Blocks stehen. Er wird automatisch mit dem passenden Anfang verbunden.': 'This block must be inside a “Start loop” block. It is automatically linked to its matching start.',
  'GESPEICHERTER UNTER-FLOW': 'SAVED SUBFLOW', 'Unter-Flow auswählen …': 'Choose subflow…', 'Der ausgewählte Flow wird mit dem aktuellen Laufkontext ausgeführt. Maximal 5 Ebenen tief; Selbstaufrufe sind blockiert.': 'The selected flow runs with the current run context. Maximum depth is 5; recursive self-calls are blocked.',
  'DAUER (MILLISEKUNDEN)': 'DURATION (MILLISECONDS)', '1.000 ms entsprechen einer Sekunde; maximal 10 Minuten.': '1,000 ms equals one second; maximum 10 minutes.',
  'FLOW-NAME': 'FLOW NAME', 'BESCHREIBUNG': 'DESCRIPTION', 'Was soll dieser Flow erledigen?': 'What should this flow do?', 'Kurze Beschreibung deines Ablaufs.': 'A short description of your workflow.',
  'Windows Event Engine · Trigger': 'Windows Event Engine · Trigger', 'Wähle, wodurch dieser Flow automatisch startet. Bei Datei- und Prozess-Triggern bleibt die Überwachung lokal auf diesem PC.': 'Choose what starts this flow automatically. File and process triggers are monitored locally on this PC.',
  'STARTBEDINGUNG': 'START CONDITION', 'Nur manuell': 'Manual only', 'Zeitintervall': 'Time interval', 'Neue Datei im Ordner': 'New file in folder', 'Download abgeschlossen': 'Download completed', 'Programm wird gestartet': 'Program starts',
  'Automatisch gestartete Flows laufen ohne Bestätigungsfenster. Prüfe sie sorgfältig, bevor du Trigger aktivierst.': 'Automatically triggered flows run without a confirmation dialog. Review them carefully before enabling triggers.',
  'INTERVALL (MINUTEN)': 'INTERVAL (MINUTES)', 'ÜBERWACHTER ORDNER': 'WATCHED FOLDER', 'Leer = Downloads-Ordner': 'Blank = Downloads folder', 'Ordner auswählen …': 'Choose folder…',
  'DATEINAMENMUSTER': 'FILENAME PATTERN', 'PROZESSNAME (OHNE .EXE OPTIONAL)': 'PROCESS NAME (WITHOUT .EXE, OPTIONAL)', 'z. B. notepad oder chrome': 'e.g. notepad or chrome',
  'Self-Healing': 'Self-healing', 'Bei vorübergehenden Fehlern Aktionen erneut versuchen.': 'Retry actions when temporary errors occur.', 'WIEDERHOLUNGEN PRO AKTION': 'RETRIES PER ACTION', 'Keine': 'None', '1 Wiederholung': '1 retry', '2 Wiederholungen': '2 retries', '3 Wiederholungen': '3 retries',
  'Bei endgültigem Fehler mit nächster Aktion fortfahren': 'Continue with next action after final error', 'Aktiviere das Fortfahren nur, wenn spätere Schritte auch ohne den fehlgeschlagenen Schritt sicher sind.': 'Continue only if later steps are safe without the failed step.',
  'Flow Architect läuft lokal': 'Flow Architect runs locally', 'Beschreibe oben, was du erreichen willst. Flow erstellt einen regelbasierten Entwurf direkt auf diesem PC – ohne KI-Server.': 'Describe what you want to achieve above. Flow creates a rule-based draft directly on this PC—without an AI server.',
  'SCHRITT-ID': 'STEP ID', 'Intern': 'Internal', 'Aktion entfernen': 'Remove action', 'Ziel-Dateipfad auswählen': 'Choose destination file path', 'Neue-Datei.txt': 'New-file.txt',
  'Anwendung oder Browser auswählen': 'Choose application or browser', 'Datei oder Ordner auswählen': 'Choose file or folder', 'Zu überwachenden Ordner auswählen': 'Choose folder to monitor',
  'Noch keine gespeicherten Läufe': 'No saved runs yet', 'Lauf auswählen': 'Select run', 'Erfolgreich': 'Successful', 'Fehler': 'Error', 'Läuft': 'Running',
  'Für diese Ausführung sind noch keine Schritte gespeichert.': 'No steps have been saved for this run yet.', 'Historie konnte nicht geladen werden:': 'Could not load history:',
  'Ausführung konnte nicht geladen werden:': 'Could not load run:', 'AUTOTRIGGER': 'AUTOTRIGGER', 'VORLAGE': 'TEMPLATE', 'Schritte': 'steps', 'Vorlage hinzufügen ↗': 'Add template ↗',
  'Download-Wächter': 'Download watcher', 'Neue PDFs melden': 'Notify about new PDFs', 'Smart-Flow-Demo': 'Smart Flow demo',
  'Lernplattform, Drive und Kalender öffnen.': 'Open learning platform, Drive, and calendar.', 'Outlook, Aufgaben und OneDrive öffnen.': 'Open Outlook, tasks, and OneDrive.', 'GitHub, MDN und Stack Overflow öffnen.': 'Open GitHub, MDN, and Stack Overflow.',
  'Lokaler Trigger wartet auf vollständige Downloads.': 'A local trigger waits for downloads to finish.', 'Startet bei neuer PDF-Datei im Downloads-Ordner.': 'Triggers when a new PDF appears in Downloads.', 'Zeigt Variablen und If/Then-Logik in einem Beispiel.': 'Demonstrates variables and if/then logic.',
  'Es wurde kein Workflow gefunden.': 'No workflow was found.', 'Neuer Flow erstellt.': 'New flow created.', 'Flow wurde lokal gespeichert.': 'Flow saved locally.',
  'Flow-Datei wurde exportiert.': 'Flow file exported.', 'Flow wurde importiert.': 'Flow imported.', 'Vorlage hinzufügen': 'Add template', 'Datei auswählen': 'Choose file',
  'Abbruch wurde angefordert.': 'Cancellation requested.', 'Füge zuerst mindestens eine Aktion hinzu.': 'Add at least one action first.', 'Ausführung starten': 'Start run',
  'Canvas-Ansicht zurückgesetzt.': 'Canvas view reset.', 'Flow konnte nicht erstellt werden.': 'Could not create flow.', 'Aktion entfernt.': 'Action removed.',
  'Wähle links eine Aktion, konfiguriere sie rechts und starte den Ablauf. Manche Fenster-Aktionen benötigen Windows. Dateioperationen prüfen und Flow vor dem Start bestätigen.': 'Choose an action on the left, configure it on the right, and run the workflow. Some window actions require Windows. Check file operations and confirm the flow before starting.',
  'Welches Fenster soll verwendet werden? Nummer eingeben:': 'Which window should be used? Enter its number:', 'Keine sichtbaren Fenster gefunden oder Windows-Fenstersteuerung nicht verfügbar.': 'No visible windows found or Windows window control is unavailable.',
  'Ungültige Fensternummer.': 'Invalid window number.', 'Fensterziel gesetzt:': 'Window target set:', 'Fensterliste fehlgeschlagen:': 'Failed to load window list:', 'Pfadauswahl fehlgeschlagen:': 'Path selection failed:',
  'Speichern fehlgeschlagen:': 'Save failed:', 'Export fehlgeschlagen:': 'Export failed:', 'Import fehlgeschlagen:': 'Import failed:', 'Ausführung fehlgeschlagen:': 'Run failed:',
  'Fortsetzung gestartet.': 'Resume started.', 'Fortsetzen fehlgeschlagen:': 'Resume failed:', 'Beende zuerst den aktuellen Flow.': 'Finish the current flow first.',
  'Ab diesem Schritt fortsetzen? Bereits ausgeführte Aktionen vor diesem Schritt werden nicht wiederholt. Der Schritt und alle folgenden können erneut ausgeführt werden; Dateioperationen vorher prüfen.': 'Resume from this step? Actions before this step will not be repeated. This step and all following steps may run again; check file operations first.',
  'Alle Aktionen aus diesem Flow entfernen?': 'Remove all actions from this flow?', 'Canvas-Ansicht zurückgesetzt.': 'Canvas view reset.',
  'Beschreibe zuerst, was dein Flow erledigen soll.': 'First describe what your flow should do.', 'Dafür gibt es noch keine lokale Regel. Versuche Schule, Office, E-Mail, Kalender, Dateien, Website oder Developer.': 'There is no local rule for that yet. Try school, office, email, calendar, files, website, or developer.',
  'Lokal gespeichert': 'Saved locally', 'Automatisches Speichern aktiv': 'Auto-save is enabled', 'Unbenannter Flow': 'Untitled flow', 'Ungültige Fensternummer.': 'Invalid window number.',
  'Flow Architect Entwurf': 'Flow Architect draft', 'Ausführung auswählen': 'Select run', 'Noch keine Ausführung gespeichert.': 'No runs saved yet.',
  'Lokal aus deinem Auftrag abgeleiteter Entwurf:': 'Draft generated locally from your request:', 'Flow Architect Entwurf': 'Flow Architect draft', 'Neuer Flow': 'New Flow'
};

let appLocale = 'en';
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
function translatePhrase(source) {
  if (appLocale !== 'en') return source;
  if (Object.prototype.hasOwnProperty.call(EN_TRANSLATIONS, source)) return EN_TRANSLATIONS[source];
  let match;
  if ((match = source.match(/^(\d+) Aktionen? · Manueller Start$/))) return `${match[1]} ${Number(match[1]) === 1 ? 'action' : 'actions'} · Manual start`;
  if ((match = source.match(/^(\d+) Webseiten öffnen$/))) return `Open ${match[1]} website${Number(match[1]) === 1 ? '' : 's'}`;
  if ((match = source.match(/^(\d+) Schritte$/))) return `${match[1]} steps`;
  if ((match = source.match(/^(\d+) protokollierte Schritte · (Automatisch|Manuell)$/))) return `${match[1]} logged steps · ${match[2] === 'Automatisch' ? 'Automatic' : 'Manual'}`;
  if ((match = source.match(/^Intervall · (.+) Min\.$/))) return `Interval · ${match[1]} min`;
  if ((match = source.match(/^Programmstart · (.+)$/))) return `Program start · ${match[1] === 'nicht gewählt' ? 'not selected' : match[1]}`;
  if ((match = source.match(/^Nach (\d+) Sek\. schließen$/))) return `Close after ${match[1]} sec`;
  if ((match = source.match(/^Warte auf (.+) · max\. (\d+) s$/))) return `Wait for ${match[1]} · max ${match[2]} sec`;
  if ((match = source.match(/^Fenstertitel: (.+)$/))) return `Window title: ${match[1]}`;
  if ((match = source.match(/^Entwurf an (.+)$/))) return `Draft to ${match[1]}`;
  if ((match = source.match(/^(.+) · Konto (\d+)$/))) return `${match[1]} · Account ${match[2]}`;
  if ((match = source.match(/^(\d+) Durchlauf\/Durchläufe$/))) return `${match[1]} ${Number(match[1]) === 1 ? 'iteration' : 'iterations'}`;
  if ((match = source.match(/^(.+) wurde lokal gespeichert\.$/))) return `${match[1]} saved locally.`;
  if ((match = source.match(/^Flow „(.+)“ automatisch gestartet\.$/))) return `Flow “${match[1]}” started automatically.`;
  if ((match = source.match(/^Flow „(.+)“ gestartet\.$/))) return `Flow “${match[1]}” started.`;
  if ((match = source.match(/^Schritt (\d+)\/(\d+): (.+)$/))) return `Step ${match[1]}/${match[2]}: ${match[3]}`;
  if ((match = source.match(/^Schritt (\d+) abgeschlossen\.$/))) return `Step ${match[1]} completed.`;
  if ((match = source.match(/^Wiederholungsversuch (\d+)\/(\d+) für Schritt (\d+)\.$/))) return `Retry ${match[1]}/${match[2]} for step ${match[3]}.`;
  if ((match = source.match(/^Lokaler Trigger ausgelöst: (.+) → (.+)$/))) return `Local trigger fired: ${match[1]} → ${match[2]}`;
  if ((match = source.match(/^Trigger „(.+)“ für „(.+)“ übersprungen: Ein anderer Flow läuft bereits\.$/))) return `Trigger “${match[1]}” for “${match[2]}” skipped: another flow is already running.`;
  if ((match = source.match(/^(\d+) Fenster zum normalen Schließen aufgefordert\.$/))) return `Requested ${match[1]} window(s) to close normally.`;
  if ((match = source.match(/^Dateisuche: (\d+) Treffer für (.+?)(?: \(Pfade in Zwischenablage kopiert\))?\.$/))) return `File search: ${match[1]} match(es) for ${match[2]}.`;
  if ((match = source.match(/^Schritt (\d+) nach (\d+) Wiederholung\(en\) übersprungen: (.+)$/))) return `Skipped step ${match[1]} after ${match[2]} retries: ${match[3]}`;
  if ((match = source.match(/^Schritt (\d+) nach (\d+) Versuch\(en\) übersprungen: (.+)$/))) return `Skipped step ${match[1]} after ${match[2]} attempt(s): ${match[3]}`;
  if ((match = source.match(/^Geplantes Schließen fehlgeschlagen: (.+)$/))) return `Scheduled close failed: ${match[1]}`;
  if ((match = source.match(/^(.+) hinzugefügt\.$/))) return `${translatePhrase(match[1])} added.`;
  if ((match = source.match(/^„(.+)“ wurde in deinen Workspace kopiert\.$/))) return `“${match[1]}” was copied to your workspace.`;
  if ((match = source.match(/^(.+) wurde als eigener Flow erstellt\.$/))) return `${match[1]} was created as a new flow.`;
  if ((match = source.match(/^Vorlage konnte nicht hinzugefügt werden: (.+)$/))) return `Could not add template: ${match[1]}`;
  if ((match = source.match(/^Vorlage konnte nicht erstellt werden: (.+)$/))) return `Could not create template: ${match[1]}`;
  if ((match = source.match(/^LAPS Flow konnte nicht initialisiert werden: (.+)$/))) return `Could not initialize LAPS Flow: ${match[1]}`;
  if ((match = source.match(/^Ausführung fehlgeschlagen: (.+)$/))) return `Run failed: ${match[1]}`;
  if ((match = source.match(/^Fensterziel gesetzt: (.+)$/))) return `Window target set: ${match[1]}`;
  if ((match = source.match(/^Fensterliste fehlgeschlagen: (.+)$/))) return `Failed to load window list: ${match[1]}`;
  if ((match = source.match(/^Pfadauswahl fehlgeschlagen: (.+)$/))) return `Path selection failed: ${match[1]}`;
  if ((match = source.match(/^Fortsetzen fehlgeschlagen: (.+)$/))) return `Resume failed: ${match[1]}`;
  if ((match = source.match(/^Speichern fehlgeschlagen: (.+)$/))) return `Save failed: ${match[1]}`;
  return source;
}
function translateTree(root) {
  if (!root) return;
  const translateNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Do not translate text inside editable controls. A textarea's child text is its defaultValue;
      // changing it from the translation observer can make user-entered multiline values appear to vanish.
      if (node.parentElement && node.parentElement.closest('textarea, [contenteditable="true"]')) return;
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const source = originalText.get(node);
      const lead = source.match(/^\s*/)?.[0] || '';
      const trail = source.match(/\s*$/)?.[0] || '';
      const clean = source.trim();
      const translated = clean ? `${lead}${translatePhrase(clean)}${trail}` : source;
      if (node.nodeValue !== translated) node.nodeValue = translated;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node !== document) return;
    if (node.nodeType === Node.ELEMENT_NODE) {
      for (const attr of ['placeholder', 'title', 'aria-label']) {
        if (node.id === 'theme-btn') continue;
        if (!node.hasAttribute(attr)) continue;
        let attrs = originalAttributes.get(node);
        if (!attrs) { attrs = {}; originalAttributes.set(node, attrs); }
        if (!Object.prototype.hasOwnProperty.call(attrs, attr)) attrs[attr] = node.getAttribute(attr);
        const source = attrs[attr];
        const translated = appLocale === 'en' ? translatePhrase(source) : source;
        if (node.getAttribute(attr) !== translated) node.setAttribute(attr, translated);
      }
    }
    for (const child of Array.from(node.childNodes || [])) translateNode(child);
  };
  translateNode(root);
}
function setLocale(locale) {
  appLocale = locale === 'en' ? 'en' : 'de';
  try { localStorage.setItem('laps-flow-locale', appLocale); } catch (_) {}
  document.documentElement.lang = appLocale;
  const selector = document.getElementById('language-select');
  if (selector && selector.value !== appLocale) selector.value = appLocale;
  translateTree(document.body);
  updateSavedLabel(hasUnsavedChanges ? 'dirty' : 'saved');
  updateThemeButton();
  // Rebuild locale-sensitive dates and dynamic summaries with the selected locale.
  try { if (typeof renderAll === 'function' && current) renderAll(); if (typeof renderLogs === 'function') renderLogs(); if (typeof refreshHistoryList === 'function') refreshHistoryList(); if (typeof renderMarketplace === 'function') renderMarketplace(); } catch (_) {}
}
function initLocalization() {
  let saved = 'en';
  try { saved = localStorage.getItem('laps-flow-locale') || 'en'; } catch (_) {}
  appLocale = saved === 'en' ? 'en' : 'de';
  const selector = document.getElementById('language-select');
  if (selector) { selector.value = appLocale; selector.addEventListener('change', () => setLocale(selector.value)); }
  document.documentElement.lang = appLocale;
  translateTree(document.body);
  updateThemeButton();
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'childList') record.addedNodes.forEach((node) => translateTree(node));
      else if (record.type === 'characterData') translateTree(record.target);
      else if (record.type === 'attributes') translateTree(record.target);
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label'] });
}


const ACTIONS = {
  'launch-app': { title: 'App starten', subtitle: 'Startet eine lokale Windows-Anwendung.', icon: '▣', css: 'app-icon', group: 'APPS & FENSTER', description: 'Programm ausführen' },
  'close-app': { title: 'App / Fenster schließen', subtitle: 'Fordert das ausgewählte Programm zum normalen Schließen auf.', icon: '×', css: 'notify-icon', group: 'APPS & FENSTER', description: 'Fenster kontrolliert schließen' },
  'window-control': { title: 'Fenster steuern', subtitle: 'Minimieren, maximieren, wiederherstellen oder aktivieren.', icon: '▱', css: 'app-icon', group: 'APPS & FENSTER', description: 'Fensterstatus ändern' },
  'switch-window': { title: 'Programm wechseln', subtitle: 'Wechselt zum nächsten sichtbaren Programmfenster.', icon: '⇄', css: 'app-icon', group: 'APPS & FENSTER', description: 'Zum nächsten Fenster wechseln' },
  'close-app-after-delay': { title: 'App zeitgesteuert schließen', subtitle: 'Schließt eine vom Flow gestartete App nach einer Wartezeit.', icon: '◷', css: 'wait-icon', group: 'APPS & FENSTER', description: 'App nach Zeit schließen' },
  'open-mailbox': { title: 'E-Mail-Postfach öffnen', subtitle: 'Öffnet Gmail, Outlook oder ein anderes Webpostfach.', icon: '✉', css: 'web-icon', group: 'E-MAIL', description: 'Postfach im Browser öffnen' },
  'compose-email': { title: 'E-Mail vorbereiten', subtitle: 'Erstellt einen Entwurf mit Empfänger, Betreff und Nachricht.', icon: '↗', css: 'web-icon', group: 'E-MAIL', description: 'E-Mail-Entwurf öffnen' },
  'select-email-account': { title: 'E-Mail-Konto auswählen', subtitle: 'Legt den Anbieter und Kontoindex für nachfolgende Mail-Aktionen fest.', icon: '◎', css: 'copy-icon', group: 'E-MAIL', description: 'Mailkonto für den Flow setzen' },
  'close-mail-client': { title: 'Mailfenster schließen', subtitle: 'Schließt ein passendes Postfach-Fenster auf normale Weise.', icon: '✕', css: 'notify-icon', group: 'E-MAIL', description: 'Postfachfenster schließen' },
  'open-folder': { title: 'Ordner öffnen', subtitle: 'Öffnet einen ausgewählten Ordner im Explorer.', icon: '▰', css: 'folder-icon', group: 'DATEIEN', description: 'Ordner im Explorer öffnen' },
  'open-path': { title: 'Datei / Pfad öffnen', subtitle: 'Öffnet Datei oder Ordner mit der Standardanwendung.', icon: '▰', css: 'folder-icon', group: 'DATEIEN', description: 'Datei oder Pfad öffnen' },
  'file-operation': { title: 'Datei bearbeiten', subtitle: 'Datei erstellen, kopieren, verschieben oder umbenennen.', icon: '▤', css: 'folder-icon', group: 'DATEIEN', description: 'Dateioperation ausführen' },
  'search-files-by-type': { title: 'Dateien nach Typ suchen', subtitle: 'Sucht Dateiendungen in einem Ordner.', icon: '⌕', css: 'copy-icon', group: 'DATEIEN', description: 'Dateien finden' },
  'wait-download-complete': { title: 'Download abwarten', subtitle: 'Wartet, bis eine passende Datei vollständig geladen ist.', icon: '⇩', css: 'wait-icon', group: 'DATEIEN', description: 'Auf fertigen Download warten' },
  'sort-files-by-type': { title: 'Dateien automatisch sortieren', subtitle: 'Verschiebt Dateien anhand ihrer Endung in Zielordner.', icon: '▦', css: 'folder-icon', group: 'DATEIEN', description: 'Dateien nach Regeln sortieren' },
  'open-url': { title: 'Website öffnen', subtitle: 'Öffnet eine URL im Standardbrowser oder gewählten Browser.', icon: '↗', css: 'web-icon', group: 'WEB & BROWSER', description: 'Link im Browser starten' },
  'open-web-app': { title: 'Web-App öffnen', subtitle: 'Öffnet eine bestimmte Webanwendung.', icon: '◉', css: 'web-icon', group: 'WEB & BROWSER', description: 'Web-App starten' },
  'open-websites': { title: 'Webseiten-Serie öffnen', subtitle: 'Öffnet mehrere URLs der Reihe nach.', icon: '⇗', css: 'web-icon', group: 'WEB & BROWSER', description: 'Mehrere Seiten im Ablauf öffnen' },
  'close-browser-window': { title: 'Browserfenster schließen', subtitle: 'Schließt ein zugeordnetes oder anhand Titel/Prozess gewähltes Fenster.', icon: '×', css: 'notify-icon', group: 'WEB & BROWSER', description: 'Browserfenster schließen' },
  'copy-text': { title: 'Text kopieren', subtitle: 'Legt Text in die Zwischenablage.', icon: '▤', css: 'copy-icon', group: 'TOOLS', description: 'In Zwischenablage' },
  'notification': { title: 'Benachrichtigung', subtitle: 'Zeigt eine Windows-Benachrichtigung.', icon: '♧', css: 'notify-icon', group: 'TOOLS', description: 'Hinweis anzeigen' },
  'wait': { title: 'Warten', subtitle: 'Pausiert den Flow für eine Dauer.', icon: '◷', css: 'wait-icon', group: 'TOOLS', description: 'Pause im Ablauf' },
  'set-variable': { title: 'Variable setzen', subtitle: 'Speichert einen Wert für spätere Schritte und Bedingungen.', icon: 'ƒ', css: 'copy-icon', group: 'FLOW CONTROL', description: 'Wert speichern und weiterverwenden' },
  'logic-condition': { title: 'Bedingung prüfen', subtitle: 'Vergleicht einen Wert oder prüft eine lokale Datei bzw. einen Prozess.', icon: '◇', css: 'notify-icon', group: 'FLOW CONTROL', description: 'Wenn/dann-Logik mit Sprung' },
  'loop-start': { title: 'Schleife starten', subtitle: 'Wiederholt alle Schritte bis zum passenden Schleifenende.', icon: '↻', css: 'wait-icon', group: 'FLOW CONTROL', description: 'Schritte mehrfach ausführen' },
  'loop-end': { title: 'Schleife beenden', subtitle: 'Markiert das Ende einer Wiederholung.', icon: '↳', css: 'wait-icon', group: 'FLOW CONTROL', description: 'Wiederholung abschließen' },
  'run-subflow': { title: 'Unter-Flow ausführen', subtitle: 'Ruft einen anderen gespeicherten Flow als wiederverwendbaren Baustein auf.', icon: '⇢', css: 'app-icon', group: 'FLOW CONTROL', description: 'Gespeicherten Flow wiederverwenden' }
};

let workflows = [];
let current = null;
let selectedStepId = null;
let inspectorRenderedStepId = null;
let running = false;
let hasUnsavedChanges = false;
let logs = [];
let autoSaveTimer = null;
let editRevision = 0;
let saveChain = Promise.resolve();
let allowUnloadAfterSave = false;
let closeSaveInFlight = false;
let debugModePending = false;
let debugModeActive = false;
let debugPaused = false;
let currentTheme = 'dark';

function newId(prefix = 'step') { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`; }
function defaultConfig(type) {
  switch (type) {
    case 'open-url': return { url: 'https://example.com', delaySeconds: 0, browserPath: '', titleHint: '' };
    case 'open-web-app': return { appName: 'Meine Web-App', url: 'https://example.com', delaySeconds: 0, browserPath: '', titleHint: '' };
    case 'open-websites': return { urls: 'https://mail.google.com\nhttps://calendar.google.com\nhttps://drive.google.com', delaySeconds: 2, browserPath: '' };
    case 'open-path': case 'open-folder': return { path: '' };
    case 'launch-app': return { path: '', closeAfterSeconds: 0 };
    case 'close-app': return { targetMode: 'last-launched', target: '' };
    case 'window-control': return { operation: 'activate', targetMode: 'title', target: '' };
    case 'switch-window': return {};
    case 'close-app-after-delay': return { seconds: 30, targetMode: 'last-launched', target: '' };
    case 'open-mailbox': return { provider: 'gmail', accountIndex: 0, url: '', browserPath: '', delaySeconds: 0 };
    case 'compose-email': return { provider: 'gmail', accountIndex: 0, recipient: '', subject: '', body: '' };
    case 'select-email-account': return { provider: 'gmail', accountIndex: 0 };
    case 'close-mail-client': return { targetMode: 'title', target: 'Gmail' };
    case 'close-browser-window': return { targetMode: 'last-browser', target: '' };
    case 'file-operation': return { operation: 'copy', sourcePath: '', destinationPath: '', content: '' };
    case 'search-files-by-type': return { folderPath: '', extensions: '.pdf,.docx', recursive: true, copyResults: true };
    case 'wait-download-complete': return { folderPath: '', pattern: '*', timeoutSeconds: 180 };
    case 'sort-files-by-type': return { sourcePath: '', destinationPath: '', rules: '.pdf=PDFs\n.png,.jpg,.jpeg=Images\n.zip,.7z=Archives\n.exe=Installers', conflictPolicy: 'skip' };
    case 'copy-text': return { text: '' };
    case 'notification': return { title: 'LAPS Flow', message: 'Dein Flow-Schritt wurde ausgeführt.' };
    case 'wait': return { ms: 1000 };
    case 'set-variable': return { name: 'status', value: 'bereit', valueType: 'text' };
    case 'logic-condition': return { conditionSource: 'variable', variableName: 'status', operator: 'equals', compareValue: 'bereit', path: '', processName: '', skipSteps: 1 };
    case 'loop-start': return { count: 2 };
    case 'loop-end': return {};
    case 'run-subflow': return { workflowId: '' };
    default: return {};
  }
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function updateSavedLabel(state) {
  const el = $('#saved-label'); if (!el) return;
  const labels = appLocale === 'en' ? { saved: 'Saved locally', dirty: 'Unsaved changes', saving: 'Saving…', failed: 'Save failed' } : { saved: 'Automatisch gespeichert', dirty: 'Nicht gespeichert', saving: 'Speichert…', failed: 'Speichern fehlgeschlagen' };
  el.textContent = labels[state] || labels.saved;
  el.style.color = state === 'dirty' || state === 'failed' ? '#f3c978' : '';
}
function scheduleAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => { if (hasUnsavedChanges) saveCurrent(true); }, 650);
}
function markDirty() { editRevision++; hasUnsavedChanges = true; updateSavedLabel('dirty'); scheduleAutoSave(); }
function toast(message, type = 'success') {
  const element = document.createElement('div'); element.className = `toast ${type}`; element.textContent = message;
  $('#toast-area').appendChild(element); setTimeout(() => element.remove(), 4200);
}
function setCurrentWorkflow(workflow) {
  clearTimeout(autoSaveTimer); editRevision++;
  inspectorRenderedStepId = null;
  current = JSON.parse(JSON.stringify(workflow)); selectedStepId = current.steps[0]?.id || null;
  $('#flow-name').value = current.name; hasUnsavedChanges = false;
  updateSavedLabel('saved');
  renderAll(); renderWorkflowSelect();
}
function renderWorkflowSelect() {
  const select = $('#workflow-select'); if (!select) return;
  const selected = current?.id || '';
  select.innerHTML = workflows.map((flow) => `<option value="${escapeHtml(flow.id)}" ${flow.id === selected ? 'selected' : ''}>${escapeHtml(flow.name)}</option>`).join('');
  select.disabled = workflows.length === 0;
}
function renderAll() { renderCanvas(); renderInspector(); renderFlowCount(); }
function renderCatalog() {
  const container = $('#action-catalog'); if (!container) return;
  container.innerHTML = '';
  const groups = [...new Set(Object.values(ACTIONS).map((action) => action.group))];
  for (const group of groups) {
    const heading = document.createElement('div'); heading.className = 'action-group-title'; heading.textContent = group; heading.dataset.group = group; container.appendChild(heading);
    for (const [type, action] of Object.entries(ACTIONS).filter(([, item]) => item.group === group)) {
      const button = document.createElement('button'); button.className = 'action-tile'; button.dataset.add = type;
      button.innerHTML = `<span class="action-icon ${action.css}">${action.icon}</span><span><strong>${escapeHtml(action.title)}</strong><small>${escapeHtml(action.description)}</small></span><b>+</b>`;
      button.addEventListener('click', () => addStep(type)); container.appendChild(button);
    }
  }
  $('#action-count').textContent = String(Object.keys(ACTIONS).length).padStart(2, '0');
}
function renderFlowCount() {
  const count = current?.steps.length || 0;
  const trigger = current?.trigger || { type: 'manual' };
  const triggerLabels = { manual: 'Manueller Start', interval: `Intervall · ${trigger.intervalMinutes || 15} Min.`, 'file-created': 'Datei-Ereignis', 'download-complete': 'Download-Ereignis', 'process-start': `Programmstart · ${trigger.processName || 'nicht gewählt'}` };
  $('#step-count').textContent = `${count} ${count === 1 ? 'Aktion' : 'Aktionen'} · ${triggerLabels[trigger.type] || triggerLabels.manual}`;
  $('#flow-end').style.display = count ? 'flex' : 'none'; $('#end-connector').style.display = count ? 'block' : 'none';
  $('#canvas-hint').classList.toggle('show', count === 0); $('#clear-btn').disabled = count === 0 || running;
  $('#clear-btn').style.opacity = $('#clear-btn').disabled ? '.4' : '1';
}
function stepSummary(step) {
  const c = step.config || {};
  switch (step.type) {
    case 'launch-app': return c.path || 'Keine Anwendung ausgewählt';
    case 'close-app': return c.targetMode === 'last-launched' ? 'Zuletzt gestartete App' : c.target || 'Ziel auswählen';
    case 'window-control': return `${({ activate: 'In Vordergrund', minimize: 'Minimieren', maximize: 'Maximieren', restore: 'Wiederherstellen' })[c.operation] || 'Fenster steuern'} · ${c.target || 'Ziel fehlt'}`;
    case 'switch-window': return 'Zum nächsten sichtbaren Fenster wechseln';
    case 'close-app-after-delay': return `Nach ${c.seconds || 30} Sek. schließen`;
    case 'open-mailbox': return `${c.provider === 'gmail' ? 'Gmail' : c.provider === 'outlook' ? 'Outlook' : 'Webpostfach'}${c.provider === 'gmail' ? ` · Konto ${Number(c.accountIndex || 0) + 1}` : ''}`;
    case 'compose-email': return c.recipient ? `Entwurf an ${c.recipient}` : 'E-Mail-Entwurf vorbereiten';
    case 'select-email-account': return `${c.provider === 'gmail' ? 'Gmail' : 'Outlook'} · Konto ${Number(c.accountIndex || 0) + 1}`;
    case 'close-mail-client': return `Fenstertitel: ${c.target || 'Gmail'}`;
    case 'open-folder': case 'open-path': return c.path || 'Noch kein Pfad eingetragen';
    case 'file-operation': return ({ create: 'Datei erstellen', copy: 'Datei kopieren', move: 'Datei verschieben', rename: 'Datei umbenennen' })[c.operation] || 'Dateioperation';
    case 'search-files-by-type': return c.extensions || 'Dateiendungen eintragen';
    case 'wait-download-complete': return `Warte auf ${c.pattern || '*'} · max. ${c.timeoutSeconds || 180} s`;
    case 'sort-files-by-type': return 'Nach Dateiendung sortieren';
    case 'open-url': return c.url || 'Noch kein Link eingetragen';
    case 'open-web-app': return c.appName || c.url || 'Web-App konfigurieren';
    case 'open-websites': return `${String(c.urls || '').split(/\r?\n/).filter((v) => v.trim()).length} Webseiten öffnen`;
    case 'close-browser-window': return c.targetMode === 'last-browser' ? 'Vom Flow geöffnetes Browserfenster' : c.target || 'Fensterziel auswählen';
    case 'copy-text': return c.text ? c.text.replace(/\s+/g, ' ').slice(0, 58) : 'Text für die Zwischenablage';
    case 'notification': return c.message || 'Benachrichtigung anzeigen';
    case 'wait': return `${Math.max(0, Number(c.ms) || 0) / 1000} Sek. warten`;
    case 'set-variable': return `${c.name || 'variable'} = ${c.value ?? ''}`;
    case 'logic-condition': return c.conditionSource === 'file-exists' ? `Datei existiert? ${c.path || 'Pfad fehlt'}` : c.conditionSource === 'process-running' ? `Prozess läuft? ${c.processName || 'Name fehlt'}` : `${c.variableName || 'Variable'} ${c.operator || 'equals'} ${c.compareValue ?? ''}`;
    case 'loop-start': return `${c.count ?? 2} Durchlauf/Durchläufe`;
    case 'loop-end': return 'Ende des Schleifenblocks';
    case 'run-subflow': return workflows.find((flow) => flow.id === c.workflowId)?.name || 'Unter-Flow auswählen';
    default: return '';
  }
}
function renderCanvas() {
  const container = $('#steps-container'); container.innerHTML = ''; if (!current) return;
  current.steps.forEach((step, index) => {
    const info = ACTIONS[step.type] || ACTIONS.wait;
    const wrap = document.createElement('div'); wrap.className = 'step-wrap';
    const card = document.createElement('div'); card.className = `step-card${step.id === selectedStepId ? ' selected' : ''}`; card.dataset.stepId = step.id;
    card.innerHTML = `<span class="step-icon action-icon ${info.css}">${info.icon}</span><span class="step-num">${String(index + 1).padStart(2, '0')}</span><span class="step-main"><strong>${escapeHtml(info.title)}</strong><small>${escapeHtml(stepSummary(step))}</small></span><span class="step-actions"><button data-move="up" title="Nach oben" ${index === 0 || running ? 'disabled' : ''}>↑</button><button data-move="down" title="Nach unten" ${index === current.steps.length - 1 || running ? 'disabled' : ''}>↓</button><button data-delete="1" class="delete-step" title="Aktion entfernen" ${running ? 'disabled' : ''}>×</button></span>`;
    card.addEventListener('click', (event) => {
      const move = event.target.closest('[data-move]'); const del = event.target.closest('[data-delete]');
      if (move) { event.stopPropagation(); moveStep(step.id, move.dataset.move === 'up' ? -1 : 1); return; }
      if (del) { event.stopPropagation(); removeStep(step.id); return; }
      commitInspectorFields();
      selectedStepId = step.id; setInspectorVisibility(true); renderCanvas(); renderInspector();
    });
    if (running) card.style.pointerEvents = 'none'; wrap.appendChild(card);
    if (index < current.steps.length - 1) { const connector = document.createElement('div'); connector.className = 'step-connector'; wrap.appendChild(connector); }
    container.appendChild(wrap);
  });
  $('#flow-end').style.display = current.steps.length ? 'flex' : 'none'; $('#end-connector').style.display = current.steps.length ? 'block' : 'none';
  $('#canvas-hint').classList.toggle('show', current.steps.length === 0); renderFlowCount();
}
function field(label, control, help = '') { return `<div class="field-group"><label class="field-label">${label}</label>${control}${help ? `<div class="field-help">${help}</div>` : ''}</div>`; }
function inputField(label, key, value, placeholder = '', options = {}) {
  const isArea = options.textarea; const tag = isArea ? 'textarea' : 'input';
  const attrs = isArea ? `rows="${options.rows || 4}"` : `type="${options.type || 'text'}" ${options.min !== undefined ? `min="${options.min}"` : ''} ${options.max !== undefined ? `max="${options.max}"` : ''} ${options.step !== undefined ? `step="${options.step}"` : ''}`;
  const clazz = isArea ? 'field-textarea' : 'field-input';
  // Textarea content is hydrated from the step model after DOM creation. Keeping values out of
  // the HTML string avoids parser/defaultValue edge cases and prevents them being confused with
  // translated text nodes when the Properties panel is rebuilt.
  const valueAttr = isArea ? '' : `value="${escapeHtml(value)}"`;
  return field(label, `<${tag} class="${clazz}" data-config="${key}" ${attrs} placeholder="${escapeHtml(placeholder)}" ${valueAttr}></${tag}>`, options.help || '');
}
function selectField(label, key, value, options, help = '') {
  const items = options.map((option) => {
    const item = typeof option === 'string' ? { value: option, label: option } : option;
    return `<option value="${escapeHtml(item.value)}" ${String(item.value) === String(value) ? 'selected' : ''}>${escapeHtml(item.label)}</option>`;
  }).join('');
  return field(label, `<select class="field-input" data-config="${key}">${items}</select>`, help);
}
function checkField(label, key, checked, help = '') {
  return field(label, `<label class="check-row"><input type="checkbox" data-config="${key}" data-boolean="true" ${checked ? 'checked' : ''}><span>Aktiviert</span></label>`, help);
}
function browseButton(kind, text, key) { return `<div class="field-group"><button class="browse-btn" data-browse="${kind}" data-browse-key="${key}" style="width:100%;height:32px">${text}</button></div>`; }
function windowTargetFields(step, modeOptions = null) {
  let fields = '';
  fields += selectField('ZIELTYP', 'targetMode', step.config.targetMode || 'title', modeOptions || [
    { value: 'last-launched', label: 'Zuletzt von diesem Flow gestartete App' },
    { value: 'process', label: 'Prozessname (z. B. notepad)' },
    { value: 'title', label: 'Fenstertitel enthält' }
  ], 'Für gezieltes Schließen zuerst den Flow selbst die App starten lassen oder Prozess/Fenstertitel angeben.');
  fields += inputField('PROZESSNAME ODER FENSTERTITEL', 'target', step.config.target || '', 'z. B. notepad oder Gmail', { help: 'Mit „Fensterliste laden“ kannst du ein sichtbares Fenster auswählen.' });
  fields += `<div class="field-group"><button class="browse-btn" data-load-windows="1" style="width:100%;height:32px">Fensterliste laden …</button></div>`;
  return fields;
}
function commitInspectorFields() {
  if (!current || !inspectorRenderedStepId) return;
  const step = current.steps.find((item) => item.id === inspectorRenderedStepId);
  const box = $('#inspector-content');
  if (!step || !box) return;
  let changed = false;
  box.querySelectorAll('[data-config]').forEach((element) => {
    const key = element.dataset.config;
    let value;
    if (element.dataset.boolean === 'true') value = element.checked;
    else if (element.type === 'number') value = Math.max(Number(element.min || -Infinity), Math.min(Number(element.max || Infinity), Number(element.value) || 0));
    else value = element.value;
    if (step.config[key] !== value) { step.config[key] = value; changed = true; }
  });
  if (changed) markDirty();
}
function setInspectorVisibility(visible) {
  const grid = $('.studio-grid');
  if (!grid) return;
  grid.classList.toggle('inspector-hidden', !visible);
  const openButton = $('#properties-open-btn');
  const closeButton = $('#properties-close-btn');
  if (openButton) openButton.hidden = visible;
  if (closeButton) closeButton.hidden = !visible;
}
function renderInspector() {
  // Commit the previous pane before replacing its DOM; this makes textarea/list values resilient
  // when the user switches to another step or opens flow settings.
  commitInspectorFields();
  inspectorRenderedStepId = selectedStepId;
  const box = $('#inspector-content'); $('#inspector-subtitle').textContent = selectedStepId ? 'Aktion bearbeiten' : 'Flow-Konfiguration';
  if (!current) return;
  const step = current.steps.find((item) => item.id === selectedStepId);
  if (!step) {
    box.innerHTML = `<div class="field-group"><label class="field-label">FLOW-NAME</label><input class="field-input" id="inspector-flow-name" value="${escapeHtml(current.name)}" maxlength="100"></div><div class="field-group"><label class="field-label">BESCHREIBUNG</label><textarea class="field-textarea" id="inspector-flow-description" rows="3" placeholder="Was soll dieser Flow erledigen?">${escapeHtml(current.description || '')}</textarea><div class="field-help">Kurze Beschreibung deines Ablaufs.</div></div><div class="flow-settings-card"><strong>Windows Event Engine · Trigger</strong><p>Wähle, wodurch dieser Flow automatisch startet. Bei Datei- und Prozess-Triggern bleibt die Überwachung lokal auf diesem PC.</p><label class="field-label">STARTBEDINGUNG</label><select class="field-input" id="flow-trigger-type"><option value="manual" ${(current.trigger?.type || 'manual')==='manual'?'selected':''}>Nur manuell</option><option value="interval" ${current.trigger?.type==='interval'?'selected':''}>Zeitintervall</option><option value="file-created" ${current.trigger?.type==='file-created'?'selected':''}>Neue Datei im Ordner</option><option value="download-complete" ${current.trigger?.type==='download-complete'?'selected':''}>Download abgeschlossen</option><option value="process-start" ${current.trigger?.type==='process-start'?'selected':''}>Programm wird gestartet</option></select><div class="field-help">Automatisch gestartete Flows laufen ohne Bestätigungsfenster. Prüfe sie sorgfältig, bevor du Trigger aktivierst.</div>${(current.trigger?.type || 'manual')==='interval' ? `<label class="field-label">INTERVALL (MINUTEN)</label><input class="field-input" id="flow-trigger-interval" type="number" min="5" max="1440" value="${Number(current.trigger?.intervalMinutes || 15)}">` : ''}${['file-created','download-complete'].includes(current.trigger?.type) ? `<label class="field-label">ÜBERWACHTER ORDNER</label><input class="field-input" id="flow-trigger-folder" value="${escapeHtml(current.trigger?.folderPath || '')}" placeholder="Leer = Downloads-Ordner"><button class="browse-btn" id="flow-trigger-folder-browse" style="width:100%;height:32px;margin-top:7px">Ordner auswählen …</button><label class="field-label" style="margin-top:12px">DATEINAMENMUSTER</label><input class="field-input" id="flow-trigger-pattern" value="${escapeHtml(current.trigger?.pattern || '*')}" placeholder="*.pdf oder *">` : ''}${current.trigger?.type==='process-start' ? `<label class="field-label">PROZESSNAME (OHNE .EXE OPTIONAL)</label><input class="field-input" id="flow-trigger-process" value="${escapeHtml(current.trigger?.processName || '')}" placeholder="z. B. notepad oder chrome">` : ''}</div><div class="flow-settings-card"><strong>Self-Healing</strong><p>Bei vorübergehenden Fehlern Aktionen erneut versuchen.</p><label class="field-label">WIEDERHOLUNGEN PRO AKTION</label><select class="field-input" id="flow-retry-count"><option value="0" ${Number(current.retryCount||0)===0?'selected':''}>Keine</option><option value="1" ${Number(current.retryCount||0)===1?'selected':''}>1 Wiederholung</option><option value="2" ${Number(current.retryCount||0)===2?'selected':''}>2 Wiederholungen</option><option value="3" ${Number(current.retryCount||0)===3?'selected':''}>3 Wiederholungen</option></select><label class="check-row flow-check"><input type="checkbox" id="flow-continue-error" ${current.continueOnError?'checked':''}><span>Bei endgültigem Fehler mit nächster Aktion fortfahren</span></label><div class="field-help">Aktiviere das Fortfahren nur, wenn spätere Schritte auch ohne den fehlgeschlagenen Schritt sicher sind.</div></div><div class="inspector-empty" style="padding-top:22px"><div class="empty-icon">↯</div><strong>Flow Architect läuft lokal</strong><p>Beschreibe oben, was du erreichen willst. Flow erstellt einen regelbasierten Entwurf direkt auf diesem PC – ohne KI-Server.</p></div>`;
    $('#inspector-flow-name').addEventListener('input', (event) => { current.name = event.target.value.slice(0, 100); $('#flow-name').value = current.name; markDirty(); });
    $('#inspector-flow-description').addEventListener('input', (event) => { current.description = event.target.value.slice(0, 240); markDirty(); });
    $('#flow-retry-count').addEventListener('change', (event) => { current.retryCount = Number(event.target.value); markDirty(); });
    $('#flow-continue-error').addEventListener('change', (event) => { current.continueOnError = event.target.checked; markDirty(); });
    if (!current.trigger) current.trigger = { type: 'manual', intervalMinutes: 15, folderPath: '', pattern: '*', processName: '' };
    $('#flow-trigger-type').addEventListener('change', (event) => { current.trigger.type = event.target.value; markDirty(); renderInspector(); renderFlowCount(); });
    const triggerInput = (selector, key, parse = (v) => v) => { const el = $(selector); if (!el) return; el.addEventListener('input', (event) => { current.trigger[key] = parse(event.target.value); markDirty(); renderFlowCount(); }); };
    triggerInput('#flow-trigger-interval', 'intervalMinutes', (value) => Math.max(5, Math.min(1440, Number(value) || 15)));
    triggerInput('#flow-trigger-folder', 'folderPath'); triggerInput('#flow-trigger-pattern', 'pattern'); triggerInput('#flow-trigger-process', 'processName');
    $('#flow-trigger-folder-browse')?.addEventListener('click', async () => { try { const chosen = await window.lapsFlow.selectPath({ title: 'Zu überwachenden Ordner auswählen', foldersOnly: true }); if (chosen) { current.trigger.folderPath = chosen; markDirty(); renderInspector(); } } catch (err) { toast(`Ordnerauswahl fehlgeschlagen: ${err.message}`, 'error'); } });
    return;
  }
  const info = ACTIONS[step.type] || ACTIONS.wait; const c = step.config; let fields = '';
  switch (step.type) {
    case 'launch-app':
      fields += inputField('ANWENDUNGSPFAD', 'path', c.path, 'C:\\Program Files\\App\\app.exe', { help: 'Wähle eine EXE-Datei. Die gestartete App kann später über „App schließen“ adressiert werden.' });
      fields += browseButton('app', 'Anwendung auswählen …', 'path');
      fields += inputField('OPTIONAL: NACH X SEKUNDEN SCHLIESSEN', 'closeAfterSeconds', c.closeAfterSeconds || 0, '0 = nie automatisch schließen', { type: 'number', min: 0, max: 3600, help: '0 deaktiviert das automatische Schließen. Schließen erfolgt über das normale Fenster-Schließen.' });
      break;
    case 'close-app': fields += windowTargetFields(step); break;
    case 'window-control':
      fields += selectField('FENSTERAKTION', 'operation', c.operation || 'activate', [ { value: 'activate', label: 'In den Vordergrund holen' }, { value: 'minimize', label: 'Minimieren' }, { value: 'maximize', label: 'Maximieren' }, { value: 'restore', label: 'Wiederherstellen' } ]);
      fields += windowTargetFields(step, [ { value: 'last-launched', label: 'Zuletzt von diesem Flow gestartete App' }, { value: 'process', label: 'Prozessname' }, { value: 'title', label: 'Fenstertitel enthält' } ]);
      break;
    case 'switch-window':
      fields += field('AKTION', '<div class="field-help">Wechselt zum nächsten sichtbaren Fenster. Du kannst mehrere „Programm wechseln“-Aktionen hintereinander setzen.</div>', 'Windows-Fenster werden über die Windows-API gesteuert.');
      break;
    case 'close-app-after-delay':
      fields += inputField('VERZÖGERUNG (SEKUNDEN)', 'seconds', c.seconds ?? 30, '30', { type: 'number', min: 1, max: 3600, help: 'Der Flow läuft weiter; die zuletzt vom Flow gestartete App wird nach Ablauf zum normalen Schließen aufgefordert.' });
      fields += selectField('ZIEL', 'targetMode', c.targetMode || 'last-launched', [ { value: 'last-launched', label: 'Zuletzt vom Flow gestartete App' }, { value: 'process', label: 'Prozessname' }, { value: 'title', label: 'Fenstertitel enthält' } ]);
      fields += inputField('PROZESSNAME ODER FENSTERTITEL', 'target', c.target || '', 'Leer lassen, wenn zuletzt gestartete App', { help: 'Bei Prozessname/Fenstertitel muss hier das Ziel stehen. Ohne Eintrag wird die zuletzt gestartete App verwendet.' });
      fields += field('HINWEIS', '<div class="field-help">Das Programm erhält eine normale Schließen-Anforderung. Ungespeicherte Arbeiten können verhindern, dass es geschlossen wird.</div>');
      break;
    case 'open-mailbox':
      fields += selectField('POSTFACH-ANBIETER', 'provider', c.provider || 'gmail', [ { value: 'gmail', label: 'Gmail' }, { value: 'outlook', label: 'Outlook Web' }, { value: 'other', label: 'Anderes Webpostfach' }, { value: 'flow', label: 'Kontowahl aus Flow verwenden' } ]);
      fields += inputField('GMAIL-KONTOINDEX', 'accountIndex', c.accountIndex ?? 0, '0', { type: 'number', min: 0, max: 9, help: 'Gmail: 0 = erstes angemeldetes Konto, 1 = zweites usw. Bei Outlook wird das aktuell angemeldete Microsoft-Webkonto verwendet.' });
      fields += inputField('ALTERNATIVE POSTFACH-URL', 'url', c.url || '', 'https://webmail.example.com', { help: 'Nur für „Anderes Webpostfach“ erforderlich.' });
      fields += inputField('VERZÖGERUNG VOR DEM ÖFFNEN (SEK.)', 'delaySeconds', c.delaySeconds || 0, '0', { type: 'number', min: 0, max: 3600 });
      fields += inputField('OPTIONALER BROWSER-PFAD', 'browserPath', c.browserPath || '', 'Pfad zu chrome.exe / msedge.exe', { help: 'Leer lassen, um den Standardbrowser zu verwenden. Ein ausgewählter Browser wird mit neuem Fenster gestartet, sofern er das unterstützt.' });
      fields += browseButton('app', 'Browser-EXE auswählen …', 'browserPath');
      break;
    case 'compose-email':
      fields += selectField('MAIL-ANBIETER', 'provider', c.provider || 'gmail', [ { value: 'gmail', label: 'Gmail Web' }, { value: 'outlook', label: 'Outlook Web' }, { value: 'mailto', label: 'Standard-Mailprogramm (mailto)' }, { value: 'flow', label: 'Kontowahl aus Flow verwenden' } ]);
      fields += inputField('GMAIL-KONTOINDEX', 'accountIndex', c.accountIndex ?? 0, '0', { type: 'number', min: 0, max: 9, help: 'Wird bei Gmail verwendet; 0 = erstes Konto.' });
      fields += inputField('EMPFÄNGER', 'recipient', c.recipient || '', 'name@example.com');
      fields += inputField('BETREFF', 'subject', c.subject || '', 'Betreff der Nachricht');
      fields += inputField('NACHRICHT', 'body', c.body || '', 'Nachrichtentext …', { textarea: true, help: 'Öffnet nur einen Entwurf. LAPS Flow versendet E-Mails nicht selbst.' });
      break;
    case 'select-email-account':
      fields += selectField('ANBIETER', 'provider', c.provider || 'gmail', [ { value: 'gmail', label: 'Gmail' }, { value: 'outlook', label: 'Outlook' } ]);
      fields += inputField('KONTOINDEX', 'accountIndex', c.accountIndex ?? 0, '0', { type: 'number', min: 0, max: 9, help: 'Bei Gmail wählt der Index das Konto aus. Bei Outlook wird das aktuell angemeldete Microsoft-Webkonto verwendet.' });
      break;
    case 'close-mail-client': fields += windowTargetFields(step, [ { value: 'title', label: 'Fenstertitel enthält' }, { value: 'process', label: 'Prozessname' }, { value: 'last-launched', label: 'Zuletzt gestartete App' } ]); break;
    case 'open-folder': case 'open-path':
      fields += inputField('PFAD', 'path', c.path || '', 'C:\\Users\\...\\Documents', { help: step.type === 'open-folder' ? 'Wähle einen Ordner, der im Windows-Explorer geöffnet werden soll.' : 'Datei oder Ordner, der mit der Standardanwendung geöffnet werden soll.' });
      fields += browseButton(step.type === 'open-folder' ? 'folder' : 'path', step.type === 'open-folder' ? 'Ordner auswählen …' : 'Datei oder Ordner auswählen …', 'path');
      break;
    case 'file-operation':
      fields += selectField('DATEIAKTION', 'operation', c.operation || 'copy', [ { value: 'create', label: 'Neue Textdatei erstellen' }, { value: 'copy', label: 'Datei kopieren' }, { value: 'move', label: 'Datei verschieben' }, { value: 'rename', label: 'Datei umbenennen' } ]);
      if (c.operation === 'create') {
        fields += inputField('NEUER DATEIPFAD', 'sourcePath', c.sourcePath || '', 'C:\\Users\\...\\Neue-Datei.txt', { help: 'Die Datei wird neu erstellt. Vorhandene Dateien werden nicht überschrieben.' });
        fields += browseButton('savefile', 'Dateipfad festlegen …', 'sourcePath');
        fields += inputField('DATEIINHALT', 'content', c.content || '', 'Inhalt der Textdatei …', { textarea: true });
      } else {
        fields += inputField('QUELLDATEI', 'sourcePath', c.sourcePath || '', 'C:\\Users\\...\\Datei.txt', { help: 'Wähle die existierende Datei, die kopiert, verschoben oder umbenannt werden soll.' });
        fields += browseButton('file', 'Quelldatei auswählen …', 'sourcePath');
        fields += inputField('ZIEL-/NEUER DATEIPFAD', 'destinationPath', c.destinationPath || '', 'C:\\Users\\...\\Ziel.txt', { help: 'Vollständigen Pfad der Zieldatei angeben.' });
        fields += browseButton('savefile', 'Zielpfad festlegen …', 'destinationPath');
      }
      break;
    case 'search-files-by-type':
      fields += inputField('SUCHORDNER', 'folderPath', c.folderPath || '', 'C:\\Users\\...\\Downloads'); fields += browseButton('folder', 'Ordner auswählen …', 'folderPath');
      fields += inputField('DATEIENDUNGEN', 'extensions', c.extensions || '.pdf,.docx', '.pdf,.docx,.png', { help: 'Kommagetrennt, mit oder ohne Punkt.' });
      fields += checkField('Unterordner durchsuchen', 'recursive', c.recursive !== false);
      fields += checkField('Gefundene Pfade kopieren', 'copyResults', c.copyResults !== false, 'Die Treffer werden zusätzlich ins Protokoll geschrieben (maximal die ersten 8 Pfade).');
      break;
    case 'wait-download-complete':
      fields += inputField('DOWNLOAD-ORDNER', 'folderPath', c.folderPath || '', 'Leer = Windows-Downloads-Ordner', { help: 'Leerlassen, um den Downloads-Ordner des aktuellen Benutzers zu verwenden.' });
      fields += browseButton('folder', 'Download-Ordner auswählen …', 'folderPath');
      fields += inputField('DATEINAMENMUSTER', 'pattern', c.pattern || '*', '*.zip oder report.pdf', { help: '* = beliebige Zeichen, ? = ein Zeichen.' });
      fields += inputField('ZEITLIMIT (SEKUNDEN)', 'timeoutSeconds', c.timeoutSeconds || 180, '180', { type: 'number', min: 1, max: 3600, help: 'Die Datei muss existieren und ihre Größe muss über mehrere Prüfungen stabil sein.' });
      break;
    case 'sort-files-by-type':
      fields += inputField('QUELLORDNER', 'sourcePath', c.sourcePath || '', 'Ordner mit unsortierten Dateien'); fields += browseButton('folder', 'Quellordner auswählen …', 'sourcePath');
      fields += inputField('ZIELORDNER', 'destinationPath', c.destinationPath || '', 'Ordner für sortierte Unterordner'); fields += browseButton('folder', 'Zielordner auswählen …', 'destinationPath');
      fields += inputField('SORTIERREGELN', 'rules', c.rules || '', '.pdf=PDFs\n.png,.jpg=Images\n.zip=Archives', { textarea: true, rows: 6, help: 'Eine Regel pro Zeile: .pdf=PDFs oder .png,.jpg=Images. Nur Dateien direkt im Quellordner werden sortiert.' });
      fields += selectField('DATEINAMENSKONFLIKT', 'conflictPolicy', c.conflictPolicy || 'skip', [ { value: 'skip', label: 'Vorhandene Datei überspringen (sicher)' }, { value: 'rename', label: 'Neue Datei mit Nummer umbenennen' } ]);
      break;
    case 'open-url': case 'open-web-app':
      if (step.type === 'open-web-app') fields += inputField('NAME DER WEB-APP', 'appName', c.appName || '', 'z. B. Google Calendar');
      fields += inputField('WEBADRESSE', 'url', c.url || '', 'https://example.com', { help: 'Es werden nur http:// und https:// Adressen geöffnet.' });
      fields += inputField('VERZÖGERUNG VOR DEM ÖFFNEN (SEK.)', 'delaySeconds', c.delaySeconds || 0, '0', { type: 'number', min: 0, max: 3600 });
      fields += inputField('FENSTERTITEL-HINWEIS', 'titleHint', c.titleHint || '', 'z. B. Google Calendar', { help: 'Hilft später beim Schließen eines Fensters, wenn kein eigener Browser-Pfad gewählt wurde.' });
      fields += inputField('OPTIONALER BROWSER-PFAD', 'browserPath', c.browserPath || '', 'Pfad zu chrome.exe / msedge.exe');
      fields += browseButton('app', 'Browser-EXE auswählen …', 'browserPath');
      break;
    case 'open-websites':
      fields += inputField('WEBADRESSEN (EINE PRO ZEILE)', 'urls', c.urls || '', 'https://mail.google.com\nhttps://calendar.google.com', { textarea: true, rows: 6 });
      fields += inputField('PAUSE ZWISCHEN SEITEN (SEK.)', 'delaySeconds', c.delaySeconds ?? 2, '2', { type: 'number', min: 0, max: 60 });
      fields += inputField('OPTIONALER BROWSER-PFAD', 'browserPath', c.browserPath || '', 'Pfad zu chrome.exe / msedge.exe', { help: 'Leer lassen, um den Standardbrowser zu verwenden.' });
      fields += browseButton('app', 'Browser-EXE auswählen …', 'browserPath');
      break;
    case 'close-browser-window': fields += windowTargetFields(step, [ { value: 'last-browser', label: 'Zuletzt vom Flow geöffnetes Browserfenster' }, { value: 'title', label: 'Fenstertitel enthält' }, { value: 'process', label: 'Prozessname (schließt alle passenden Fenster)' } ]); break;
    case 'copy-text': fields += inputField('TEXTINHALT', 'text', c.text || '', 'Text, den du kopieren möchtest …', { textarea: true, help: 'Der Text wird direkt in die Windows-Zwischenablage kopiert.' }); break;
    case 'notification': fields += inputField('TITEL', 'title', c.title || 'LAPS Flow', 'LAPS Flow'); fields += inputField('NACHRICHT', 'message', c.message || '', 'Deine Nachricht …', { textarea: true }); break;
    case 'set-variable':
      fields += inputField('VARIABLENNAME', 'name', c.name || 'status', 'status', { help: 'Variablen stehen später über ${name} in Textfeldern zur Verfügung.' });
      fields += selectField('DATENTYP', 'valueType', c.valueType || 'text', [ { value: 'text', label: 'Text' }, { value: 'number', label: 'Zahl' }, { value: 'boolean', label: 'Wahr/Falsch' }, { value: 'timestamp', label: 'Aktueller Zeitstempel' } ]);
      fields += inputField('WERT', 'value', c.value ?? '', 'z. B. bereit oder 42', { help: 'Bei Zeitstempel wird der Wert zur Laufzeit durch das aktuelle Datum ersetzt.' });
      break;
    case 'logic-condition':
      fields += selectField('PRÜFTYP', 'conditionSource', c.conditionSource || 'variable', [ { value: 'variable', label: 'Variable vergleichen' }, { value: 'file-exists', label: 'Datei existiert' }, { value: 'process-running', label: 'Windows-Prozess läuft' } ]);
      if ((c.conditionSource || 'variable') === 'variable') {
        fields += inputField('VARIABLENNAME', 'variableName', c.variableName || 'status', 'status');
        fields += selectField('VERGLEICH', 'operator', c.operator || 'equals', [ { value: 'equals', label: 'ist gleich' }, { value: 'not-equals', label: 'ist ungleich' }, { value: 'contains', label: 'enthält' }, { value: 'not-contains', label: 'enthält nicht' }, { value: 'greater', label: 'größer als (Zahlen)' }, { value: 'less', label: 'kleiner als (Zahlen)' }, { value: 'truthy', label: 'ist wahr / nicht leer' }, { value: 'falsy', label: 'ist falsch / leer' } ]);
        if (!['truthy','falsy'].includes(c.operator)) fields += inputField('VERGLEICHSWERT', 'compareValue', c.compareValue ?? '', 'z. B. bereit oder 10');
      } else if (c.conditionSource === 'file-exists') {
        fields += inputField('DATEIPFAD', 'path', c.path || '', 'C:\Users\...\Datei.pdf'); fields += browseButton('file', 'Datei auswählen …', 'path');
      } else fields += inputField('PROZESSNAME', 'processName', c.processName || '', 'z. B. chrome');
      fields += inputField('BEI FALSE: NÄCHSTE SCHRITTE ÜBERSPRINGEN', 'skipSteps', c.skipSteps ?? 1, '1', { type: 'number', min: 0, max: 100, help: 'Überspringt so viele nachfolgende Schritte, wenn die Bedingung nicht erfüllt ist. Schleifenmarker nicht überspringen.' });
      break;
    case 'loop-start': fields += inputField('ANZAHL DER DURCHLÄUFE', 'count', c.count ?? 2, '2', { type: 'number', min: 0, max: 100, help: 'Alle Bausteine bis zum nächsten passenden „Schleife beenden“ werden wiederholt. Maximal 100 Durchläufe; insgesamt sind 1.000 Schritt-Auswertungen erlaubt.' }); fields += field('SCHLEIFENBLOCK', '<div class="field-help">Setze „Schleife beenden“ NACH die Aktionen, die wiederholt werden sollen. Verschachtelte Schleifen sind möglich.</div>'); break;
    case 'loop-end': fields += field('SCHLEIFENENDE', '<div class="field-help">Dieser Baustein muss innerhalb eines „Schleife starten“-Blocks stehen. Er wird automatisch mit dem passenden Anfang verbunden.</div>'); break;
    case 'run-subflow':
      fields += selectField('GESPEICHERTER UNTER-FLOW', 'workflowId', c.workflowId || '', [ { value: '', label: 'Unter-Flow auswählen …' }, ...workflows.filter((flow) => flow.id !== current.id).map((flow) => ({ value: flow.id, label: flow.name })) ], 'Der ausgewählte Flow wird mit dem aktuellen Laufkontext ausgeführt. Maximal 5 Ebenen tief; Selbstaufrufe sind blockiert.');
      break;
    case 'wait': fields += inputField('DAUER (MILLISEKUNDEN)', 'ms', c.ms ?? 1000, '1000', { type: 'number', min: 0, max: 600000, help: '1.000 ms entsprechen einer Sekunde; maximal 10 Minuten.' }); break;
  }
  box.innerHTML = `<div class="inspector-step-title"><span class="step-icon action-icon ${info.css}">${info.icon}</span><div><strong>${escapeHtml(info.title)}</strong><small>${escapeHtml(info.subtitle)}</small></div></div>${fields}<div class="field-group"><label class="field-label">SCHRITT-ID <small>Intern</small></label><input class="field-input" value="${escapeHtml(step.id)}" disabled></div><button class="danger-button" id="delete-selected">Aktion entfernen</button>`;
  // Rehydrate every multiline field from the source-of-truth model after each Properties render.
  // This makes switching between actions, hiding/reopening Properties, and locale changes safe.
  window.LAPSFlowFieldState.hydrateConfigTextareas(box, step.config);
  box.querySelectorAll('[data-config]').forEach((element) => {
    const eventName = (element.type === 'number' || element.type === 'checkbox' || element.tagName === 'SELECT') ? 'change' : 'input';
    element.addEventListener(eventName, () => {
      const key = element.dataset.config;
      if (element.dataset.boolean === 'true') step.config[key] = element.checked;
      else if (element.type === 'number') step.config[key] = Math.max(Number(element.min || -Infinity), Math.min(Number(element.max || Infinity), Number(element.value) || 0));
      else step.config[key] = element.value;
      if (element.type === 'number') element.value = step.config[key];
      markDirty(); renderCanvas();
      if (element.tagName === 'SELECT' && ((step.type === 'file-operation' && key === 'operation') || (step.type === 'logic-condition' && key === 'conditionSource') || step.type === 'run-subflow')) renderInspector();
    });
    // Blur/change commits are intentional redundancy for multiline fields: they protect against
    // UI focus changes even if another interaction causes the property pane to be rebuilt.
    if (element.tagName === 'TEXTAREA') {
      element.addEventListener('change', () => commitInspectorFields());
      element.addEventListener('blur', () => commitInspectorFields());
    }
  });
  box.querySelectorAll('[data-browse]').forEach((button) => button.addEventListener('click', async () => {
    try {
      const kind = button.dataset.browse;
      const chosen = kind === 'savefile'
        ? await window.lapsFlow.selectSavePath({ title: 'Ziel-Dateipfad auswählen', defaultPath: step.config[button.dataset.browseKey] || 'Neue-Datei.txt' })
        : await window.lapsFlow.selectPath({ title: kind === 'app' ? 'Anwendung oder Browser auswählen' : kind === 'folder' ? 'Ordner auswählen' : 'Datei oder Ordner auswählen', filesOnly: ['app', 'file'].includes(kind), exeOnly: kind === 'app', foldersOnly: kind === 'folder' });
      if (!chosen) return;
      step.config[button.dataset.browseKey] = chosen; markDirty(); renderCanvas(); renderInspector();
    } catch (err) { toast(`Pfadauswahl fehlgeschlagen: ${err.message}`, 'error'); }
  }));
  box.querySelectorAll('[data-load-windows]').forEach((button) => button.addEventListener('click', async () => {
    try {
      const windows = await window.lapsFlow.listWindows();
      if (!windows.length) { toast('Keine sichtbaren Fenster gefunden oder Windows-Fenstersteuerung nicht verfügbar.', 'error'); return; }
      const choices = windows.slice(0, 40).map((w, i) => `${i + 1}. ${w.title} [${w.processName}]`).join('\n');
      const answer = prompt(`Welches Fenster soll verwendet werden? Nummer eingeben:\n\n${choices}`);
      if (answer === null) return;
      const index = Number(answer) - 1;
      if (!Number.isInteger(index) || index < 0 || index >= Math.min(windows.length, 40)) { toast('Ungültige Fensternummer.', 'error'); return; }
      const chosen = windows[index]; step.config.targetMode = 'title'; step.config.target = chosen.title;
      markDirty(); renderCanvas(); renderInspector(); toast(`Fensterziel gesetzt: ${chosen.title}`);
    } catch (err) { toast(`Fensterliste fehlgeschlagen: ${err.message}`, 'error'); }
  }));
  $('#delete-selected').addEventListener('click', () => removeStep(step.id));
}
function addStep(type) {
  if (running || !ACTIONS[type]) return;
  commitInspectorFields();
  const step = { id: newId(), type, config: defaultConfig(type) };
  current.steps.push(step); selectedStepId = step.id; markDirty(); renderAll();
  toast(`${ACTIONS[type].title} hinzugefügt.`);
}
function moveStep(id, delta) {
  if (running) return; commitInspectorFields(); const index = current.steps.findIndex((step) => step.id === id); const target = index + delta;
  if (index < 0 || target < 0 || target >= current.steps.length) return;
  [current.steps[index], current.steps[target]] = [current.steps[target], current.steps[index]];
  selectedStepId = id; markDirty(); renderAll();
}
function removeStep(id) {
  if (running) return; commitInspectorFields(); const index = current.steps.findIndex((step) => step.id === id); if (index < 0) return;
  current.steps.splice(index, 1); selectedStepId = current.steps[Math.min(index, current.steps.length - 1)]?.id || null;
  markDirty(); renderAll(); toast('Aktion entfernt.');
}
async function saveCurrent(silent = false) {
  if (!current) return false;
  current.name = ($('#flow-name').value.trim() || (appLocale === 'en' ? 'Untitled flow' : 'Unbenannter Flow')).slice(0, 100);
  $('#flow-name').value = current.name;
  const revisionAtStart = editRevision;
  const snapshot = JSON.parse(JSON.stringify(current));
  updateSavedLabel('saving');
  try {
    // Serialize writes so a slower, older save cannot overwrite a newer edit.
    saveChain = saveChain.catch(() => {}).then(() => window.lapsFlow.saveWorkflow(snapshot));
    const saved = await saveChain;
    const index = workflows.findIndex((flow) => flow.id === saved.id);
    if (index >= 0) workflows[index] = saved; else workflows.push(saved);
    if (current?.id === saved.id) current.updatedAt = saved.updatedAt;
    renderWorkflowSelect();
    if (editRevision === revisionAtStart) {
      hasUnsavedChanges = false; updateSavedLabel('saved'); clearTimeout(autoSaveTimer);
    } else {
      hasUnsavedChanges = true; updateSavedLabel('dirty'); scheduleAutoSave();
    }
    if (!silent) toast(appLocale === 'en' ? 'Flow saved locally.' : 'Flow wurde lokal gespeichert.');
    return true;
  } catch (err) {
    hasUnsavedChanges = true; updateSavedLabel('failed');
    toast(`${appLocale === 'en' ? 'Save failed:' : 'Speichern fehlgeschlagen:'} ${err.message}`, 'error');
    return false;
  }
}
async function validateCurrentWorkflow(options = {}) {
  if (!current) return { ok: false, errors: [appLocale === 'en' ? 'No workflow selected.' : 'Kein Flow ausgewählt.'], warnings: [] };
  if (hasUnsavedChanges && !(await saveCurrent(true))) return { ok: false, errors: [appLocale === 'en' ? 'Could not save the current flow before validation.' : 'Der aktuelle Flow konnte vor der Prüfung nicht gespeichert werden.'], warnings: [] };
  let result;
  try { result = await window.lapsFlow.validateWorkflow(current); }
  catch (err) { result = { ok: false, errors: [err.message], warnings: [] }; }
  const panel = $('#validation-panel');
  if (panel) {
    const localize = (message) => {
      if (appLocale === 'en') return message;
      const map = [
        ['URL is required.', 'URL fehlt.'], ['Only HTTP and HTTPS URLs are allowed.', 'Nur HTTP- und HTTPS-URLs sind erlaubt.'], ['Enter a valid full URL.', 'Gib eine vollständige gültige URL ein.'], ['Add at least one URL.', 'Füge mindestens eine URL hinzu.'],
        ['A path or application must be selected.', 'Wähle einen Pfad oder eine Anwendung aus.'], ['Enter the full path for the new file.', 'Gib den vollständigen Pfad für die neue Datei ein.'], ['Source path is required.', 'Quellpfad fehlt.'], ['Destination path is required.', 'Zielpfad fehlt.'], ['Choose a folder to search.', 'Wähle einen Suchordner aus.'], ['Enter at least one file extension.', 'Gib mindestens eine Dateiendung ein.'], ['Choose a source folder.', 'Wähle einen Quellordner aus.'], ['Choose a destination folder.', 'Wähle einen Zielordner aus.'], ['Add at least one file-sorting rule.', 'Füge mindestens eine Sortierregel hinzu.'], ['A file path is required for this condition.', 'Für diese Bedingung wird ein Dateipfad benötigt.'], ['A process name is required for this condition.', 'Für diese Bedingung wird ein Prozessname benötigt.'], ['Choose a saved subflow.', 'Wähle einen gespeicherten Unter-Flow aus.'], ['“End loop” has no matching “Start loop”.', '„Schleife beenden“ hat keinen passenden „Schleife starten“-Baustein.'], ['“Start loop” has no matching “End loop”.', '„Schleife starten“ hat keinen passenden „Schleife beenden“-Baustein.'], ['this flow has no actions yet.', 'Dieser Flow enthält noch keine Aktionen.'], ['Automatic retries are disabled for this side-effecting action to help prevent duplicate actions.', 'Automatische Wiederholungen sind für diese Aktion mit externen Nebenwirkungen deaktiviert, um doppelte Aktionen zu vermeiden.'], ['make sure the watched folder exists and is accessible before enabling the file trigger.', 'Stelle sicher, dass der überwachte Ordner existiert und zugänglich ist, bevor du den Dateitrigger aktivierst.'], ['process-start trigger needs a process name.', 'Der Programmstart-Trigger benötigt einen Prozessnamen.'], ['subflows exceed the maximum nesting depth of five.', 'Unter-Flows überschreiten die maximale Verschachtelungstiefe von fünf.'], ['step ID is missing or duplicated.', 'Schritt-ID fehlt oder ist doppelt vorhanden.'], ['A variable name is required for this condition.', 'Für diese Bedingung ist ein Variablenname erforderlich.'], ['Enter a valid variable name (letters, numbers, dots, underscores and hyphens; it cannot start with a number).', 'Gib einen gültigen Variablennamen ein (Buchstaben, Zahlen, Punkte, Unterstriche und Bindestriche; er darf nicht mit einer Zahl beginnen).'], ['circular subflow reference detected', 'zyklischer Unter-Flow-Verweis erkannt'], ['referenced subflow', 'referenzierter Unter-Flow'], ['was not found.', 'wurde nicht gefunden.'], ['Enter a valid full URL.', 'Gib eine vollständige gültige URL ein.'], ['The false-branch skip crosses a loop marker at step', 'Der Sprung im „false“-Zweig überspringt eine Schleifenmarkierung in Schritt']
      ];
      let text = message;
      for (const [en, de] of map) text = text.replaceAll(en, de);
      return text;
    };
    const errors = (result.errors || []).map(localize);
    const warnings = (result.warnings || []).map(localize);
    panel.hidden = false;
    panel.classList.toggle('has-errors', errors.length > 0);
    panel.innerHTML = `<div class="validation-head"><strong>${errors.length ? (appLocale === 'en' ? 'Validation found problems' : 'Prüfung hat Probleme gefunden') : (appLocale === 'en' ? 'Flow check complete' : 'Flow-Prüfung abgeschlossen')}</strong><span class="validation-count">${errors.length} ${appLocale === 'en' ? 'errors' : 'Fehler'} · ${warnings.length} ${appLocale === 'en' ? 'warnings' : 'Warnungen'}</span><button class="text-button" id="validation-hide">${appLocale === 'en' ? 'Hide' : 'Ausblenden'}</button></div>${errors.length ? `<div class="validation-group"><b>${appLocale === 'en' ? 'Errors to fix' : 'Zu behebende Fehler'}</b><ul>${errors.map((item) => `<li class="validation-error">${escapeHtml(item)}</li>`).join('')}</ul></div>` : `<p class="validation-ok">${appLocale === 'en' ? 'No blocking errors found.' : 'Keine blockierenden Fehler gefunden.'}</p>`}${warnings.length ? `<div class="validation-group"><b>${appLocale === 'en' ? 'Warnings' : 'Warnungen'}</b><ul>${warnings.map((item) => `<li class="validation-warning">${escapeHtml(item)}</li>`).join('')}</ul></div>` : ''}`;
    $('#validation-hide')?.addEventListener('click', () => { panel.hidden = true; });
    if (options.scroll !== false) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  return result;
}
async function maybeSaveBeforeSwitch() { if (!hasUnsavedChanges) return true; return saveCurrent(true); }


function updateThemeButton() {
  const button = $('#theme-btn'); if (!button) return;
  button.textContent = currentTheme === 'dark' ? '☼' : '☾';
  const title = currentTheme === 'dark' ? (appLocale === 'en' ? 'Switch to light theme' : 'Zum hellen Design wechseln') : (appLocale === 'en' ? 'Switch to dark theme' : 'Zum dunklen Design wechseln');
  button.title = title; button.setAttribute('aria-label', title); button.setAttribute('aria-pressed', String(currentTheme === 'dark'));
}
function setTheme(theme) {
  currentTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = currentTheme;
  try { localStorage.setItem('laps-flow-theme', currentTheme); } catch (_) {}
  updateThemeButton();
}
function initTheme() {
  let saved = 'dark';
  try { saved = localStorage.getItem('laps-flow-theme') || 'dark'; } catch (_) {}
  setTheme(saved);
}

const FLOW_TEMPLATES = {
  school: { name: 'School & Study Flow', description: 'Öffnet Lernplattform, Dokumente und Kalender für eine Lerneinheit.', steps: [
    { type: 'open-websites', config: { urls: 'https://classroom.google.com\nhttps://drive.google.com\nhttps://calendar.google.com', delaySeconds: 2, browserPath: '' } },
    { type: 'notification', config: { title: 'LAPS Flow · Study Mode', message: 'Lernumgebung ist bereit. Viel Erfolg!' } }
  ] },
  office: { name: 'Office Worker Flow', description: 'Öffnet E-Mail, Aufgaben und Dateien für den Arbeitsstart.', steps: [
    { type: 'open-websites', config: { urls: 'https://outlook.office.com/mail/\nhttps://to-do.office.com/tasks/\nhttps://onedrive.live.com/', delaySeconds: 2, browserPath: '' } },
    { type: 'notification', config: { title: 'LAPS Flow · Office Mode', message: 'Deine Arbeitsumgebung ist bereit.' } }
  ] },
  developer: { name: 'Developer Flow', description: 'Öffnet zentrale Entwicklungsressourcen und zeigt einen Start-Hinweis.', steps: [
    { type: 'open-websites', config: { urls: 'https://github.com/\nhttps://developer.mozilla.org/\nhttps://stackoverflow.com/', delaySeconds: 2, browserPath: '' } },
    { type: 'notification', config: { title: 'LAPS Flow · Dev Mode', message: 'Entwicklungsressourcen geöffnet. Starte dein Projekt oder deine Tests.' } }
  ] }
};
const MARKETPLACE_TEMPLATES = {
  study: FLOW_TEMPLATES.school,
  office: FLOW_TEMPLATES.office,
  developer: FLOW_TEMPLATES.developer,
  'download-notifier': { name: 'Download-Wächter', description: 'Startet automatisch, wenn eine Datei im Downloads-Ordner vollständig geladen wurde.', trigger: { type: 'download-complete', intervalMinutes: 15, folderPath: '', pattern: '*', processName: '' }, steps: [
    { type: 'notification', config: { title: 'LAPS Flow · Download fertig', message: 'Download abgeschlossen: ${trigger.fileName}' } }
  ] },
  'pdf-watcher': { name: 'Neue PDFs melden', description: 'Beobachtet lokal den Downloads-Ordner und meldet neue PDF-Dateien.', trigger: { type: 'file-created', intervalMinutes: 15, folderPath: '', pattern: '*.pdf', processName: '' }, steps: [
    { type: 'notification', config: { title: 'Neue PDF entdeckt', message: '${trigger.fileName} wurde erstellt.' } }
  ] },
  'starter-variables': { name: 'Smart-Flow-Demo', description: 'Beispiel für Variablen, Bedingungen und wiederverwendbare Schritte.', steps: [
    { type: 'set-variable', config: { name: 'status', value: 'bereit', valueType: 'text' } },
    { type: 'logic-condition', config: { conditionSource: 'variable', variableName: 'status', operator: 'equals', compareValue: 'bereit', skipSteps: 1 } },
    { type: 'notification', config: { title: 'Smart Flow Engine', message: 'Die Bedingung war erfüllt – Variablen können in Texten als ${status} verwendet werden.' } }
  ] }
};
function workflowFromTemplate(template) {
  let name = template.name;
  let description = template.description;
  if (appLocale === 'en') {
    name = translatePhrase(name);
    description = translatePhrase(description);
  } else {
    const germanNames = { 'School & Study Flow': 'Schule & Lernen', 'Office Worker Flow': 'Büro-Workflow', 'Developer Flow': 'Entwickler-Workflow' };
    name = germanNames[name] || name;
  }
  const steps = template.steps.map((step) => {
    const config = { ...defaultConfig(step.type), ...step.config };
    if (appLocale === 'en') {
      for (const key of ['title', 'message', 'value', 'compareValue']) {
        if (typeof config[key] === 'string') config[key] = translatePhrase(config[key]);
      }
    }
    return { id: newId(), type: step.type, config };
  });
  return { id: newId('flow'), name, description, retryCount: 1, continueOnError: false, trigger: { type: 'manual', intervalMinutes: 15, folderPath: '', pattern: '*', processName: '', ...(template.trigger || {}) }, steps, updatedAt: new Date().toISOString() };
}
async function applyTemplate(key) {
  if (running || !FLOW_TEMPLATES[key]) return;
  if (!(await maybeSaveBeforeSwitch())) return;
  const flow = workflowFromTemplate(FLOW_TEMPLATES[key]);
  try { const saved = await window.lapsFlow.saveWorkflow(flow); workflows.push(saved); setCurrentWorkflow(saved); toast(`${saved.name} wurde als eigener Flow erstellt.`); }
  catch (err) { toast(`Vorlage konnte nicht erstellt werden: ${err.message}`, 'error'); }
}
function architectBuild(promptText) {
  const text = String(promptText || '').toLocaleLowerCase('de-DE');
  const steps = [];
  const add = (type, config = {}) => steps.push({ id: newId(), type, config: { ...defaultConfig(type), ...config } });
  if (/schule|study|lernen|studium|unterricht|hausaufgabe/.test(text)) return FLOW_TEMPLATES.school;
  if (/büro|office|arbeit|meeting|aufgaben/.test(text)) return FLOW_TEMPLATES.office;
  if (/entwickl|developer|coding|programmier|code|github|debug|build|test/.test(text)) return FLOW_TEMPLATES.developer;
  if (/gmail|inbox|mailbox|postfach|e-?mail|outlook/.test(text)) add('open-mailbox', { provider: /outlook/.test(text) ? 'outlook' : 'gmail' });
  if (/kalender|calendar/.test(text)) add('open-url', { url: 'https://calendar.google.com', titleHint: 'Google Calendar' });
  if (/drive|dateien|dokumente|ordner/.test(text)) add('open-url', { url: 'https://drive.google.com', titleHint: 'Google Drive' });
  if (/github|repo/.test(text)) add('open-url', { url: 'https://github.com', titleHint: 'GitHub' });
  if (/browser|website|webseite|seiten|links/.test(text)) add('open-websites', { urls: 'https://example.com\nhttps://developer.mozilla.org', delaySeconds: 2 });
  if (/benachrichtig|notification|meldung|hinweis/.test(text)) add('notification', { title: 'LAPS Flow', message: appLocale === 'en' ? 'Your local workflow has finished.' : 'Dein lokaler Flow wurde ausgeführt.' });
  if (/warte|pause|sekunden/.test(text)) add('wait', { ms: 3000 });
  if (!steps.length) return null;
  return { name: appLocale === 'en' ? 'Flow Architect Draft' : 'Flow Architect Entwurf', description: appLocale === 'en' ? `Local draft based on your request: ${String(promptText).trim().slice(0, 180)}` : `Lokal aus deinem Auftrag abgeleiteter Entwurf: ${String(promptText).trim().slice(0, 180)}`, steps };
}
async function generateArchitectDraft() {
  const prompt = $('#architect-prompt').value.trim();
  if (!prompt) { toast('Beschreibe zuerst, was dein Flow erledigen soll.', 'error'); return; }
  const draft = architectBuild(prompt);
  if (!draft) { toast('Dafür gibt es noch keine lokale Regel. Versuche Schule, Office, E-Mail, Kalender, Dateien, Website oder Developer.', 'error'); return; }
  if (!(await maybeSaveBeforeSwitch())) return;
  const flow = workflowFromTemplate(draft);
  try { const saved = await window.lapsFlow.saveWorkflow(flow); workflows.push(saved); setCurrentWorkflow(saved); $('#architect-prompt').value = ''; toast('Lokaler Entwurf erstellt. Prüfe die Schritte vor der Ausführung.'); }
  catch (err) { toast(`Entwurf konnte nicht gespeichert werden: ${err.message}`, 'error'); }
}

let selectedHistoryId = null;
async function refreshHistoryList() {
  const container = $('#history-list');
  if (!container || !window.lapsFlow?.listHistory) return;
  try {
    const items = await window.lapsFlow.listHistory();
    if (!items.length) { container.innerHTML = '<div class="log-empty">Noch keine gespeicherten Ausführungen.</div>'; $('#history-detail').innerHTML = '<div class="inspector-empty"><div class="empty-icon">⟲</div><strong>Ausführung auswählen</strong><p>Jeder Lauf wird hier mit Einzelschritten, Status und Fehlern gespeichert.</p></div>'; return; }
    container.innerHTML = items.map((item) => `<button class="history-item ${item.id === selectedHistoryId ? 'selected' : ''}" data-history-id="${escapeHtml(item.id)}"><span class="history-status ${item.status === 'success' ? 'good' : ['error', 'interrupted', 'cancelled'].includes(item.status) ? 'bad' : ''}">${item.status === 'success' ? '✓' : ['error', 'interrupted', 'cancelled'].includes(item.status) ? '!' : '◷'}</span><span class="history-item-main"><strong>${escapeHtml(item.workflowName || 'Unbenannter Flow')}</strong><small>${escapeHtml(new Date(item.startedAt).toLocaleString(appLocale === 'en' ? 'en-US' : 'de-DE'))}</small><small>${item.stepCount} protokollierte Schritte · ${escapeHtml(item.triggered ? 'Automatisch' : 'Manuell')}</small></span><span class="history-status-text">${item.status === 'success' ? (appLocale === 'en' ? 'Success' : 'Erfolgreich') : item.status === 'error' ? (appLocale === 'en' ? 'Failed' : 'Fehler') : item.status === 'interrupted' ? (appLocale === 'en' ? 'Interrupted' : 'Unterbrochen') : item.status === 'cancelled' ? (appLocale === 'en' ? 'Cancelled' : 'Abgebrochen') : (appLocale === 'en' ? 'Running' : 'Läuft')}</span></button>`).join('');
    container.querySelectorAll('[data-history-id]').forEach((button) => button.addEventListener('click', () => inspectHistory(button.dataset.historyId)));
    if (selectedHistoryId && items.some((item) => item.id === selectedHistoryId)) await inspectHistory(selectedHistoryId, false);
    else await inspectHistory(items[0].id, false);
  } catch (err) { container.innerHTML = `<div class="log-empty">Historie konnte nicht geladen werden: ${escapeHtml(err.message)}</div>`; }
}
async function inspectHistory(id, updateList = true) {
  selectedHistoryId = id;
  try {
    const record = await window.lapsFlow.getHistoryRecord(id);
    const detail = $('#history-detail');
    const statusLabel = record.status === 'success' ? (appLocale === 'en' ? 'Success' : 'Erfolgreich') : record.status === 'error' ? (appLocale === 'en' ? 'Failed' : 'Fehler') : record.status === 'interrupted' ? (appLocale === 'en' ? 'Interrupted' : 'Unterbrochen') : record.status === 'cancelled' ? (appLocale === 'en' ? 'Cancelled' : 'Abgebrochen') : (appLocale === 'en' ? 'Running' : 'Läuft');
    const rows = (record.steps || []).map((step) => {
      const canResume = step.workflowId === record.workflowId && Number.isInteger(step.index) && record.workflowSnapshot?.steps?.[step.index]?.id === step.stepId;
      const configText = escapeHtml(JSON.stringify(step.input?.config || {}, null, 2));
      const outputText = escapeHtml(String(step.error || step.output || 'Keine Ausgabe gespeichert.'));
      return `<details class="history-step"><summary><span class="history-step-status ${['success'].includes(step.status) ? 'good' : ['error','error-continued'].includes(step.status) ? 'bad' : ''}">${step.status === 'success' ? '✓' : ['error','error-continued'].includes(step.status) ? '!' : '◷'}</span><strong>${escapeHtml(step.workflowName || record.workflowName)} · Schritt ${Number(step.index) + 1}: ${escapeHtml(step.type)}</strong><small>${escapeHtml(step.status)}${step.attempts > 1 ? ` · ${step.attempts} Versuche` : ''}</small></summary><div class="history-step-body"><div><b>Eingabe / Konfiguration</b><pre>${configText}</pre></div><div><b>Ausgabe / Fehler</b><pre>${outputText}</pre></div>${canResume ? `<button class="btn btn-ghost" data-resume-index="${step.index}">▶ Ab diesem Schritt fortsetzen</button>` : ''}</div></details>`;
    }).join('');
    detail.innerHTML = `<div class="history-detail-head"><div><span class="eyebrow">${escapeHtml(statusLabel.toUpperCase())}</span><h3>${escapeHtml(record.workflowName || 'Unbenannter Flow')}</h3><p>${escapeHtml(new Date(record.startedAt).toLocaleString(appLocale === 'en' ? 'en-US' : 'de-DE'))} · ${Math.max(0, Math.round((record.durationMs || 0) / 1000))} Sek.</p></div><span class="history-status ${record.status === 'success' ? 'good' : ['error', 'interrupted', 'cancelled'].includes(record.status) ? 'bad' : ''}">${record.status === 'success' ? '✓' : ['error', 'interrupted', 'cancelled'].includes(record.status) ? '!' : '◷'}</span></div>${record.error ? `<div class="history-error">${escapeHtml(record.error)}</div>` : ''}<div class="history-step-list">${rows || '<div class="log-empty">Für diese Ausführung sind noch keine Schritte gespeichert.</div>'}</div><div class="field-help history-retention">Die Historie bleibt lokal in deinem Benutzerprofil. Eingaben können Datei- und Nachrichtentexte enthalten. Fortsetzen führt die gewählten Schritte erneut aus und stellt keine externen Programme/Dateien automatisch auf den alten Zustand zurück.</div>`;
    detail.querySelectorAll('[data-resume-index]').forEach((button) => button.addEventListener('click', async () => {
      if (running) { toast('Beende zuerst den aktuellen Flow.', 'error'); return; }
      const index = Number(button.dataset.resumeIndex);
      if (!confirm('Ab diesem Schritt fortsetzen? Bereits ausgeführte Aktionen vor diesem Schritt werden nicht wiederholt. Der Schritt und alle folgenden können erneut ausgeführt werden; Dateioperationen vorher prüfen.')) return;
      try { const result = await window.lapsFlow.rerunFromHistoryStep({ runId: record.id, index }); if (!result?.ok) toast(`Fortsetzen fehlgeschlagen: ${result?.error || 'Unbekannter Fehler'}`, 'error'); else toast('Fortsetzung gestartet.'); }
      catch (err) { toast(`Fortsetzen fehlgeschlagen: ${err.message}`, 'error'); }
    }));
    if (updateList) await refreshHistoryList();
    else $$('.history-item').forEach((item) => item.classList.toggle('selected', item.dataset.historyId === id));
  } catch (err) { $('#history-detail').innerHTML = `<div class="log-empty">Ausführung konnte nicht geladen werden: ${escapeHtml(err.message)}</div>`; }
}
function renderMarketplace() {
  const container = $('#market-template-list'); if (!container) return;
  const descriptions = {
    study: 'Lernplattform, Drive und Kalender öffnen.', office: 'Outlook, Aufgaben und OneDrive öffnen.', developer: 'GitHub, MDN und Stack Overflow öffnen.',
    'download-notifier': 'Lokaler Trigger wartet auf vollständige Downloads.', 'pdf-watcher': 'Startet bei neuer PDF-Datei im Downloads-Ordner.', 'starter-variables': 'Zeigt Variablen und If/Then-Logik in einem Beispiel.'
  };
  container.innerHTML = Object.entries(MARKETPLACE_TEMPLATES).map(([key, template]) => `<article class="market-card"><div class="market-card-top"><span class="market-icon">${key.includes('watcher') || key.includes('notifier') ? '⇩' : key === 'starter-variables' ? '◇' : '▧'}</span><span class="market-tag">${template.trigger && template.trigger.type !== 'manual' ? 'AUTOTRIGGER' : 'VORLAGE'}</span></div><h3>${escapeHtml(template.name)}</h3><p>${escapeHtml(descriptions[key] || template.description)}</p><div class="market-card-footer"><small>${template.steps.length} Schritte</small><button class="btn btn-ghost" data-market-template="${escapeHtml(key)}">Vorlage hinzufügen ↗</button></div></article>`).join('');
  container.querySelectorAll('[data-market-template]').forEach((button) => button.addEventListener('click', () => createMarketplaceTemplate(button.dataset.marketTemplate)));
}
async function createMarketplaceTemplate(key) {
  const template = MARKETPLACE_TEMPLATES[key];
  if (!template || running) return;
  if (!(await maybeSaveBeforeSwitch())) return;
  const flow = workflowFromTemplate(template);
  try {
    const saved = await window.lapsFlow.saveWorkflow(flow);
    workflows.push(saved); setCurrentWorkflow(saved); toast(`„${saved.name}“ wurde in deinen Workspace kopiert.`);
    $('#workflow-select').value = saved.id;
  } catch (err) { toast(`Vorlage konnte nicht hinzugefügt werden: ${err.message}`, 'error'); }
}
function navigateToPanel(panelId, activeId) {
  const element = $(panelId); if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  $$('.nav-item').forEach((button) => button.classList.toggle('active', button.id === activeId || (button.dataset.view === 'flows' && activeId === 'nav-flows')));
}

async function loadInitial() {
  try {
    workflows = await window.lapsFlow.listWorkflows(); if (!workflows.length) throw new Error('Es wurde kein Workflow gefunden.');
    setCurrentWorkflow(workflows[0]); const meta = await window.lapsFlow.getMeta(); $('#version-label').textContent = `v${meta.version}`; await refreshHistoryList();
  } catch (err) { toast(`LAPS Flow konnte nicht initialisiert werden: ${err.message}`, 'error'); }
}
function addLog(payload) {
  const time = new Date(payload.at || Date.now()).toLocaleTimeString(appLocale === 'en' ? 'en-US' : 'de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); const kind = payload.kind || 'info';
  const css = kind === 'error' ? 'error' : (kind === 'warning' ? 'warning' : (['finish', 'step-done'].includes(kind) ? 'success' : ''));
  const message = appLocale === 'en' ? translatePhrase(payload.message) : payload.message;
  logs.unshift({ message: payload.message, sourceMessage: payload.message, time, css }); logs = logs.slice(0, 80); renderLogs(); if (kind === 'error') toast(message, 'error');
  if (kind === 'start') { running = true; debugModeActive = Boolean(payload.debug); $('#run-btn').innerHTML = `<span class="play-icon">■</span> ${appLocale === 'en' ? 'Cancel' : 'Abbrechen'}`; $('#run-btn').disabled = false; $('#debug-btn').disabled = true; if (debugModeActive) { $('#debug-controls').classList.remove('hidden'); $('#debug-next-btn').disabled = true; } renderCanvas(); }
  if (kind === 'debug-pause') { debugPaused = true; $('#debug-controls').classList.remove('hidden'); $('#debug-next-btn').disabled = false; $('#debug-step-info').textContent = appLocale === 'en' ? `Paused before step ${Number(payload.stepIndex) + 1} of ${payload.stepCount} (${payload.stepType}). Inspect the current state, then continue.` : `Pause vor Schritt ${Number(payload.stepIndex) + 1} von ${payload.stepCount} (${payload.stepType}). Prüfe den aktuellen Stand und fahre dann fort.`; const variables = $('#debug-variables'); if (variables) { const snapshot = payload.variables && typeof payload.variables === 'object' ? payload.variables : {}; const entries = Object.entries(snapshot); variables.hidden = entries.length === 0; variables.textContent = entries.length ? `${appLocale === 'en' ? 'Variables at pause:' : 'Variablen an der Pause:'}\n${JSON.stringify(snapshot, null, 2)}` : ''; } }
  if (kind === 'finish') { running = false; debugModeActive = false; debugPaused = false; debugModePending = false; $('#debug-controls').classList.add('hidden'); $('#debug-variables').hidden = true; $('#debug-variables').textContent = '';  $('#debug-btn').disabled = false; $('#run-btn').innerHTML = `<span class="play-icon">▶</span> ${appLocale === 'en' ? 'Run Flow' : 'Flow ausführen'}`; $('#run-btn').disabled = false; renderCanvas(); renderInspector(); refreshHistoryList(); }
}
function renderLogs() {
  const list = $('#log-list'); if (!logs.length) { list.innerHTML = '<div class="log-empty">Noch keine Ausführung. Starte einen Flow, um die Ergebnisse hier zu sehen.</div>'; return; }
  list.innerHTML = logs.map((log) => { const source = log.sourceMessage ?? log.message; const text = appLocale === 'en' ? translatePhrase(source) : source; return `<div class="log-entry ${log.css}"><span class="log-dot"></span><span>${escapeHtml(text)}</span><span class="log-time">${log.time}</span></div>`; }).join('');
}
async function createNewWorkflow() {
  if (running) return; if (!(await saveCurrent(true))) return;
  const workflow = { id: newId('flow'), name: `${appLocale === 'en' ? 'New Flow' : 'Neuer Flow'} ${workflows.length + 1}`, description: appLocale === 'en' ? 'A new workflow. Add actions and save automatically.' : 'Ein neuer Flow. Füge Aktionen hinzu; Änderungen werden automatisch gespeichert.', steps: [], updatedAt: new Date().toISOString() };
  try { const saved = await window.lapsFlow.saveWorkflow(workflow); workflows.push(saved); setCurrentWorkflow(saved); toast('Neuer Flow erstellt.'); }
  catch (err) { toast(`Flow konnte nicht erstellt werden: ${err.message}`, 'error'); }
}
async function startRun() {
  if (running) { await window.lapsFlow.cancelWorkflow(); toast(appLocale === 'en' ? 'Cancellation requested.' : 'Abbruch wurde angefordert.'); return; }
  if (!(await saveCurrent(true))) return;
  if (!current.steps.length) { toast(appLocale === 'en' ? 'Add at least one action first.' : 'Füge zuerst mindestens eine Aktion hinzu.', 'error'); return; }
  const validation = await validateCurrentWorkflow({ scroll: true });
  if (!validation.ok) { toast(appLocale === 'en' ? 'Fix validation errors before running this flow.' : 'Behebe die Validierungsfehler, bevor du den Flow startest.', 'error'); return; }
  debugModePending = false;
  $('#confirm-text').textContent = appLocale === 'en' ? `“${current.name}” contains ${current.steps.length} step(s). Actions will run on your PC. Check file operations and window targets before starting.` : `„${current.name}“ enthält ${current.steps.length} Aktion(en). Die Aktionen werden auf deinem PC ausgeführt. Prüfe Dateioperationen und Fensterziele vor dem Start.`;
  $('#confirm-modal').classList.remove('hidden');
}
async function startDebugRun() {
  if (running) return;
  if (!(await saveCurrent(true))) return;
  if (!current.steps.length) { toast(appLocale === 'en' ? 'Add at least one action first.' : 'Füge zuerst mindestens eine Aktion hinzu.', 'error'); return; }
  const validation = await validateCurrentWorkflow({ scroll: true });
  if (!validation.ok) { toast(appLocale === 'en' ? 'Fix validation errors before debugging this flow.' : 'Behebe die Validierungsfehler, bevor du diesen Flow debugst.', 'error'); return; }
  debugModePending = true;
  $('#confirm-text').textContent = appLocale === 'en' ? `Debug mode will pause before each step after the first. You can inspect the workflow and continue one step at a time. “${current.name}” will run real actions on this PC.` : `Der Debug-Modus pausiert nach dem ersten Schritt vor jedem weiteren Schritt. Du kannst den Ablauf prüfen und einzeln fortsetzen. „${current.name}“ führt echte Aktionen auf diesem PC aus.`;
  $('#confirm-modal').classList.remove('hidden');
}
async function actuallyRun() {
  const debug = debugModePending; debugModePending = false;
  $('#confirm-modal').classList.add('hidden'); running = true; $('#run-btn').innerHTML = `<span class="play-icon">■</span> ${appLocale === 'en' ? 'Cancel' : 'Abbrechen'}`; $('#run-btn').disabled = false; $('#debug-btn').disabled = true; renderCanvas();
  if (debug) { debugModeActive = true; $('#debug-controls').classList.remove('hidden'); $('#debug-next-btn').disabled = true; $('#debug-step-info').textContent = appLocale === 'en' ? 'Running the first step…' : 'Erster Schritt läuft…'; }
  try {
    const result = await window.lapsFlow.runWorkflow(current, { debug });
    if (!result.ok && result.error && !result.cancelled) toast(`${appLocale === 'en' ? 'Run failed:' : 'Ausführung fehlgeschlagen:'} ${result.error}`, 'error');
  } catch (err) {
    running = false; debugModeActive = false; debugPaused = false; $('#debug-controls').classList.add('hidden'); $('#debug-btn').disabled = false; $('#run-btn').innerHTML = `<span class="play-icon">▶</span> ${appLocale === 'en' ? 'Run Flow' : 'Flow ausführen'}`; renderCanvas(); toast(`${appLocale === 'en' ? 'Run failed:' : 'Ausführung fehlgeschlagen:'} ${err.message}`, 'error');
  }
}

$('#properties-close-btn').addEventListener('click', () => { commitInspectorFields(); setInspectorVisibility(false); });
$('#properties-open-btn').addEventListener('click', () => { setInspectorVisibility(true); renderInspector(); });
$('#flow-settings-btn').addEventListener('click', () => { setInspectorVisibility(true); selectedStepId = null; renderInspector(); renderCanvas(); });
$('[data-view="flows"]').addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); $$('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === 'flows')); });
$('#template-school').addEventListener('click', () => applyTemplate('school'));
$('#template-office').addEventListener('click', () => applyTemplate('office'));
$('#template-developer').addEventListener('click', () => applyTemplate('developer'));
$('#architect-build').addEventListener('click', generateArchitectDraft);
$('#architect-prompt').addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') generateArchitectDraft(); });

$('#action-search').addEventListener('input', (event) => {
  const query = event.target.value.toLocaleLowerCase('de-DE');
  $$('.action-tile').forEach((button) => { button.style.display = button.textContent.toLocaleLowerCase('de-DE').includes(query) ? 'flex' : 'none'; });
  $$('.action-group-title').forEach((heading) => { const groupContainer = heading.parentElement; let next = heading.nextElementSibling; let visible = false; while (next && !next.classList.contains('action-group-title')) { if (next.classList.contains('action-tile') && next.style.display !== 'none') visible = true; next = next.nextElementSibling; } heading.style.display = visible ? 'block' : 'none'; });
});
$('#flow-name').addEventListener('input', (event) => { if (!current) return; current.name = event.target.value.slice(0, 100); markDirty(); });
$('#save-btn').addEventListener('click', () => saveCurrent()); $('#new-flow-btn').addEventListener('click', createNewWorkflow);
$('#workflow-select').addEventListener('change', async (event) => { const requestedId = event.target.value; if (!requestedId || requestedId === current?.id) return; if (!(await maybeSaveBeforeSwitch())) { renderWorkflowSelect(); return; } const found = workflows.find((flow) => flow.id === requestedId); if (found) setCurrentWorkflow(found); });
document.addEventListener('keydown', async (event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); await saveCurrent(); } if (event.key === 'Escape') { $('#confirm-modal').classList.add('hidden'); closeAboutModal(); } });
$('#run-btn').addEventListener('click', startRun); $('#debug-btn').addEventListener('click', startDebugRun); $('#confirm-run-btn').addEventListener('click', actuallyRun); $('#cancel-run-btn').addEventListener('click', () => { debugModePending = false; $('#confirm-modal').classList.add('hidden'); });
$('#validate-btn').addEventListener('click', () => validateCurrentWorkflow({ scroll: true }));
$('#theme-btn').addEventListener('click', () => setTheme(currentTheme === 'dark' ? 'light' : 'dark'));
$('#debug-next-btn').addEventListener('click', async () => { if (!debugPaused) return; debugPaused = false; $('#debug-next-btn').disabled = true; $('#debug-step-info').textContent = appLocale === 'en' ? 'Continuing to the next step…' : 'Fahre mit dem nächsten Schritt fort…'; try { await window.lapsFlow.continueDebug(); } catch (err) { toast(err.message, 'error'); } });
$('#debug-cancel-btn').addEventListener('click', async () => { await window.lapsFlow.cancelWorkflow(); debugPaused = false; $('#debug-next-btn').disabled = true; });
$('#backup-btn').addEventListener('click', async () => { try { if (hasUnsavedChanges && !(await saveCurrent(true))) return; const result = await window.lapsFlow.createBackup(); toast(appLocale === 'en' ? `Backup created: ${result.fileName} (${result.count} workflows).` : `Backup erstellt: ${result.fileName} (${result.count} Flows).`); } catch (err) { toast(`${appLocale === 'en' ? 'Backup failed:' : 'Backup fehlgeschlagen:'} ${err.message}`, 'error'); } });
$('#restore-btn').addEventListener('click', async () => { if (!confirm(appLocale === 'en' ? 'Restore a backup? Current workflows will be replaced, but a safety backup will be created first.' : 'Backup wiederherstellen? Die aktuellen Flows werden ersetzt, vorher wird aber ein Sicherheits-Backup erstellt.')) return; try { const result = await window.lapsFlow.restoreBackup(); if (result.canceled) return; workflows = await window.lapsFlow.listWorkflows(); if (workflows.length) setCurrentWorkflow(workflows[0]); toast(appLocale === 'en' ? `Restored ${result.count} workflows. A safety backup was saved.` : `${result.count} Flows wiederhergestellt. Ein Sicherheits-Backup wurde erstellt.`); } catch (err) { toast(`${appLocale === 'en' ? 'Restore failed:' : 'Wiederherstellung fehlgeschlagen:'} ${err.message}`, 'error'); } });
$('#history-clear').addEventListener('click', async () => { if (!confirm(appLocale === 'en' ? 'Permanently delete the local execution history? This cannot be undone.' : 'Lokale Ausführungshistorie dauerhaft löschen? Dieser Schritt kann nicht rückgängig gemacht werden.')) return; try { const result = await window.lapsFlow.clearHistory(); selectedHistoryId = null; await refreshHistoryList(); toast(appLocale === 'en' ? `Deleted ${result.count} history records.` : `${result.count} Verlaufseinträge gelöscht.`); } catch (err) { toast(`${appLocale === 'en' ? 'Could not clear history:' : 'Historie konnte nicht gelöscht werden:'} ${err.message}`, 'error'); } });
$('#confirm-modal').addEventListener('click', (event) => { if (event.target.id === 'confirm-modal') $('#confirm-modal').classList.add('hidden'); });
$('#clear-btn').addEventListener('click', () => { if (!current || !current.steps.length || running) return; if (!confirm('Alle Aktionen aus diesem Flow entfernen?')) return; current.steps = []; selectedStepId = null; markDirty(); renderAll(); });
$('#zoom-btn').addEventListener('click', () => { $('#canvas-area').scrollTo({ top: 0, behavior: 'smooth' }); toast('Canvas-Ansicht zurückgesetzt.'); });
$('#export-btn').addEventListener('click', async () => { if (!(await saveCurrent(true))) return; try { const result = await window.lapsFlow.exportWorkflow(current); if (!result.canceled) toast('Flow-Datei wurde exportiert.'); } catch (err) { toast(`Export fehlgeschlagen: ${err.message}`, 'error'); } });
$('#import-btn').addEventListener('click', async () => { if (!(await maybeSaveBeforeSwitch())) return; try { const imported = await window.lapsFlow.importWorkflow(); if (!imported) return; workflows.push(imported); setCurrentWorkflow(imported); toast('Flow wurde importiert.'); } catch (err) { toast(`Import fehlgeschlagen: ${err.message}`, 'error'); } });
$('#clear-log-btn').addEventListener('click', () => { logs = []; renderLogs(); }); $('#nav-activity').addEventListener('click', () => navigateToPanel('#activity-panel', 'nav-activity'));
$('#nav-time-machine').addEventListener('click', () => navigateToPanel('#time-machine-panel', 'nav-time-machine'));
$('#nav-marketplace').addEventListener('click', () => navigateToPanel('#marketplace-panel', 'nav-marketplace'));
$('#history-refresh').addEventListener('click', refreshHistoryList);
$('#market-import').addEventListener('click', () => $('#import-btn').click()); $('#market-export').addEventListener('click', () => $('#export-btn').click());
$('#help-btn').addEventListener('click', () => toast(appLocale === 'en' ? 'Choose an action, configure it, and run the workflow. Some window actions require Windows. Validate the flow before running it.' : 'Wähle eine Aktion, konfiguriere sie und starte den Ablauf. Manche Fenster-Aktionen benötigen Windows. Prüfe den Flow vor dem Start.'));
const LAPS_WEBSITE_URL = 'https://sites.google.com/view/laps-web/home';
function closeAboutModal() { $('#about-modal').classList.add('hidden'); }
async function openLapsWebsite() {
  try { await window.lapsFlow.openExternal(LAPS_WEBSITE_URL); }
  catch (err) { toast(`${appLocale === 'en' ? 'Could not open the LAPS website:' : 'LAPS-Website konnte nicht geöffnet werden:'} ${err.message}`, 'error'); }
}
$('#about-link').addEventListener('click', () => { $('#about-modal').classList.remove('hidden'); $('#about-close-btn').focus(); });
$('#about-close-btn').addEventListener('click', closeAboutModal);
$('#about-open-btn').addEventListener('click', async () => { closeAboutModal(); await openLapsWebsite(); });
$('#about-url').addEventListener('click', async (event) => { event.preventDefault(); await openLapsWebsite(); });
$('#about-modal').addEventListener('click', (event) => { if (event.target.id === 'about-modal') closeAboutModal(); });
window.addEventListener('beforeunload', (event) => {
  if (allowUnloadAfterSave || (!hasUnsavedChanges && !running)) return;
  event.preventDefault(); event.returnValue = false;
  if (closeSaveInFlight) return;
  closeSaveInFlight = true;
  (async () => {
    try {
      if (running) {
        const confirmed = confirm(appLocale === 'en' ? 'A workflow is running. Close LAPS Flow anyway? The run will be interrupted, and completed external actions will not be undone.' : 'Ein Flow läuft gerade. LAPS Flow trotzdem schließen? Der Lauf wird unterbrochen; bereits ausgeführte externe Aktionen werden nicht rückgängig gemacht.');
        if (!confirmed) return;
        await window.lapsFlow.cancelWorkflow();
      }
      let saveAttempts = 0;
      while (hasUnsavedChanges && saveAttempts < 5) {
        const ok = await saveCurrent(true);
        if (!ok) return;
        saveAttempts++;
      }
      if (hasUnsavedChanges) {
        toast(appLocale === 'en' ? 'Could not finish saving. Keep the app open and try again.' : 'Speichern nicht abgeschlossen. Lass die App geöffnet und versuche es erneut.', 'error');
        return;
      }
      allowUnloadAfterSave = true;
      try { await window.lapsFlow.closeAfterSave(); }
      catch (err) { allowUnloadAfterSave = false; throw err; }
    } catch (err) { toast(err.message, 'error'); }
    finally { closeSaveInFlight = false; }
  })();
});
initTheme(); initLocalization(); renderCatalog(); renderMarketplace(); window.lapsFlow.onFlowLog((payload) => addLog(payload)); loadInitial();
