# 5.5.0

- Ajout du réglage `is_lcp` à `get_the_image()` (`fetchpriority` élevé, pas de lazy loading ; `decoding` en opt-in via les attributs)
- Ne jamais produire `fetchpriority="high"` avec `loading="lazy"` dans les helpers d’images
- Ajout des helpers `get_theme_static_image_markup()` / `the_theme_static_image()` : images statiques du thème avec `width` / `height` (CLS) et conservation de `alt=""` pour les images décoratives
- Stockage des dimensions des images statiques dans `dist/assets.json` au build (`imageDimensions`) pour éviter les lectures disque répétées à la requête
- Ajout du filtre `bea_theme_framework_preload_fonts` (vide par défaut) pour précharger les polices affichées au premier rendu
- Réécriture de `Animation` avec des `IntersectionObserver` partagés au lieu d’une boucle au scroll (mêmes options et callbacks)
- Ajout de l’utilitaire JS `deferInitialization()` pour exécuter du code non critique à idle (INP)
- Documentation de la base Core Web Vitals dans le README (dont compatibilité ARI / `is_lcp`)

# 5.3.2

- Mise à jour de CHANGELOG.md et package.json avec le numéro de version BFF le plus récent
- Indentation par tabulations imposée dans la base de code
- Remplacement de toutes les règles dépréciées des dernières évolutions Dart Sass
- Ajout d’une option d’attribut `role` dans le service link
- Suppression du contenu personnalisé du fichier index.php
- Suppression du package BrowserSync
- Améliorations a11y (lien d’évitement, bloc image, bloc tableau)
- Ajout du lien de partage Bluesky
- Suppression du custom JS « each »
- Ajout de la logique de paramètre d’URL pour désactiver les animations JS/CSS
- Mise à jour de la version du package oneloop.js
- Passage de Node 20.11.0 à 22.13.0
- Ajout du comportement logique RTL
- Mise à jour des règles CSS ACF vers Gutenberg
- Alignement des breakpoints Custom CSS sur les breakpoints CSS WordPress par défaut
- Ajout d’un fichier tpl d’image sans lazyload
- Passage de Yarn 1.22.21 à 4.5.0
- Ajout des styles par défaut des liens externes
- Ajout de la fonctionnalité SCSS Fluid
- Ajout du service Gravity Forms
- Ajout des extensions svg/avif/webp au script JS post-build
- Mise à jour de la configuration des tailles d’images Webpack
- Correction d’erreurs W3C courantes
- Ajout du service FacetWP
- Correction de la priorité de chargement ACF
- Correction du comportement du fil d’Ariane sur le template 404
- Correction des erreurs PHPCS et WPCS
- Mise à jour de la structure et du comportement des fichiers SCSS

# 5.3.0 et 5.3.1

- Correction de l’exemple de namespace
- Injection de données dans `get_terms_list`

# 5.2.1

- Mise à jour du mixin SCSS heading

# 5.2.0

- Mise à jour des packages npm @wordpress
- Refactorisation des scripts éditeur pour utiliser les packages @wordpress
- Mise à jour de l’enregistrement des assets avec le nouveau mécanisme asset data
- Ajout d’une nouvelle méthode pour charger les données
- Ajout et configuration du package dependency-extraction-webpack-plugin

# 5.1.6

- Mise à jour des packages npm PostCSS

# 5.1.5

- Mise à jour du package npm browser-sync

# 5.1.4

- Ajout du package npm post-scss

# 5.1.3

- Création des variables de palette SCSS

# 5.1.2

- Mise à jour du package npm canvas
- Correction du script Webpack des tailles d’images

# 5.1.1

- Mise à jour des packages npm de linting
- Mise à jour des règles de linting JS et SCSS
- Nettoyage et correction des problèmes de linting sur les fichiers SCSS

# 5.1

- Refonte majeure du contenu et de l’organisation du dossier SCSS

# 5.0.9

- Ajout d’un mixin SCSS scrollbar invisible

# 5.0.8

- Correction du nom de fichier pour le script et la feuille de style éditeur

# 5.0.7

- Ajout d’un hook pour charger le CSS minifié de la page de connexion

# 5.0.6

- Ajout de helpers de templating (`the_image`, `the_text`, `the_link`, etc.)

# 5.0.0

- Ajout de Webpack 5
- Déplacement des fichiers de configuration build dans le dossier `config`
- Suppression des scripts bash
- Optimisation des images côté front
- Suppression des templates statiques
- BrowserSync fonctionnel avec Lando
- Remplacement de Babel par Esbuild
- IE11 n’est plus pris en charge

# 4.7.0

- Gestion des patterns éditeur
- Gestion des catégories de patterns éditeur
- Gestion du JS backend éditeur
- Gestion du CSS frontend/backend éditeur
- Version PHP minimale 7.2
- Suppression de `loadFont.php` et utilisation de l’enqueue de scripts classique
- Ajout de `esc_attr` sur les scripts defer/async
