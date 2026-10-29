# MYNDS Landing-Page

Statische Landing-Page für MYNDS (Light Mode der Marke, self-hosted Fonts).
Reines HTML/CSS — kein Build-Step, keine Abhängigkeiten.

> Der App-Code (Expo/React-Native) liegt seit dem Repo-Split in einem eigenen
> Repository: [`inettpees-debug/mynds-app`](https://github.com/inettpees-debug/mynds-app).

## Struktur

```
landing/          index.html, favicon.png, fonts/ (Outfit, Albert Sans), assets/ (Platz für hero.mp4)
netlify.toml      Deploy-Konfiguration (Publish-Dir landing/, kein Build-Step)
```

## Hero-Video einbauen

Der Video-Rahmen oben auf der Seite ist fertig verdrahtet. Um das Video zu aktivieren:

1. Video als `landing/assets/hero.mp4` ablegen (H.264, ~8–12 Sekunden, Loop-fähig, ohne Ton)
2. Committen und pushen — fertig. Das Video blendet sich automatisch über die
   gebaute Start-Einstellung (App-Replika); fehlt die Datei, bleibt die Einstellung stehen.

## Deployment

Netlify (GitHub-verbunden): jeder Push auf `main` veröffentlicht `landing/`
automatisch. Kein Build-Step, keine Konfigurationsänderung nötig.

## Bearbeiten

`landing/index.html` anpassen, committen, pushen — Netlify übernimmt den Rest.
