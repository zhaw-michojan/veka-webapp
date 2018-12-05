/**
 *  Verwaltung von Gemeinden: Hinzufügen einer neuen Gemeinde, Suchen einer Gemeinde
 *  über den Namen, Ausgeben einer Liste aller Gemeinden, Umbenennen einer Gemeinde,
 *  Löschen einer Gemeinde sofern in keiner Beziehung mehr genutzt. Verändern der drei
 *  Gebührenwerte für eine Gemeinde.
 *
 *  @author Janick Michot
 *  @dat 05.12.18
 */

var muncipalities = {

    /**
     *  Warten bis das Dokument geladen ist und dann
     *  alle Events instanzieren.
     */
    init: function() {
        $(document).ready(function(){
            // Template und Container für Gemeindelisten wählen
            muncipalities.$container = $('#muncipalitiesList');
            muncipalities.$template  = $('#muncipalitiesTemplate');

            // Gemeinden laden
            muncipalities.getMunicipalities();

            // Events
            $("#searchMunicipality").submit(muncipalities.searchMunicipality);
            $("#addMunicipality").submit(muncipalities.addMunicipality);
            // mit on laden, da Element nicht von Anfang an im DOM sind
            muncipalities.$container.on('click', 'a.delete', muncipalities.deleteMunicipality);
            muncipalities.$container.on('click', 'a.rename', muncipalities.renameMunicipality);
            muncipalities.$container.on('click', 'a.updateFeeMove', muncipalities.updateFeeMove);
            muncipalities.$container.on('click', 'a.updateFeeMoveIn', muncipalities.updateFeeMoveIn);
            muncipalities.$container.on('click', 'a.updateFeeMoveOut', muncipalities.updateFeeMoveOut);
        });
    },

    /**
     * Ausgeben einer Liste aller Gemeinden
     */
    getMunicipalities: function() {
        $.get(api.getURI('/municipalities'), function(data) {
            // Daten zu den Gemeinden zusätzlich als String in das Array schreiben,
            // wird später für die Bearbeitung von Gemeinden benötigt
            $.each(data, function(i) {
                delete data[i]['municipalityDocumentRelationEntities'];
                data[i]['data'] = JSON.stringify(data[i]);
            });

            // Daten für Template vorbereiten
            var municipalities = {"municipalities": data};

            // Variablen mit Mustache ins Template eintragen
            var html = Mustache.to_html(muncipalities.$template.html(), municipalities);

            // Html zuweisen
            muncipalities.$container.html(html);
        }).fail(function() {
            alert('E-Umzug konnte nicht erreicht werden');
        });
    },

    /**
     * Suchen einer Gemeinde über seinen Namen
     * @param e
     */
    searchMunicipality: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // Name der Gemeinde auslesen
        var municipalityName = $(this).find('input[name="name"]').val();

        $.get(api.getURI('/municipalities/' + municipalityName), function(data) {
            // Daten zu den Gemeinden zusätzlich als String in das Array schreiben,
            // wird später für die Bearbeitung von Gemeinden benötigt
            $.each(data, function(i) {
                delete data[i]['municipalityDocumentRelationEntities'];
                data[i]['data'] = JSON.stringify(data[i]);
            });

            // Daten in Array lesen
            var municipalities = {"municipalities": data};

            // Variablen mit Mustache ins Template eintragen
            var html = Mustache.to_html(muncipalities.$template.html(), municipalities);

            // Html zuweisen
            muncipalities.$container.html(html);
        }).fail(function() {
            // Fehlermeldung wenn Gemeinde nicht gefunden wird
            alert('Gemeinde wurde nicht gefunden');
        });

    },

    /**
     * Hinzufügen einer neuen Gemeinde
     * @param e
     */
    addMunicipality: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // Gemeinde-Daten auslesen und umformen
        data = JSON.stringify($(this).serializeObject());

        $.ajax({
            url: api.getURI('/municipalities'),
            type: 'POST',
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: data,
            success: function(result) {
                // Dokumentenliste neu laden
                muncipalities.getMunicipalities();
            }
        }).fail(function() {
            alert("Gemeinde konnte nicht erstellt werden");
        });
    },




    /**
     * Umbenennen einer Gemeinde
     * @param e
     */
    renameMunicipality: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // Aktualisierungs-Funktion aufrufen und Feldname, sowie message übergeben
        muncipalities.updateMunicipality($(this), 'municipalityName', 'Neuen Namen eingeben');
    },

    /**
     * Umzugsgebühr ändern
     * @param e
     */
    updateFeeMove: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // Aktualisierungs-Funktion aufrufen und Feldname, sowie message übergeben
        muncipalities.updateMunicipality($(this),'feeMove', 'Neue Umzugsgebühr');
    },

    /**
     * Zuzugsgebühr ändern
     * @param e
     */
    updateFeeMoveIn: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // Aktualisierungs-Funktion aufrufen und Feldname, sowie message übergeben
        muncipalities.updateMunicipality($(this),'feeMoveIn', 'Neue Zuzugsgebühr');
    },

    /**
     * Wegzugsgebühr ändern
     * @param e
     */
    updateFeeMoveOut: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // Aktualisierungs-Funktion aufrufen und Feldname, sowie message übergeben
        muncipalities.updateMunicipality($(this),'feeMoveOut', 'Neue Wegzugsgebühr');
    },

    /**
     * Gemeinde aktualisieren
     * @param e
     */
    updateMunicipality: function($el, name, message) {
        // Daten der Gemeinde auslesen
        var municipality = JSON.parse($el.closest('tr.municipality').attr('data'));
        var uri = $el.attr('href');

        // Eingabefeld für neuen Namen öffnen
        var newValue = prompt(message, municipality[name]);

        // Eingabe überprüfen
        if(newValue !== null) {
            // neuen Wert eintragen mit Key Value Paar
            municipality[name] = newValue;

            // Ajax Call um auf API zuzugreifen
            $.ajax({
                url: api.getURI(uri),
                type: 'PUT',
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(municipality),
                success: function (result) {
                    // Dokumentenliste neu laden
                    muncipalities.getMunicipalities();
                }
            }).fail(function() {
                // Fehlermeldung ausgeben
                alert('Gemeinde konnte nicht aktualisiert werden');
            });
        }
    },

    /**
     * Löschen einer Gemeinde sofern in keiner Beziehung mehr genutzt
     * @param e
     */
    deleteMunicipality: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // URI Auslesen aus Attribut href
        var uri = $(this).attr('href');

        $.ajax({
            url: api.getURI(uri),
            type: 'DELETE',
            success: function(result) {
                // Gemeindeliste neu laden
                muncipalities.getMunicipalities();
            }
        });
    }
};
// Init-Funktion aufrufen
muncipalities.init();
