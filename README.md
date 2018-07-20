# Modjo logbook

A [PWA](https://developers.google.com/web/progressive-web-apps/) to record sends at the local bouldering gym, built on [React](https://reactjs.org/), [Redux](https://redux.js.org/), [Firebase](https://firebase.google.com/) and [Firebase](https://firebase.google.com/docs/firestore/). Designed to run on Firebase free plan.

It's built around the local gym I go to, but should be decently easy to fork and adapt for yours (the hardest migration step would probably be adapting the SVG map).

## Run it

### Setup

Here's what you'll need:

- A [Firebase](https://firebase.google.com/) project, with Firestore DB and Google/Facebook auth enabled. Change the config in `firebase.js`. You may want a separate project for dev and prod.
- A [Facebook app](https://developers.facebook.com/) with Facebook log-in enabled, necessary to enable Facebook login in the Firebase project authentication config via Firebase Web UI.
- The [firebase CLI](https://firebase.google.com/docs/cli/) installed and configured for your project.

You can then clone this repo and configure your dev firebase project:

```
cd modjo-logbook
firebase use $YOUR_DEV_FIREBASE_APP_NAME
firebase deploy --only firestore
yarn install
```

### Start the app in dev

```
yarn start
```

### Tests

This is a toy side-project and its test suite is not remotely up to professional standards, but it has a few unit tests you can run with:

```
yarn test
```

### Deploy

Make a production build and deploy your files to Firebase with:

```
yarn build
firebase -P $YOUR_PROD_FIREBASE_APP_NAME deploy
```

### Tech stack

This project:

- runs on the [Google Firebase](https://firebase.google.com/) platform and the [Google Firestore](https://firebase.google.com/docs/firestore/) DB
- is bootstrapped and built via with [Create React App](https://github.com/facebookincubator/create-react-app) (not ejected)
- uses [React](https://reactjs.org/), [Redux](https://redux.js.org/), [react-redux](https://github.com/reduxjs/react-redux) bindings and [redux-saga](https://redux-saga.js.org/) for complex actions
- is styled with [material-ui](https://material-ui.com/) and [JSS](https://github.com/cssinjs/jss)

## Design

### Domain model

- **boulder**: In the real world, a boulder, or bouldering problem, is a succession of holds on the wall that you must climb from start to finish without falling. In the app it is identified by its color (indicative of its difficulty) and sector (place in the gym where it is located), with the built-in assumption that there's at most one boulder of any given color on a given sector.
- `send`: Sends are the main model in the app, which is really all about users recording their sends, i.e. when they "send" (climb to the top without falling) a "boulder". A send is defined by its sector, color, type (redpoint, flash or clear), date (date of report/record creation is assumed as send date) and user.
- `clear`: Occasionally, the routesetters will rip off all the holds in a given sector and either leave it empty for a while or set new boulders in there. In the app code, that event is called a clear. When a user has reported a given sector was cleared, it lets them report new sends on that sector afterwards. Clears are represented as colorless sends of type `clear` (arguably confusing, in retrospect perhaps I should have called the both events and kept "send" for actual real-world sends, but I made it too early and sticked with it for too long so now, all over the codebase, `sends` amibguously refer to either actual real-world sends - type redpoint or flash - or sends+clears ; the latter is especially true in collections, i.e. `sendList` actually means a list of both sends and clears)
- `user`: Signed in and stored with Firebase Auth with Firestore storage, via Google or Facebook OAuth sign-in.
- `colors`, `sectors` and `sendType`: Each module defines the available colors and sectors in the gym, along with their config (color hues for the colors, SVG paths for the sectors, labels, abbreviations for use in the compressed Firestore collections - see below -, etc.)
- **collections**: functional modules that offer methods and a basic structure to store and retrieve sends in different ways:
  - **stored**: Some collections (`sendList` and `sendSummary`) are stored in Firestore. They are designed to work around Firestore's price and limitations:
    - **characteristics**:
      - each collection aims to be stored in a single Firestore document: to mitigate the per-document-read cost of Firestore (pet project here) if we stored and read each send as individual docs
      - they strive to use the minimum possible amount of chars for keys and ids to keep the 1MB/document limit at bay. To that end, they use short keys/ids for storage that should remain internal, only ever be referenced by functions inside the `sendList`/`sendSummary` module and shouldn't leak into the rest of the app.
      - when they do get too big, they're automatically trimmed to avoid overflow: a saga action is triggered that removes the oldest sends from the main collection and archives them to another document
      - though they represent lists, they're implemented as linked lists in a JS object because Firestore doesn't support storing arrays
      - they're synced in realtime using Firestore's `onSnapshot` subscriptions. When the app's global `sendSummary` changes, all clients get the new updated one. A given user receives updates on their own `sendMap` unless they're signed out (no stored `sendList`) or watching the logbook of another user (then they get updates on that user's `sendList`)
      - they're only ever updated in transactions, to avoid race-conditions updating those complex objects
      - functional collections: all the functions in their respective modules are non-mutating, they're only meant to be browsed and modified via those functions (consider their structure private)
    - **collections**:
      - `sendList`: List of sends for a given user. There's one stored per user and it's kept
      - `sendSummary`: List of sends for all users. Contains a hash of users, assigns them a short id (to save storage bytes), and uses a `sendList` under the hood to store and order everyone's sends. Each send references the short id of its user (as opposed to `sendList` where the single owner is the document's id)
  - **calculated**: The remaining collections are calculated from the stored ones (directly or indirectly), and usually cached using `reselect`:
    - `sendMap`: from `sendList`, stores the current send status for each color/sector pair, depending on whether it was never sent, last sent (actual send) or last cleared. Used to display the colors on the gym's map when a color is selected, and to generate the `colorMap`
    - `colorMap`: from `sendMap`, stores the highest color sent by the user on any given sector. Used to display the colors on the gym's map when no color is selected
    - `ranking`: from `sendSummary`, stores a ranking of users sorted by those who have sent the most boulders in the highest possible colors in the last 3 months. Used to display the ranking table

### Gym plan

The map is a SVG rendered dynamically with React and CSS. Here's how it was generated, in case you want to make your own:

1. SVG created in a vector graphics software generating human-friendly SVG code (I used [gravit.io](https://designer.gravit.io/), see `design/plan.gvdesign`). Basially you want your SVG file generating a bunch of SVG paths:
  - one for each sector's click zone
  - one for each wall of the gym, to use as SVG clip paths over the sectors for highlights and selection.
2. Exported as SVG
3. Cleaned up the SVG using [svgo](https://github.com/svg/svgo) (or its Web UI [svgomg](https://jakearchibald.github.io/svgomg/))
4. Split the SVG into React components:
  - the bulk goes into `src/component/Plan.js`
  - the paths for each sector's click zone go into the `src/models/sectors.js` config file
  - the sectors rendering happens `src/component/Sector.js`, in particular the dynamic CSS for how they change color depending on the state of the app is defined there

## Copyright

- The Modjo logos and map are the property of the [Modjo Escalade](http://www.modjo-escalade.fr/) climbing gym, left here for example purposes with their permission. Please don't reuse them without their permission.
- The Google and Facebook logos used for sign-in are the property of their respective owner
- The rest of the code is free for you to use and modify under the terms of the MIT license
