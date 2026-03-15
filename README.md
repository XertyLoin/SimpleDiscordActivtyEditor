# 🎮 Discord Activity Editor

A modern and sleek Discord Rich Presence editor built with Electron and React. Customize your Discord status with style!

## ✨ Features

- **💎 Premium Interface**: Modern design with Glassmorphism effects and smooth animations.
- **⚡ RPC 2.0**: Instant status updates. Change your text and images without restarting.
- **🛠️ All Activity Types**: Full support for "Playing", "Listening", "Watching", "Streaming", and "Competing".
- **🎥 Streaming Support**: Add your Twitch or YouTube links to display the purple streaming icon.
- **📚 Layout Library**: Save your configurations with custom names to find them easily later.
- **🔔 Notification System**: Elegant built-in notifications (Toasts) to confirm your actions.
- **🚀 Auto-Update**: The application automatically checks for new versions on startup.

## 📥 Installation

### 🪟 Windows
1. Download the `.exe` file (Installer or Portable) from the **Releases** tab.
2. Run the installer for a full installation or use the portable version for immediate use.

### 🐧 Linux (AppImage)
The Linux version is distributed in **AppImage** format, which allows running the application without complex installation.
1. Download the `.AppImage` file from the **Releases**.
2. Right-click the file -> **Properties** -> **Permissions** tab.
3. Check the box **"Allow executing file as program"**.
4. Double-click the file to launch the editor.
   *Alternatively, via terminal:*
   ```bash
   chmod +x Discord-Activity-Editor-1.0.0.AppImage
   ./Discord-Activity-Editor-1.0.0.AppImage
   ```

## ⚙️ Configuration (Quick Guide)

To use this software, you need to create an application on the Discord Developer Portal:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **"New Application"** and give it the name you want to see appear on your profile.
3. In the **"General Information"** tab, copy the **APPLICATION ID**.
4. Paste this ID into the **Client ID** field in this editor.
5. (Optional) In **"Rich Presence" -> "Art Assets"**, upload your images and use their names as "Keys" in the editor.

## 🛠️ Development

If you want to modify the code:

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Start Electron
npm start

# Build for Windows/Linux
npm run pack:win
npm run pack:linux
```

---
Developed with ❤️ by **BlueDev**
