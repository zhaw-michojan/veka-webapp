/**
 *  Verwaltung von Dokumenten: Hinzufügen eines neuen Dokuments, Suchen eines Dokuments
 *  über seinen Namen, Ausgeben einer Liste aller Dokumente, Umbenennen eines Dokuments,
 *  Löschen eines Dokuments sofern in keiner Beziehung mehr genutzt.
 *
 *  @author Janick Michot
 *  @date 05.12.18
 */

var dokumente = {

    /**
     * Init-Funktion um alle Events festlegen
     */
    init: function() {
        $(document).ready(function(){
            // Eigenschaften setzen
            dokumente.$template = $('#documents');
            dokumente.$container = $('#documentList');

            // Liste der Dokumente laden
            dokumente.loadDocuments();

            // alle Events instanzieren
            $("#search-document").submit(dokumente.loadDocument);
            $("#add-document").submit(dokumente.createNewDocument);
            // da die Liste mit Dokumenten erst nach Aufruf der Seite geladen wird,
            // müssen die Events über `on` zugewiesen werden.
            dokumente.$container.on('click', 'a.delete', dokumente.deleteDocument);
            dokumente.$container.on('click', 'a.rename', dokumente.renameDocument);
        });
    },

    /**
     * Alle Dokumente von der API laden und einfügen
     */
    loadDocuments: function() {
        // Get-Befehl um alle Dokumente über die API zu holen
        $.get(api.getURI('/documents'), function(data) {
            // Daten für Template vorbereiten
            var documents = {"documents": data};

            // Variablen mit Mustache ins Template eintragen
            var html = Mustache.to_html(dokumente.$template.html(), documents);

            // Html zuweisen
            dokumente.$container.html(html);
      }).fail(function() {
            // Fehlermeldung wenn EUmzug nicht erreicht wird
            alert("EUmzug konnte nicht erreicht werden");
        });
    },

    /**
     * Dokument anhand des Namens suchen und anzeigen
     * @param e
     */
    loadDocument: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // name auslesen
        var name = $(this).find('input[name="name"]').val();

        // Get-Befehl um Dokument über die API zu holen
        $.get(api.getURI('/documents/' + name), function(data) {
            // Daten in Array lesen
            var documents = {"documents": [data]};

            // Variablen mit Mustache ins Template eintragen
            var html = Mustache.to_html(dokumente.$template.html(), documents);

            // Html zuweisen
            dokumente.$container.html(html);
        }).fail(function() {
            // Fehlermeldung wenn Dokument nicht gefunden wird
            alert('Dokument mit dem Namen "' + name + '" nicht gefunden');
        });
    },

    /**
     * Neues Dokument erstellen
     * @param e
     */
    createNewDocument: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // Daten auslesen und umformen
        data = JSON.stringify($(this).serializeObject());

        $.ajax({
            url: api.getURI('/documents'),
            type: 'POST',
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: data,
            success: function(result) {
                // Dokumentenliste neu laden
                dokumente.loadDocuments();
            }
        });
    },

    /**
     * Dokument löschen
     * @param e
     */
    deleteDocument: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // uri Auslesen
        var uri = $(this).attr('href');

        $.ajax({
            url: api.getURI(uri),
            type: 'DELETE',
            success: function(result) {
                // Dokumentenliste neu laden
                dokumente.loadDocuments();
            }
        });
    },

    /**
     * Dokument umbennen. Dazu wird Fenster angezeigt, in welches
     * der neuer Name eingetragen werden kann.
     * @param e
     */
    renameDocument: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // documentId, name und uri auslesen
        var documentId = $(this).attr('data-id');
        var name = $(this).attr('data-name');
        var uri = $(this).attr('href');

        // Eingabefeld für neuen Namen öffnen
        var newName = prompt("Neuen Namen eingeben", name);

        // Falls Name eingetragen wird Ajax-Call machen
        if(newName !== null){
            $.ajax({
                url: api.getURI(uri),
                type: 'PUT',
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify({
                    documentId: documentId,
                    name: newName
                }),
                success: function (result) {
                    // Dokumentenliste neu laden
                    dokumente.loadDocuments();
                }
            });
        }
    }
};

// Init-Funktion aufrufen
dokumente.init();






