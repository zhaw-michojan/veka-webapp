# WebApplikation für VeKa-Center

> Autoren der Dokumentation: Janick Michot

> Dokumentation letztmals aktualisiert: 18.12.2018


Die Lösung entstand im Rahmen des **Moduls Geschäftsprozesssintegration im Studiengang Wirtschaftsinformatik** an der ZHAW School of Management and Law.

Dies ist von den Studierenden selber erstellte WebbApplikation für das Umsystem Veka Center der Umzugsplattform.xamp

## Inhaltsverzeichnis
  * [Inhaltsverzeichnis](#inhaltsverzeichnis)
  * [Aufgabenstellung](#aufgabenstellung)
  * [Beschreibung](#beschreibung)
    + [XAMPP](#xampp)
    + [Schnittstelle zur API](#schnittstelle-zur-api)
    + [Cross-origin resource sharing](#cross-origin-resource-sharing-cors)


## Aufgabenstellung
Damit die Mitarbeiter des Kontons und der Gemeinden über eine separte Webapplikation, sowohl Stammdaten verwalten als auch den Status zu einer bestimmten Person abfragen können, wurde diese separate WebApplikation erstellt.


## Beschreibung

### XAMPP
Die WebApplikation für das VeKa-Center wurde in der **XAMPP-Umgebung** entwickelt und getestet.

### Schnittstelle zur API

Damit die WebApplikation auf den E-Umzug zugreifen kann, muss die entsprechende URI im File [api.js](veka-webapp/assetes/js/api.js) angegeben werden.

### Cross-origin resource sharing (CORS)

Aus Sicherheitsgründen werden Browser-Aufrufe an Ressourcen aus einer anderen Quelle blockiert. Um die für die VeKa-App benötigten Ressourcen dennoch zu erlauben, muss folgender Code dem E-Umzug im File `EumzugPlattformApplication.java` hinzugefügt werden.  

```
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurerAdapter() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**").allowedOrigins("http://localhost").allowedMethods("POST", "GET", "PUT", "DELETE");
        }
    };
}
```
