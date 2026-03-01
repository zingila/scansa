# Scansa - Landing Page

![Scansa Logo](logo/Generated%20Image%20February%2013,%202026%20-%2011_46AM.png)

**Scansa** est une application mobile propulsée par l'intelligence artificielle qui analyse les contrats de location immobiliers pour détecter les clauses abusives, les frais cachés et aider les locataires à négocier en toute confiance.

## 🌐 Démo en Ligne

Le site est accessible via : [https://scansa.fr](https://scansa.fr)

## 📱 Fonctionnalités

- **Analyse IA** : Détecte les clauses illégales et les frais cachés dans les baux
- **Traduction en langage clair** : Convertit le jargon juridique en termes simples
- **Score de conformité** : Note globale de conformité (sur 100)
- **Rapports détaillés** : Analyse complète avec niveau de risque par clause
- **Assistant juridique** : Aide à trouver des arguments juridiques

## 🚀 Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Design moderne avec variables CSS et animations
- **JavaScript (Vanilla)** : Interactivité et animations de défilement
- **GitHub Pages** : Hébergement statique

## 📁 Structure du Projet

```
scansa/
├── index.html          # Page d'accueil principale
├── contact.html        # Page de contact
├── privacy.html        # Politique de confidentialité
├── terms.html         # Conditions d'utilisation
├── styles.css         # Feuille de style principale
├── script.js          # JavaScript pour l'interactivité
├── .gitignore        # Fichier d'ignore Git
├── README.md         # Documentation du projet
└── logo/            # Dossier des logos
    ├── Generated Image February 13, 2026 - 11_46AM.png
    └── Generated Image February 13, 2026 - 11_48AM.png
```

## 🎨 Design System

### Palette de Couleurs
- **Primaire** : `#DC2626` (Rouge vibrant)
- **Primaire Sombre** : `#B91C1C`
- **Fond** : `#FFFFFF` (Blanc)
- **Texte Principal** : `#111827` (Noir)
- **Texte Secondaire** : `#6B7280` (Gris)
- **Surface** : `#F9FAFB` (Gris très clair)

### Caractéristiques
- Design responsive (mobile-first)
- Animations fluides
- Accessibilité (ARIA labels)
- Navigation mobile avec menu hamburger
- Système de notification personnalisé

## 🛠️ Installation et Développement Local

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-username/scansa.git
   cd scansa
   ```

2. **Ouvrir le projet**
   - Ouvrir `index.html` directement dans votre navigateur
   - Ou utiliser un serveur local :
     ```bash
     # Avec Python 3
     python -m http.server 8000
     
     # Avec Node.js (via npx)
     npx serve
     ```

3. **Accéder au site**
   - Ouvrir `http://localhost:8000` dans votre navigateur

## 📤 Déploiement sur GitHub Pages

### Via GitHub Desktop

1. **Ouvrir GitHub Desktop**
   - File → Clone Repository
   - Cloner le dépôt Scansa

2. **Faire les modifications**
   - Effectuer vos changements dans les fichiers
   - Les modifications apparaîtront dans "Changes"

3. **Commiter les changements**
   - Ajouter un titre de commit
   - Cliquer sur "Commit to main"

4. **Pousser sur GitHub**
   - Cliquer sur "Push origin"

5. **Activer GitHub Pages**
   - Aller sur GitHub.com → Repository → Settings
   - Pages → Source → Branch: main
   - Enregistrer

### Via Ligne de Commande

```bash
# Ajouter les fichiers modifiés
git add .

# Commiter les changements
git commit -m "Description des changements"

# Pousser sur GitHub
git push origin main
```

## 🔗 Configuration du Domaine Personnalisé

### Pour scansa.fr

1. **Créer un fichier CNAME**
   ```bash
   echo "scansa.fr" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configurer les DNS chez votre registrar**
   - Type: `CNAME`
   - Name: `www` (ou vide pour le domaine racine)
   - Value: `votre-username.github.io`
   - TTL: `3600` (ou selon votre registrar)

3. **Attendre la propagation DNS**
   - Cela peut prendre de quelques minutes à 48 heures

4. **Vérifier sur GitHub**
   - GitHub → Repository → Settings → Pages
   - Vérifier que scansa.fr apparaît comme domaine personnalisé

## 📝 Contenu des Pages

### index.html
- Hero section avec CTA
- Section des fonctionnalités
- Section "Comment ça marche"
- Section de téléchargement
- Footer avec liens et boutons store

### contact.html
- Formulaire de contact
- Informations de support
- Validation JavaScript

### privacy.html
- Politique de confidentialité RGPD
- Informations collectées
- Droits des utilisateurs

### terms.html
- Conditions générales d'utilisation
- Clause de non-responsabilité
- Fonctionnement des abonnements

## 🔒 Sécurité

- Pas de JavaScript en ligne (inline)
- Validation des formulaires côté client
- Protection CSRF (à implémenter avec backend)
- HTTPS obligatoire (GitHub Pages)

## ♿ Accessibilité

- Labels ARIA pour la navigation
- Contraste des couleurs conforme WCAG
- Navigation clavier
- Texte alternatif pour les images
- Responsive design

## 📱 Liens vers les Stores

Les boutons App Store et Google Play dans le footer sont actuellement des placeholders. Pour les activer :

1. **Remplacer les liens** dans `index.html`, `contact.html`, `privacy.html`, `terms.html` :
   ```html
   <a href="https://apps.apple.com/app/scansa/idXXXXXXX" class="store-button">
   <a href="https://play.google.com/store/apps/details?id=com.scansa.app" class="store-button">
   ```

2. **Remplacer les liens CTA** dans `index.html` :
   ```html
   <a href="https://apps.apple.com/app/scansa/idXXXXXXX" class="btn btn-primary">
   <a href="https://play.google.com/store/apps/details?id=com.scansa.app" class="btn btn-secondary">
   ```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commiter les changements (`git commit -m 'Add some AmazingFeature'`)
4. Pousser sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Tous droits réservés © 2026 Scansa.

## 👨‍💻 Développement

Développé avec expertise IA pour une expérience utilisateur optimale et un code moderne et maintenable.

## 📞 Support

Pour toute question ou problème technique :
- Email : support@scansa.app
- Page de contact : [scansa.fr/contact](https://scansa.fr/contact)

---

**Note** : Scansa fournit une analyse à titre informatif et documentaire uniquement. Scansa n'est pas un cabinet d'avocats et ne délivre pas de conseil juridique officiel. Pour tout litige, consultez un professionnel du droit qualifié.
