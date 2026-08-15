# Passion.com — Site vitrine

Site vitrine responsive pour **Passion.com**, entreprise d'art visuel basée à Dakar, Sénégal (impression numérique, flocage, flex DTF, impression offset, décoration, enseignes lumineuses).

## Arborescence

```
├── index.html          → Accueil (présentation, horaires/compte à rebours, aperçu services)
├── service.html        → Services avec filtrage dynamique par catégorie
├── personnel.html       → Équipe avec filtrage dynamique par fonction
├── contact.html         → Formulaire de contact, carte, coordonnées, réseaux sociaux
├── histoire.html        → Histoire fictive + vidéo intégrée (<video>)
├── css/
│   └── style.css        → Design system complet (thème sombre/clair, composants)
├── js/
│   └── main.js           → Thème, navigation mobile, horaires/compte à rebours, filtres, formulaire
├── images/               → Dossier prévu pour vos propres visuels (voir note ci-dessous)
└── Readme.md
```

## Fonctionnalités livrées

- **Responsive** mobile / tablette / desktop sur les 5 pages.
- **Mode sombre / clair** : bouton dans le header, préférence mémorisée (localStorage), présent sur toutes les pages.
- **Compte à rebours + statut d'ouverture en temps réel** (Accueil) : calculé à partir des horaires définis dans `js/main.js` (à ajuster si besoin).
- **Filtrage dynamique** sur `service.html` (par type de service) et `personnel.html` (par fonction).
- **Réseaux sociaux** (Instagram, Facebook, TikTok, WhatsApp, Email) reliés dans le header/footer/contact — **remplacez les liens par les vrais comptes** si les identifiants indiqués (`Passion.com1`, `Passion.com`, `passioncom`) ne sont pas exacts.
- **Formulaire de contact** fonctionnel via [FormSubmit](https://formsubmit.co) (gratuit, sans backend) → envoie vers `serignesalious268@gmail.com`. **Important : la toute première soumission déclenche un email de confirmation à activer une seule fois.**
- **Carte intégrée** (Google Maps embed) pointant vers l'adresse indiquée (Fadia, Villa 93, Dakar).
- **Page Histoire** : récit fictif temporaire (clairement signalé comme provisoire) + balise `<video>` native avec une vidéo de démonstration à remplacer.

## À faire / personnaliser

1. **Images** : les visuels actuels sont des placeholders (`picsum.photos`). Remplacez-les par vos vraies photos (Unsplash, Pexels ou vos propres prises de vue) dans `/images`, puis mettez à jour les balises `<img src="...">`.
2. **Vidéo (Histoire)** : remplacez la vidéo de démonstration par un vrai fichier `.mp4` de l'atelier/équipe.
3. **Histoire réelle** : remplacez le récit fictif par l'histoire véritable de l'entreprise dès qu'elle est disponible.
4. **Personnel** : ajoutez les membres manquants dans `personnel.html` (structure de carte déjà prête à dupliquer).
5. **Réseaux sociaux** : vérifiez/actualisez les liens Instagram, Facebook, TikTok.
6. **Horaires** : ajustables dans `js/main.js`, objet `SCHEDULE` en haut du fichier.
7. **Hébergement** : le site est 100 % statique (HTML/CSS/JS) — déployable tel quel sur n'importe quel hébergeur (Netlify, Vercel, OVH, GitHub Pages, etc.).

## Palette & typographie

- Couleurs de marque : magenta `#E4127B`, bleu `#29ABE2`, orange `#F7941D`, sur fond noir `#0A0A0A` (mode sombre) / crème `#F7F5F1` (mode clair) — directement inspirées du logo.
- Typographies : **Baloo 2** (titres, arrondie et affirmée comme le logo), **Inter** (texte courant), **Space Mono** (compte à rebours, données).