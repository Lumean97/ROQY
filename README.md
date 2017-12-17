# SEP-Ravenclaw

## Setup
See [installation.md](https://github.com/Lumean97/SEP-Ravenclaw/blob/master/installation.md).

## Allgemeine Infos zur Dateistruktur
### bot-runtime
Hier soll die Bot Runtime entstehen. Das bedeutet: Die Umgebung in der der Bot am ende läuft. Zurzeit ist hier noch nichts vorhanden bis auf Boilerplate Code.

### botconfig-backend
Hier ist das Backend des Botconfigurators zu finden, zusammen mit dem Connector für die Datenbank.
Dieser ist zurzeit größtenteils implementiert. Feinheiten und Tests fehlen noch.

### botconfig-frontend
Hier sind die Daten für das Frontend des Botconfigurators zu finden. Dieser ist bereits teilweise implementiert, Tests und die Configurator Oberfläche fehlt noch.

### Weitere Infos zur Architektur
Für weitere Infos zur Architektur [hier](https://wiki.sep-ravenclaw.de/) schauen!

## Quickstart Guide zum starten von ROQY
1. Repository Klonen
2. ```docker-compose up```
3. [http://localhost:8000](http://localhost:8000)
