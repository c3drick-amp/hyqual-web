# React + Vite

## Firebase integrations

Device registrations written to Firestore `devices` are recorded by the
`auditDeviceRegistration` Cloud Function. Deploy it with `firebase deploy
--only functions` after installing the dependencies in `functions/`.

Approved-account email is queued in the Firestore `mail` collection. Install
and configure the Firebase Trigger Email extension (`firebase/firestore-send-email`)
to deliver those messages; configure SMTP credentials in the extension, not in
the web app.

The mobile signup client should create its Firebase Authentication account and
submit the owner's `firstName`, `middleName`, `lastName`, `farmName`, `city`,
`barangay`, `province`, `zip`, `email`, `role`, and `userId` to `approvals`.
Do not send or store a password hash in Firestore. Firebase Authentication
handles password hashing and credential storage. For a device registration,
write a `devices` document with a string `farmId` owned by the authenticated
user and a `registeredBy` UID; new documents are audited server-side.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
