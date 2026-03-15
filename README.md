# 🎮 Discord Activity Editor

Un éditeur de Rich Presence pour Discord, moderne et élégant, construit avec Electron et React. Personnalisez votre statut Discord avec style !

![App Icon](public/icon.png)

## ✨ Fonctionnalités

- **💎 Interface Premium** : Design moderne avec effets de flou (Glassmorphism) et animations fluides.
- **⚡ RPC 2.0** : Mise à jour instantanée de votre statut. Changez vos textes et images sans redémarrer.
- **🛠️ Tous types d'activités** : Support complet pour "Joue à", "Écoute", "Regarde", "Stream" et "En compétition".
- **🎥 Support Streaming** : Ajoutez vos liens Twitch ou YouTube pour afficher l'icône de stream violette.
- **📚 Bibliothèque de Layouts** : Sauvegardez vos configurations avec des noms personnalisés pour les retrouver plus tard.
- **🔔 Système de Notifications** : Notifications intégrées élégantes (Toasts) pour confirmer vos actions.
- **🚀 Auto-Update** : L'application vérifie automatiquement les nouvelles versions au démarrage.

## 📥 Installation

### 🪟 Windows
1. Téléchargez le fichier `.exe` (Installer ou Portable) depuis l'onglet **Releases**.
2. Lancez l'installateur pour une installation complète ou utilisez la version portable pour un usage immédiat.

### 🐧 Linux (AppImage)
La version Linux est distribuée au format **AppImage**, ce qui permet de lancer l'application sans installation complexe.
1. Téléchargez le fichier `.AppImage` depuis les **Releases**.
2. Faites un clic droit sur le fichier -> **Propriétés** -> Onglet **Permissions**.
3. Cochez la case **"Autoriser l'exécution du fichier comme un programme"**.
4. Double-cliquez sur le fichier pour lancer l'éditeur.
   *Alternativement, via le terminal :*
   ```bash
   chmod +x Discord-Activity-Editor-1.0.0.AppImage
   ./Discord-Activity-Editor-1.0.0.AppImage
   ```

## ⚙️ Configuration (Guide Rapide)

Pour utiliser ce logiciel, vous devez créer une application sur le portail développeur de Discord :

1. Rendez-vous sur le [Discord Developer Portal](https://discord.com/developers/applications).
2. Cliquez sur **"New Application"** et donnez-lui le nom que vous voulez voir apparaître sur votre profil.
3. Dans l'onglet **"General Information"**, copiez l'**APPLICATION ID**.
4. Collez cet ID dans le champ **Client ID** de cet éditeur.
5. (Optionnel) Dans **"Rich Presence" -> "Art Assets"**, uploadez vos images et utilisez leurs noms comme "Keys" dans l'éditeur.

## 🛠️ Développement

Si vous souhaitez modifier le code :

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Lancer Electron
npm start

# Construire pour Windows/Linux
npm run pack:win
npm run pack:linux
```

---
Développé avec ❤️ par **BlueDev**
