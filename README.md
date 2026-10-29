# MYNDS Landing-Page

Statische Landing-Page für MYNDS (Light Mode der Marke, self-hosted Fonts).
Reines HTML/CSS — kein Build-Step, keine Abhängigkeiten.

> Der App-Code (Expo/React-Native) liegt seit dem Repo-Split in einem eigenen
> Repository: [`inettpees-debug/mynds-app`](https://github.com/inettpees-debug/mynds-app).

## Struktur

```
landing/          index.html, favicon.png, grain.png, fonts/ (Outfit, Albert Sans)
netlify.toml      Deploy-Konfiguration (Publish-Dir landing/, kein Build-Step)
```

## Deployment

Netlify (GitHub-verbunden): jeder Push auf `main` veröffentlicht `landing/`
automatisch. Kein Build-Step, keine Konfigurationsänderung nötig.

## Bearbeiten

`landing/index.html` anpassen, committen, pushen — Netlify übernimmt den Rest.
