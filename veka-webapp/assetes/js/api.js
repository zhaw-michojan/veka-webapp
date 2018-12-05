/**
 *  Dieses JavaScript legt die Verbindung zur API fest
 *
 *  @author Janick Michot
 *  @date 05.12.18
 */

var api = {

    /**
     * URI zur API
     */
    uri: 'http://localhost:8081',

    /**
     * returns uri
     * @param request
     * @return {string}
     */
    getURI: function(request) {
        return api.uri + request;
    }
};