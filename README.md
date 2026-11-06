# PathFinder Africa

A phone app that helps young people in Africa discover their strengths, explore careers and make good decisions about school. English and French. Works offline once it is installed.

Founded by Samanta.

## What is in this folder

| File | What it does |
|---|---|
| `index.html` | The app screens: Discover, Decide, Mentor, Help |
| `style.css` | Colours, layout, light and dark mode |
| `data.js` | **All the content**: questions, careers, advice, translations. Edit this file to change what the app says. |
| `app.js` | The logic: quiz, scoring, tabs, language, saving answers |
| `sw.js` | Service worker: saves the app on the phone so it works without internet |
| `manifest.webmanifest` | Tells the phone the app's name, icon and colours so it can be installed |
| `icons/` | App icons |

The whole app is about 100 KB, so it is quick to install even on slow mobile data.

## Step 1: Try it on your computer

The app must be served by a web server (opening `index.html` directly won't turn on offline mode). In this folder, run:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in Chrome. Press F12, then the phone icon, to see it as a phone.

## Step 2: Put it online for free (GitHub Pages)

1. Create a free account at github.com.
2. Create a new public repository named `pathfinder-africa`.
3. Click **Add file → Upload files** and drag in everything from this folder, including the `icons` folder.
4. Go to **Settings → Pages**. Under **Branch**, choose `main` and `/ (root)`, then **Save**.
5. After a minute your app is live at `https://YOUR-USERNAME.github.io/pathfinder-africa/`.

## Step 3: Install it on a phone

**Android (Chrome):** open the link. Tap **Install** on the card the app shows, or open the ⋮ menu and choose **Add to Home screen** / **Install app**.

**iPhone (Safari):** open the link, tap the Share button, then **Add to Home Screen**.

After that, PathFinder opens from the home screen like any other app, and works without internet.

Share the link on WhatsApp, or print it as a QR code for schools and youth groups.

## Step 4 (later): Publish on the Google Play Store

1. Go to https://www.pwabuilder.com and paste your GitHub Pages link.
2. Choose **Package for stores → Android**. It builds the Play Store file for you.
3. Create a Google Play developer account (one-time fee of US$25), upload the file and follow the steps.

Play Store apps for young people need a privacy policy and must follow Google's rules for apps that children and teenagers use. Read the Google Play "Families" policy before you submit.

## How to change the content

Everything the app says is in `data.js`.

- **Add a question:** copy one item in `QUESTIONS` and change the text. Keep the 5 answers in this order: Builder, Creator, Helper, Entrepreneur, Explorer.
- **Add a career:** add `["English name","Nom français","U"]` to a profile's `paths` (`U` = university, `V` = vocational, `B` = both), then add its description to `DESC` using the same English name.
- **Change any text:** find it in `T.en` or `T.fr`.

**Important:** after changing any file, open `sw.js` and raise the version number (`pathfinder-v2` → `pathfinder-v3`). Otherwise, phones that already installed the app will keep showing the old version.

## Before giving it to young people

- Ask a counsellor to check the advice, and add real local helpline numbers to the `safety` text in `data.js`.
- Test it with a small group first and ask what confused them.
