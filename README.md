# Boutique Démo · Supabase + GitHub Pages

Site statique (HTML / CSS / JS, sans étape de build) qui affiche le catalogue
de la table `produits` d'une base Supabase.

## Fonctionnement

- `index.html`, `style.css`, `app.js` : l'interface (recherche, tri, badges de stock).
- `config.js` : URL du projet Supabase et clé **publishable** (publique par conception).
- `.github/workflows/pages.yml` : déploie le site sur GitHub Pages à chaque push sur `main`.

## Sécurité

La clé publishable est visible dans le navigateur, c'est normal. La protection
des données repose sur la RLS (Row Level Security) : seule la table `produits`
a une politique de lecture publique ; `clients`, `commandes` et
`lignes_commande` ne sont pas accessibles avec cette clé.

Ne placez jamais la clé `service_role` / `secret` dans ce dépôt.

## Déploiement sur GitHub Pages

1. Poussez ce dépôt sur GitHub (branche `main`).
2. Dans **Settings → Pages**, choisissez **Source : GitHub Actions**.
3. Le workflow se lance ; l'URL du site apparaît dans l'onglet **Actions**
   (de la forme `https://<utilisateur>.github.io/<dépôt>/`).

## Tester en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Schéma de la base

`clients` · `produits` · `commandes` · `lignes_commande`
(voir le projet Supabase `exemple-db`).
