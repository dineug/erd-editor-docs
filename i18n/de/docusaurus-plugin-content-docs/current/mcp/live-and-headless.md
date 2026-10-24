---
sidebar_position: 3
description: Wie der MCP-Server zwischen der Live-Bearbeitung in einem Editor (VS Code, Obsidian oder einer JetBrains-IDE) und der Bearbeitung der Datei auf dem Datenträger entscheidet und was Speichern, Rückgängigmachen und ein geschlossener Editor jeweils bewirken.
---

# Live und Headless

Bei jedem Aufruf sucht der Server über die Sperrdateien, die die Editoren in `~/.erd-editor/ide/` anlegen, nach einem Editor, der das Dokument hält.
Jedes Fenster von VS Code und jedes Vault-Fenster von Obsidian mit dem ERD Editor legt eine an, und eine JetBrains-IDE legt eine für die ganze IDE an, mit einer Liste aller Projekte, die darin geöffnet sind.
Ein Editor entfernt seine Sperrdatei, wenn er geschlossen wird.
Was der Server findet, entscheidet darüber, wohin die Änderung geht.

| Was er findet | Was eine Änderung bewirkt |
| --- | --- |
| Ein Editor, dessen Arbeitsbereich, Vault oder geöffnetes Projekt das Dokument enthält oder der es geöffnet hat | **Live.** Öffnet das Dokument bei Bedarf im ERD Editor, tritt der Bearbeitungssitzung bei und wendet die Änderung dort an. Änderungen erscheinen sofort und werden so gespeichert, wie der Editor Ihre eigenen speichert – siehe [Speichern](#saving). |
| Kein Editor | **Headless.** Lädt die Datei, wendet die Änderung an und ersetzt die Datei, bevor er antwortet, sodass das Ergebnis `saved: true` meldet und es für `erd_save` nichts zu tun gibt. |
| Ein Editor mit ausgeschaltetem Hub | **Abgelehnt.** Lesevorgänge funktionieren weiterhin, und zwar vom Datenträger. Eine Änderung, die unter einem geöffneten Editor in die Datei geschrieben wird, könnte bei dessen nächstem Speichern überschrieben werden, daher schreibt der Server nichts. |
| Ein Editor, dessen Hub eingeschaltet ist, der aber ein anderes Protokoll spricht als der Server: bei Server `1.0.0` oder neuer eine Erweiterung für VS Code in Version `3.x`, ein Plugin für Obsidian in Version `0.x` oder ein Plugin für JetBrains in Version `0.9.0` oder `0.10.0`; bei einem Server vor `1.0.0` die Erweiterung in Version `4.0.0` oder neuer oder ein Plugin in Version `1.0.0` oder neuer | **Abgelehnt**, Lesevorgänge eingeschlossen, mit `protocolMismatch`. Die Meldung nennt die Seite, die aktualisiert werden muss: die Erweiterung oder das Plugin oder den Server – siehe [Aktualisieren](./installation.md#updating). |
| Unter Windows ein Editor, der das Dokument unter einem anderen Pfad zur selben Datei hält: Der Agent hat es über eine Netzwerkfreigabe oder ein verbundenes Laufwerk dieses Computers angegeben, etwa `\\localhost\C$\…`, und der Editor hält es unter seinem Laufwerkspfad, oder umgekehrt | **Abgelehnt**, Lesevorgänge eingeschlossen, mit `invalidPath`. Die Meldung nennt den Pfad, unter dem der Editor das Dokument hält; wiederholen Sie den Aufruf mit diesem Pfad. |
| Unter Windows ein Editor, von dem Windows den Agenten fernhält: einer, der als Administrator gestartet wurde, der Agent aber nicht, oder jeder Editor, wenn der Agent in einer Sandbox läuft | **Abgelehnt**, Lesevorgänge eingeschlossen, mit `hubUnreachable` und einer Meldung, die den Grund nennt. Führen Sie den Editor und den Agenten mit denselben Rechten aus, zum Beispiel, indem Sie den Editor erneut ohne Administratorrechte starten. |

Das Ergebnis einer Änderung nennt den Modus, in dem sie ausgeführt wurde, `live` oder `headless`, und eine abgelehnte Änderung nennt den Grund.
Die Suche läuft bei jedem Aufruf erneut, sodass sich der nächste Aufruf nach dem Öffnen oder Schließen eines Editors richtet.

Halten mehrere Editoren das Dokument, hat einer, der es geöffnet hat, Vorrang vor einem, der nur einen Ordner bedient, der es enthält, und unter denen, die einen Ordner bedienen, hat derjenige Vorrang, dessen Ordner am tiefsten liegt.
Bei Gleichstand, etwa wenn zwei Editoren es beide geöffnet haben, gewinnt derjenige, dessen Sperrdatei sich zuletzt geändert hat.
Ein Dokument in einem Vault von Obsidian innerhalb eines Arbeitsbereichsordners von VS Code geht daher an Obsidian, es sei denn, VS Code hat es geöffnet und Obsidian nicht.

Aufrufe für ein Dokument laufen nacheinander, in der Reihenfolge, in der sie den Server erreicht haben. Aufrufe für verschiedene Dokumente laufen parallel.

## Live {#live}

Der Agent tritt dem Editor wie ein weiterer Mitbearbeiter bei.
Seine Änderungen erreichen sofort jeden Editor, in dem das Dokument geöffnet ist, und sein Fokus wird auf der Tabelle und Zelle dargestellt, die er gerade bearbeitet, wie der eines Mitbearbeiters – siehe [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Ein Lesevorgang öffnet nie einen Editor. Eine Änderung öffnet das Dokument im ERD Editor, wenn es noch nicht geöffnet ist, ohne den Tastaturfokus zu übernehmen.

Ein Editor mit einer Erweiterung für VS Code vor `4.2.0` oder einem Plugin für Obsidian oder JetBrains vor `1.2.0` übernimmt die Änderungen des Agenten weiterhin live, zeigt die logischen Namen, Domänenverknüpfungen und Wörterbuchzeilen, die der Agent schreibt, aber weder an, noch behält er sie – siehe [Aktualisieren](./installation.md#updating).

### Speichern {#saving}

Jeder Editor speichert die Änderungen des Agenten so, wie er Ihre eigenen speichert.

In VS Code markieren die Änderungen des Agenten die Registerkarte wie Ihre eigenen als ungespeichert und gelangen erst auf den Datenträger, wenn das Dokument gespeichert wird.
`erd_save` speichert es über VS Code, so wie dessen eigener Befehl zum Speichern. Sie können stattdessen auch selbst speichern, mit `Ctrl + S` (Windows/Linux) oder `⌘ + S` (Mac).
Wird der Editor mit ungespeicherten Änderungen des Agenten geschlossen, fragt er, ob sie gespeichert werden sollen, wie bei jeder anderen ungespeicherten Änderung.

Obsidian speichert die Änderungen des Agenten etwa zwei Sekunden nach dem Ende der Bearbeitung, und das Schließen der Registerkarte speichert sie ohne Nachfrage.
Eine JetBrains-IDE schreibt sie einen Sekundenbruchteil nach dem Ende der Bearbeitung, und das Schließen der Registerkarte schreibt, was noch aussteht; die Registerkarte wird nie als geändert angezeigt.
In beiden schreibt `erd_save` sie sofort.

`erd_save` wartet zunächst bis zu zwei Sekunden, bis der Editor jede Änderung des Agenten übernommen hat.
Es wird mit `notSaved` abgelehnt, wenn der Editor das nicht bestätigen konnte oder die Datei nicht geschrieben hat: VS Code lässt eine Registerkarte ungespeichert, wenn sich die Datei auf dem Datenträger geändert hat, und eine JetBrains-IDE konnte sie nicht schreiben, etwa während ein Dialog geöffnet war oder wenn die Datei nicht beschreibbar ist.

In VS Code und einer JetBrains-IDE gelingt `erd_save` bei einem Dokument, an dem nichts mehr zu speichern ist, und lässt die Datei, wie sie ist.
Das ist der Fall, sobald jede Änderung gespeichert ist, was eine JetBrains-IDE von selbst tut, und es bleibt so, solange jede spätere Änderung eine ist, die eine [Sperre](../guide/guides/settings.md#lock) aus der Datei heraushält, etwa das Scrollen oder Zoomen, während `Viewport` gesperrt ist, das Wechseln der Registerkarte, während `Canvas Type` gesperrt ist, oder das Wechseln der [Namensansicht](../guide/guides/logical-names.md#name-view), während `Name View` gesperrt ist. Jede Sperre ist standardmäßig eingeschaltet.
Eine Datei, die eine JetBrains-IDE nicht schreiben kann, wird auch dann abgelehnt.

Schließt der Editor das Dokument nach der letzten Änderung des Agenten, enthält der nächste Aufruf des Agenten einen Hinweis, dass diese Änderungen nur dann in der Datei stehen, wenn sie vor dem Schließen des Editors gespeichert wurden.

### Rückgängig machen {#undo}

`erd_undo` macht die letzte Änderung des Agenten rückgängig, nie Ihre, und `erd_redo` wendet sie erneut an.
Die eigene Funktion [Rückgängig](../guide/guides/undo-redo.md) des Editors arbeitet umgekehrt: Sie macht Ihre Änderungen rückgängig und nie die des Agenten, da Änderungen, die aus einem anderen Editor eintreffen, nicht in Ihrem Verlauf aufgezeichnet werden.

Einige Änderungen erzeugen im Editor keinen Rückgängig-Eintrag: `erd_set_database` und `erd_set_database_name` unter den [Einstellungs-Tools](./tools.md#settings) sowie `erd_resize_memo`.
Auch ein `erd_move_table_group`, das die Gruppe insgesamt um weniger als 20 Pixel verschiebt, waagerecht und senkrecht zusammengerechnet, erzeugt keinen, obwohl die Gruppe dort bleibt, wohin sie verschoben wurde.
Ebenso erzeugt ein Aufruf, der nichts ändert, keinen: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` oder `erd_set_index_column_order`, wenn sie einen Wert setzen, den das Dokument bereits hat; `erd_add_index_column` mit einer Spalte, die bereits im Index ist; `erd_set_table_group` mit Tabellen, die bereits in dieser Gruppe sind (oder bereits in keiner, mit `groupId` `null`); `erd_move_table_group` an den Punkt, an dem die Gruppe bereits steht; `erd_resize_table_group` auf das Rechteck, das die Gruppe bereits hat; `erd_sort_tables` bei einem Dokument ohne Tabelle; `erd_set_table_logical_name` oder `erd_set_column_logical_name` mit dem logischen Namen, den die Tabelle oder Spalte bereits hat, wenn das Ableiten daraus nichts ändern würde; `erd_set_column_domain` mit der Domäne, mit der die Spalte bereits verknüpft ist, wenn die Spalte bereits den Typ dieser Domäne hat und die [Datentyp-Synchronisierung für Beziehungen](../guide/guides/settings.md#relationship-datatype-sync) entlang ihrer Beziehungen den Typ keiner Spalte ändern würde; `erd_update_word`, `erd_update_term` oder `erd_update_domain` nur mit Werten, die die Zeile bereits hat, es sei denn, einem Begriff ohne physischen Namen wird sein `name` übergeben und seine Wörter setzen einen zusammen; `erd_derive_physical_names`, wenn jeder von ihm abgedeckte Name, der einen logischen Namen hat, bereits das enthält, was die [Wörterbücher](./tools.md#dictionaries) ihm geben, und als abgeleitet markiert ist; oder ein Import mit `mode` `append`, der keine Tabelle mitbringt (bei `erd_import_json` keine Tabelle und keine Notiz).
`erd_undo` überspringt diese und nennt sie in seinem Ergebnis.
Andere Änderungen, etwa `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` und `erd_set_ddl_script`, erzeugen einen Eintrag, auch wenn sie einen Wert setzen, den das Dokument bereits hat.

In diesen Fällen endet der Verlauf des Agenten, mit einem Hinweis im Ergebnis:

- Der Agent tritt dem Dokument erneut bei, zum Beispiel, nachdem der Editor den Agenten daraus entfernt hat.
- Der Editor wird beendet oder schließt das Dokument und bedient es nicht mehr, und der Agent bearbeitet die Datei auf dem Datenträger weiter.
- Ein Editor übernimmt ein Dokument, das der Agent auf dem Datenträger bearbeitet hat.

Der Server schließt außerdem ein Dokument, zu dem der Agent seit 30 Minuten keinen Aufruf gemacht hat, und der Verlauf geht damit verloren, ohne Hinweis.

### Wenn der Editor nicht mehr da ist {#when-the-editor-goes-away}

Solange ein Editor ein Dokument hält, weicht der Server nie von sich aus auf die Datei aus.
Bricht die Verbindung ab, stellt er sie wieder her.
Nur wenn der Editor beendet wurde oder das Dokument geschlossen hat und weder es noch einen Ordner, der es enthält, mehr aufführt, bearbeitet der Server die Datei und weist im Ergebnis darauf hin.
Das geschieht, wenn Sie ein Diagramm schließen, das außerhalb aller Ordner liegt, die der Editor bedient (in VS Code eines, das von außerhalb des Arbeitsbereichs geöffnet wurde), wenn Sie in Obsidian das Plugin ERD Editor ausschalten und wenn Sie in einer JetBrains-IDE das Projekt schließen, das das Dokument enthält, oder dort das Plugin ausschalten.
Ein geschlossenes Diagramm in einem Ordner, den der Editor bedient, bleibt beim Editor, und die nächste Änderung des Agenten öffnet es wieder.

Ein Editor, der noch läuft, dessen Sperrdatei aber verschwunden ist und dessen Verbindung geschlossen wurde, ohne dass er das Dokument geschlossen hat, lehnt die nächste Änderung mit `hubGone` ab.
Die Meldung sagt, was das Dokument freigibt: Laden Sie in VS Code dieses Fenster neu, oder schließen Sie es, damit der Agent die Datei direkt bearbeiten kann; schalten Sie in Obsidian das Plugin ERD Editor wieder ein, oder schließen Sie dieses Fenster; schalten Sie in einer JetBrains-IDE das Plugin wieder ein, oder beenden Sie die IDE.

In zwei Fällen geht ein Lesevorgang stattdessen an die Datei auf dem Datenträger, mit einem Hinweis, dass im Editor noch nicht gespeicherte Änderungen fehlen: wenn beim Editor, der das Dokument hält, der Hub ausgeschaltet ist, und im Fall `hubGone` weiter oben.
Ein Lesevorgang, der keine Verbindung zum Hub eines Editors herstellen kann, wird wie eine Änderung mit `hubUnreachable` abgelehnt.

## Headless {#headless}

Wenn kein Editor das Dokument bedient, wird bei jeder Änderung die Datei geladen, die Änderung angewendet und die Datei zurückgeschrieben, bevor der Aufruf antwortet, sodass sein Ergebnis `saved: true` meldet – siehe [Ergebnisse](./tools.md#results).
Geschrieben wird in eine temporäre Datei namens `.<name>.<id>.tmp` neben dem Dokument, die es dann ersetzt, sodass das Dokument nie halb geschrieben zurückbleibt, außer unter Windows im unten beschriebenen Fall des direkten Überschreibens.

Vor diesem letzten Schritt prüft der Server, ob sich die Datei während des Aufrufs auf dem Datenträger geändert hat.
Wenn ja, wird nichts geschrieben, die Datei wird neu geladen, und der Aufruf wird mit `conflict` abgelehnt. Der Agent wiederholt den Aufruf.
Eine Datei, die sich zwischen zwei Aufrufen geändert hat, wird einfach neu geladen, und der Verlauf des Agenten bis dahin wird verworfen.

Eine schreibgeschützte Datei bleibt, wie sie ist, und die Änderung wird mit `readonly` abgelehnt: eine Datei ohne Schreibrecht für ihren Besitzer oder unter Windows mit dem Schreibschutzattribut, etwa eine Datei von Perforce oder TFVC, die nicht ausgecheckt ist.
Machen Sie sie beschreibbar, und wiederholen Sie dann den Aufruf. Lesevorgänge funktionieren weiterhin.

Beginnt ein Editor, das Dokument zu bedienen, während der Agent es auf dem Datenträger bearbeitet, wird diese eine Änderung mit `hubAppeared` abgelehnt, und es wird nichts geschrieben. Der nächste Aufruf bearbeitet das Dokument über den Editor.

Unter Windows gelten zwei weitere Regeln:

- Ein Dokument mit eigenen Berechtigungen, die sich von denen seines Ordners unterscheiden, wird direkt überschrieben statt ersetzt, damit es sie behält, und die temporäre Datei wird danach entfernt. Ein Programm, das das Dokument während dieses Schreibvorgangs liest, kann Text vorfinden, der sich nicht parsen lässt.
- Eine Datei, die ein anderes Programm geöffnet hält, kann nicht ersetzt werden, daher versucht es der Server bis zu zwei Sekunden lang erneut. Jeder Versuch sucht zuerst erneut nach einem Editor, und ein Editor, der inzwischen begonnen hat, das Dokument zu bedienen, lehnt den Schreibvorgang mit `hubAppeared` ab oder mit `blocked`, wenn sein Hub ausgeschaltet ist. Ist die Datei nach zwei Sekunden noch belegt, wird nichts geschrieben, die Datei wird neu geladen, und der Aufruf schlägt mit einer Meldung fehl, die den Systemfehler wiedergibt.

Ein Server vor `1.1.0` liest ein Dokument ohne seine logischen Namen, die Domänenverknüpfungen seiner Spalten und seine Wörter, Begriffe und Domänen, sodass die erste Änderung, die er in die Datei schreibt, diese weglässt. Aktualisieren Sie den Server – siehe [Aktualisieren](./installation.md#updating).

## Abgelehnt {#refused}

Ein Fenster von VS Code behält seine Sperrdatei auch dann, wenn sein Hub ausgeschaltet ist: wenn `dineug.erd-editor.agentHub.enabled` ausgeschaltet ist, wenn dem Arbeitsbereich nicht vertraut wird oder wenn sein Hub nicht auf Verbindungen lauschen konnte.
Ein Vault-Fenster von Obsidian behält seine Sperrdatei mit ausgeschaltetem Hub, wenn Coding agents ausgeschaltet ist und wenn sein Hub nicht auf Verbindungen lauschen konnte.
Eine JetBrains-IDE behält ihre Sperrdatei mit ausgeschaltetem Hub, wenn Coding agents ausgeschaltet ist, wenn ihr Hub nicht auf Verbindungen lauschen konnte und während die IDE beendet wird.

Eine Änderung an einem solchen Dokument wird mit `blocked` abgelehnt, weil der geöffnete Editor eine in die Datei geschriebene Änderung bei seinem nächsten Speichern überschreiben könnte.
Lesevorgänge funktionieren weiterhin, und zwar aus der Datei auf dem Datenträger.

Damit der Agent Änderungen vornehmen kann, schalten Sie den Hub wieder ein, wie es die Meldung für diesen Editor beschreibt: Vertrauen Sie in VS Code dem Arbeitsbereich und schalten Sie die Einstellung ein, oder laden Sie das Fenster neu; schalten Sie in Obsidian Coding agents ein, oder laden Sie Obsidian neu; schalten Sie in einer JetBrains-IDE Coding agents ein, oder starten Sie die IDE neu, wenn Coding agents bereits eingeschaltet ist.

Eine JetBrains-IDE lehnt es außerdem mit `hubDisabled` ab, ein Dokument zu ändern, das nur von Projekten gehalten wird, denen sie nicht vertraut.
Agenten können ein solches Dokument weiterhin lesen, und `erd_list_documents` führt es als `readonly` auf. Vertrauen Sie dem Projekt, und wiederholen Sie dann den Aufruf.

Ein Editor, der keine Sperrdatei anlegt, schützt nichts, und der Agent bearbeitet die Datei auf dem Datenträger, selbst während das Diagramm dort geöffnet ist.
Das ist der Fall bei Obsidian oder einer JetBrains-IDE, die unter Linux als Flatpak installiert ist, bei einer JetBrains-IDE ohne JCEF und bei einer JetBrains-IDE, deren Hub nicht starten konnte – siehe [Obsidian einrichten](./installation.md#set-up-obsidian) und [Eine JetBrains-IDE einrichten](./installation.md#set-up-a-jetbrains-ide).
Eine Erweiterung für VS Code vor `3.0.0` und ein Plugin für JetBrains vor `0.9.0` legen ebenfalls keine an, da sie keinen Hub haben.

## Dokumente {#documents}

Ein Dokument wird über `path` angegeben, absolut oder relativ zum Arbeitsverzeichnis des Servers.

- Neue Dokumente sind Dateien `.erd.json`. `erd_open_document` mit `create` legt die Datei an und hängt an einen Namen ohne Endung `.erd.json` an. Wie bei einem neuen Diagramm im Editor ist im neuen Dokument jede [Sperre](../guide/guides/settings.md#lock) eingeschaltet, sodass Scrollen, Zoomen, das Wechseln der Registerkarte, das Wechseln der Namensansicht oder die Wahl einer anderen Sprache, einer anderen Schreibweise oder eines anderen Begrenzertyps im Codegenerator in einem Editor die Datei nie ändert. Kein Tool schaltet eine einzelne Sperre ein oder aus: Das tun Sie auf der Registerkarte Einstellungen des Editors. `erd_import_json` im Modus `replace` ersetzt sie alle durch die des Dokuments, das es lädt – siehe [Import](./tools.md#import).
- Vorhandene Dateien `.erd`, `.vuerd` und `.vuerd.json` lassen sich ebenfalls öffnen. Ein Pfad mit einer anderen Endung wird mit `invalidPath` abgelehnt.
- Unter Windows wird ein Pfad, der einen Namen enthält, den Windows nicht so speichert, wie er geschrieben ist, mit `invalidPath` abgelehnt, bevor das Dokument gelesen oder geschrieben wird, Lesevorgänge eingeschlossen: ein Name mit einem Doppelpunkt oder einem anderen Zeichen, das Windows ablehnt, etwa `orders:v2.erd`; ein Gerätename wie `NUL.erd` oder `CON.erd`, in beliebiger Groß-/Kleinschreibung; oder ein Name, der auf einen Punkt oder ein Leerzeichen endet. Benennen Sie die Datei um, zum Beispiel mit `-` anstelle von `:`.
- Eine Datei, die kein Dokument ist, das der Editor lesen kann, etwa eine, in der Merge-Konfliktmarkierungen zurückgeblieben sind, wird mit `invalidDocument` abgelehnt und bleibt, wie sie ist. Sie wird nie als leeres Diagramm geladen und zurückgeschrieben.

Der Agent ändert ein Dokument nur über die Tools und ist angewiesen, die Datei nie selbst zu schreiben.

`erd_list_documents` listet die Dokumente mit `path`, `open`, `active`, `dirty` und `readonly` auf.
Es fragt den Editor, der das Arbeitsverzeichnis bedient und wie bei einem Dokument ausgewählt wird, und listet die darin geöffneten Diagramme auf, dann die ERD-Dateien, die er bedient: die in den Arbeitsbereichsordnern eines Fensters von VS Code, in einem Vault von Obsidian oder in jedem in einer JetBrains-IDE geöffneten Projekt.
Andernfalls listet es die ERD-Dateien unter dem Arbeitsverzeichnis auf, wobei eine schreibgeschützte Datei als `readonly` gekennzeichnet ist und unter Windows ein Name, den Windows nicht so speichert, wie er geschrieben ist, entfällt.
