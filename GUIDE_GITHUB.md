# Guide de Déploiement - Scansa Landing Page

Ce guide vous explique comment déployer la landing page Scansa sur GitHub Pages avec GitHub Desktop et configurer le domaine personnalisé scansa.fr.

## 📋 Prérequis

- GitHub Desktop installé sur votre ordinateur
- Un compte GitHub
- Le domaine scansa.fr acheté chez un registrar (OVH, Gandi, GoDaddy, etc.)

---

## 🚀 Étape 1 : Créer le Dépôt GitHub

### Option A : Via le Site Web GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous
2. Cliquez sur le **+** en haut à droite → **New repository**
3. Remplissez les informations :
   - **Repository name** : `scansa` (ou le nom que vous préférez)
   - **Description** : Landing page pour l'application Scansa
   - **Public/Private** : Choisissez **Public** (nécessaire pour GitHub Pages gratuit)
   - Ne cochez **pas** "Initialize this repository with a README"
4. Cliquez sur **Create repository**

### Option B : Via GitHub Desktop

1. Ouvrez **GitHub Desktop**
2. Cliquez sur **File** → **New Repository...**
3. Remplissez les informations :
   - **Name** : `scansa`
   - **Description** : Landing page pour l'application Scansa
   - **Local path** : `C:\Users\Admin\Documents\site\scansa`
4. Cochez **Publish this repository to GitHub**
5. Sélectionnez votre compte GitHub
6. Cliquez sur **Create Repository**

---

## 📤 Étape 2 : Pousser le Code sur GitHub

### Via GitHub Desktop (Recommandé)

1. **Ouvrir le dépôt existant**
   - File → Open Local Repository...
   - Sélectionnez : `C:\Users\Admin\Documents\site\scansa`
   - Cliquez sur **Choose**

2. **Vérifier les modifications**
   - Dans l'onglet "Changes", vous verrez tous les fichiers modifiés
   - Les fichiers avec une coche verte ✓ sont déjà ajoutés (staged)

3. **Commiter les changements**
   - Dans le champ "Summary", entrez : `Initial commit - Landing page Scansa avec design moderne`
   - Dans le champ "Description" (optionnel) :
     ```
     - Design blanc avec thème rouge vibrant
     - Navigation mobile responsive
     - Boutons App Store et Play Store dans le footer
     - Pages : index, contact, privacy, terms
     - Configuration GitHub Pages avec domaine scansa.fr
     ```
   - Cliquez sur **Commit to main**

4. **Pousser sur GitHub**
   - Cliquez sur le bouton **Publish repository** (ou **Push origin** si déjà publié)
   - Vérifiez que le nom du dépôt est correct
   - Cliquez sur **Publish repository**

### Via Ligne de Commande

Si vous préférez utiliser la ligne de commande :

```bash
cd c:/Users/Admin/Documents/site/scansa

# Commiter les fichiers déjà ajoutés
git commit -m "Initial commit - Landing page Scansa avec design moderne"

# Pousser sur GitHub
git push origin main
```

---

## 🌐 Étape 3 : Activer GitHub Pages

1. Allez sur votre dépôt GitHub : `https://github.com/votre-username/scansa`
2. Cliquez sur l'onglet **Settings** (icône d'engrenage)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous **Build and deployment** → **Source** :
   - Sélectionnez **Deploy from a branch**
   - Branch : **main**
   - Folder : **/(root)**
5. Cliquez sur **Save**

6. Attendez quelques minutes, GitHub va déployer votre site
7. L'URL de votre site sera : `https://votre-username.github.io/scansa/`

---

## 🔗 Étape 4 : Configurer le Domaine Personnalisé (scansa.fr)

### 4.1 Vérifier le Fichier CNAME

Le fichier `CNAME` est déjà présent dans le projet avec le contenu :
```
scansa.fr
```

Si vous voulez utiliser `www.scansa.fr` à la place, modifiez le fichier pour :
```
www.scansa.fr
```

### 4.2 Configurer les DNS chez votre Registrar

Les instructions varient selon votre registrar. Voici les plus courants :

#### Ionos
1. Connectez-vous à votre compte Ionos
2. Allez dans **Domaines** → Sélectionnez `scansa.fr`
3. *Important :* Si une "Redirection" est active, désactivez-la d'abord via "Ajuster la destination".
4. Dans l'onglet **Zone DNS**, supprimez tous les anciens enregistrements de type A, AAAA et TXT (_dep_ws_mutex) pointant vers l'IP Ionos par défaut.
5. Cliquez sur **Ajouter une entrée DNS** et créez 4 enregistrements **A** pour le domaine racine :
   - Type : **A** | Nom : `@` (ou vide) | Cible : `185.199.108.153`
   - Type : **A** | Nom : `@` (ou vide) | Cible : `185.199.109.153`
   - Type : **A** | Nom : `@` (ou vide) | Cible : `185.199.110.153`
   - Type : **A** | Nom : `@` (ou vide) | Cible : `185.199.111.153`
6. Créez ensuite un enregistrement **CNAME** pour le www :
   - Type : **CNAME** | Nom : `www` | Cible : `zingila.github.io`
7. Cliquez sur **Suivant** puis **Valider**

#### Gandi
1. Connectez-vous à votre compte Gandi
2. Allez dans **Mes produits** → **Domaines** → Sélectionnez `scansa.fr`
3. Cliquez sur l'onglet **Gérer la zone DNS**
4. Cliquez sur **Ajouter un type d'enregistrement**
5. Configurez :
   - Type : **CNAME**
   - Nom : **www** (ou vide)
   - TTL : **10800**
   - Valeur : `votre-username.github.io`
6. Cliquez sur **Ajouter**

#### GoDaddy
1. Connectez-vous à votre compte GoDaddy
2. Allez dans **Mes produits** → **DNS**
3. Cliquez sur **Ajouter** pour créer un nouvel enregistrement
4. Configurez :
   - Type : **CNAME**
   - Nom : **www** (ou @ pour le domaine racine)
   - Valeur : `votre-username.github.io`
   - TTL : **1 heure**
5. Cliquez sur **Enregistrer**

#### OVH
1. Connectez-vous à votre manager OVH
2. Allez dans **Domaines** → Sélectionnez `scansa.fr`
3. Cliquez sur l'onglet **Zone DNS**
4. Cliquez sur **Ajouter une entrée DNS**
5. Configurez :
   - Type : **CNAME**
   - Sous-domaine : **www** (ou laissez vide pour le domaine racine)
   - Cible : `votre-username.github.io`
   - TTL : **3600**
6. Cliquez sur **Suivant** puis **Valider**

### 4.3 Configurer sur GitHub

1. Retournez sur GitHub → Repository → **Settings** → **Pages**
2. Sous **Custom domain**, entrez : `scansa.fr`
3. Cliquez sur **Save**
4. GitHub affichera un message de vérification DNS

### 4.4 Attendre la Propagation DNS

- La propagation DNS peut prendre de **quelques minutes à 48 heures**
- Vous pouvez vérifier la propagation sur : [https://dnschecker.org/](https://dnschecker.org/)
- Une fois propagé, votre site sera accessible sur : `https://scansa.fr`

---

## 🔒 Étape 5 : HTTPS (Certificat SSL)

**⚠️ Note Importante concernant HTTPS :**

Si vous utilisez un hébergeur comme **Ionos** qui ne fournit pas de certificat SSL gratuit, vous rencontrerez ce message :

> "Enforce HTTPS — Unavailable for your site because your domain is not properly configured to support HTTPS (scansa.fr)"

**Solutions disponibles :**

#### Option A : Désactiver temporairement l'application forcée d'HTTPS (Recommandé pour l'instant)
1. Allez sur GitHub → Repository → **Settings** → **Pages**
2. Sous **HTTPS**, **décochez** "Enforce HTTPS"
3. Cliquez sur **Save**
4. Votre site sera accessible en HTTP : `http://scansa.fr`
5. Une fois que vous avez un certificat SSL, vous pourrez réactiver cette option

#### Option B : Utiliser Cloudflare (SSL Gratuit)
1. Créez un compte gratuit sur [Cloudflare](https://dash.cloudflare.com/sign-up)
2. Ajoutez votre domaine `scansa.fr` à Cloudflare
3. Cloudflare vous fournira des serveurs DNS à utiliser
4. Mettez à jour vos enregistrements DNS chez Ionos avec les serveurs Cloudflare
5. Cloudflare fournit automatiquement un certificat SSL gratuit
6. Une fois propagé, réactivez "Enforce HTTPS" sur GitHub

#### Option C : Acheter un certificat SSL chez votre hébergeur
1. Contactez le support de votre hébergeur (Ionos)
2. Demandez l'activation d'un certificat SSL pour votre domaine
3. Suivez leurs instructions pour l'installation
4. Une fois installé, réactivez "Enforce HTTPS" sur GitHub

**Pour l'instant (Option A) :**
1. Allez sur GitHub → Repository → **Settings** → **Pages**
2. Sous **HTTPS**, **décochez** "Enforce HTTPS"
3. Cliquez sur **Save**
4. Votre site sera accessible en HTTP : `http://scansa.fr`

---

## 🔄 Étape 6 : Mettre à Jour le Site

Pour apporter des modifications au site :

### Via GitHub Desktop

1. Effectuez vos modifications dans les fichiers (HTML, CSS, JS)
2. Dans GitHub Desktop, les modifications apparaîtront dans l'onglet **Changes**
3. Ajoutez un titre de commit descriptif
4. Cliquez sur **Commit to main**
5. Cliquez sur **Push origin**
6. GitHub Pages déploiera automatiquement les changements (environ 1-2 minutes)

### Via Ligne de Commande

```bash
cd c:/Users/Admin/Documents/site/scansa

# Voir les modifications
git status

# Ajouter les fichiers modifiés
git add .

# Commiter
git commit -m "Description des changements"

# Pousser
git push origin main
```

---

## 📱 Étape 7 : Activer les Liens vers les Stores

Une fois que votre application est disponible sur l'App Store et Google Play :

### Dans index.html (Section CTA)
```html
<a href="https://apps.apple.com/app/id6758580692" class="btn btn-primary download-btn">
    Télécharger sur l'App Store
</a>
<a href="https://play.google.com/store/apps/details?id=com.scansa.app" class="btn btn-secondary download-btn">
    Obtenir sur Google Play
</a>
```

### Dans tous les fichiers (Footer)
Remplacez les liens placeholder :
```html
<a href="https://apps.apple.com/app/scansa/idXXXXXXX" class="store-button download-btn">
<a href="https://play.google.com/store/apps/details?id=com.scansa.app" class="store-button download-btn">
```

---

## ✅ Checklist de Déploiement

- [ ] Dépôt GitHub créé
- [ ] Code poussé sur GitHub
- [ ] GitHub Pages activé (branch: main)
- [ ] Fichier CNAME créé avec "scansa.fr"
- [ ] DNS configuré chez le registrar (CNAME vers votre-username.github.io)
- [ ] Domaine personnalisé configuré sur GitHub
- [ ] HTTPS configuré (désactivé si hébergeur sans SSL gratuit, ou activé avec SSL)
- [ ] Site accessible sur http://scansa.fr (ou https://scansa.fr si SSL disponible)
- [ ] Liens vers les stores activés (une fois l'app publiée)

---

## 🐛 Dépannage

### Le site ne se met pas à jour
- Vérifiez que vous avez bien poussé les changements sur GitHub
- Attendez 1-2 minutes pour que GitHub Pages déploie
- Videz le cache de votre navigateur (Ctrl + F5)

### Le domaine personnalisé ne fonctionne pas
- Vérifiez la configuration DNS chez votre registrar
- Attendez la propagation DNS (jusqu'à 48h)
- Vérifiez que le fichier CNAME contient exactement `scansa.fr`
- Vérifiez sur GitHub que le domaine est bien configuré dans Settings → Pages

### Erreur DNS_PROBE_FINISHED_NXDOMAIN
- Le domaine n'est pas encore propagé
- Vérifiez la configuration DNS
- Attendez plus longtemps pour la propagation

### HTTPS ne fonctionne pas
- **Si message d'erreur "Enforce HTTPS — Unavailable"** : Votre hébergeur ne fournit pas de certificat SSL gratuit
- **Solution immédiate** : Décochez "Enforce HTTPS" dans GitHub Pages settings (voir Étape 5 - Option A)
- **Solution long terme** : Utilisez Cloudflare (SSL gratuit) ou achetez un certificat SSL chez votre hébergeur
- Une fois le certificat SSL installé, réactivez "Enforce HTTPS"

---

## 📞 Support

Si vous rencontrez des problèmes :

- **GitHub Pages Documentation** : https://docs.github.com/en/pages
- **GitHub Desktop Help** : https://docs.github.com/en/desktop
- **Support Scansa** : support@scansa.app

---

**Bon déploiement ! 🚀**
