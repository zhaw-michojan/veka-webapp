/**
 *  Den aktuellsten Status-Eintrag (status und logTimeStamp) für eine
 *  bestimmte Person ausgeben; Alle möglichen Status-Einträge zurückgeben alphabetisch
 *  sortiert; Liste aller Personen mit einem bestimmten Status zurückgeben, sortiert nach Zeit
 *
 *  @author Janick Michot
 *  @date 05.12.18
 */


var translog = {

    /**
     *  Init Funktion um alle Events festzulegen
     */
    init: function() {
        $(document).ready(function() {

            // Funktion aufrufen, die alle Status von der API holt
            translog.getAllStatus();

            // alle Events instanzieren
            $("#getActualTranslogByPerson").submit(translog.getActualTranslogByPerson);
            $("#getPersonsByStatus").submit(translog.getPersonsByStatus);

        });
    },


    /**
     *  Alle Status-Einträge von der API laden
     */
    getAllStatus: function() {
        // Ajax Call starten
        $.get(api.getURI('/status'), function(data) {
            // Daten für Template vorbereiten
            var status = {"status": data};

            // Variablen mit Mustache ins Template eintragen
            var html = Mustache.to_html($('#statusTemplate').html(), status);

            // Html zuweisen
            $('#translogList').html(html);
        }).fail(function() {
            // Fehlermeldung wenn EUmzug nicht erreicht wird
            alert("EUmzug konnte nicht erreicht werden");
        });
    },

    /**
     *  Den aktuellsten Log-Eintrag einer Person ausgeben
     * @param e
     */
    getActualTranslogByPerson: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // Personen Id auslesen
        var personId = $(this).find('input[name="id"] ').val();

        // Get Befehl um aktuellen Status zu laden
        $.get(api.getURI('/status/' + personId), function(data) {
            // Datum formatieren
            var date = new Date(data.logTimeStamp);
            data.logTimeStamp = date.toDateString();

            // Variablen mit Mustache ins Template eintragen
            var html = Mustache.to_html($('#actualLogTemplate').html(), data);

            // Html zuweisen
            $('#actualTranslog').html(html);
        }).fail(function() {
            // Fehlermeldung ausgeben, wenn kein Eintrag gefunden wird
            alert("Person wurde nicht gefunden");
        });
    },

    /**
     *  Alle Personen mit einem bestimmten Status ausgeben
     * @param e
     */
    getPersonsByStatus: function(e) {
        // Browser-Aktion verhindern
        e.preventDefault();

        // Personen Id auslesen
        var statusName = $(this).find('input[name="statusName"] ').val();

        // Get Befehl um aktuellen Status zu laden
        $.get(api.getURI('/status/' + statusName + '/persons'), function(data) {
            // TransaktionsLog-Daten vorbereiten
            var translog = {'translog': data, 'status': statusName};

            // Variablen mit Mustache ins Template eintragen
            var html = Mustache.to_html($('#personByStatusTemplate').html(), translog);

            // Html zuweisen
            $('#personsByStatus').html(html);
        }).fail(function() {
            // Fehlermeldung ausgeben, wenn kein Eintrag gefunden wird
            alert("Es wurden keine Personen mit diesem Status gefunden");
        });
    }

};

// Init Funktion aufrufen um Applikation zu starten
translog.init();