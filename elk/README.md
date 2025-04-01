<p align="center">
  <a href="https://elk.zone" target="_blank" rel="noopener noreferrer">
    <img width="160" height="160" src="./public/logo.svg" alt="Elk logo">
  </a>
</p>

<h1 align="center"/>Elk <sup><em>alpha</em></sup></h1>

<p align="center">
A nimble Akkoma web client
</p>

<br/>
<p align="center">
  <a href="https://chat.elk.zone"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
  <a href="https://volta.net/elk-zone/elk?utm_source=elk_readme"><img src="https://user-images.githubusercontent.com/904724/209143798-32345f6c-3cf8-4e06-9659-f4ace4a6acde.svg" alt="Open board on Volta"></a>
</p>
<br/>

<p align="center">
  <a href="https://elk.zone/" target="_blank" rel="noopener noreferrer" >
    <img src="./public/elk-og.png" alt="Elk screenshots" width="600" height="auto">
  </a>
</p>

## ⚠️ Elk is in Alpha

It is already quite usable, but it isn't ready for wide adoption yet. We recommend you use it if you would like to help us build it. We appreciate your feedback and contributions. Check out the [Open Issues](https://github.com/elk-zone/elk/issues) and jump in the action. Join the [Elk discord server](https://chat.elk.zone) to chat with us and learn more about the project.

## Deployment

### Official Deployment

Our team maintains a deployment at:

- 🐙 Canary: [mangane.bdx.town](https://mangane.bdx.town)

### Self-Host Docker Deployment

In order to host Elk yourself you can use the provided Dockerfile to build a container with elk. Be aware, that Elk only loads properly if the connection is done via SSL/TLS. The Docker container itself does not provide any SSL/TLS handling. You'll have to add this bit yourself.
One could put Elk behind popular reverse proxies with SSL Handling like Traefik, NGINX etc.

> We also provide ready-to-use docker image on this repo's release page. Please look at the `elk.zip` file included in each release.

1. checkout source ```git clone https://github.com/elk-zone/elk.git```
1. got into new source dir: ```cd elk```
1. create local storage directory for settings: ```mkdir elk-storage```
1. adjust permissions of storage dir: ```sudo chown 911:911 ./elk-storage```
1. start container: ```docker-compose up --build -d```

> [!NOTE]
> The provided Dockerfile creates a container which will eventually run Elk as non-root user and create a persistent named Docker volume upon first start (if that volume does not yet exist). This volume is always created with root permission. Failing to change the permissions of ```/elk/data``` inside this volume to UID:GID 911 (as specified for Elk in the Dockerfile) will prevent Elk from storing it's config for user accounts. You either have to fix the permission in the created named volume, or mount a directory with the correct permission to ```/elk/data``` into the container.

## 🧑‍💻 Contributing

We're really excited that you're interested in contributing to Elk! Before submitting your contribution, please read through the following guide.

### Local Setup

Clone the repository and run on the root folder:

```
npx yarn
cd akko && npx yarn build && cd ..
cd elk
npx yarn dev
```

`Warning`: you will need `corepack` enabled, check out the [Elk Contributing Guide](./CONTRIBUTING.md) for a detailed guide on how to set up the project locally.

## 📲 PWA

You can consult the [PWA documentation](https://docs.elk.zone/pwa) to learn more about the PWA capabilities on Elk, how to install Elk PWA in your desktop or mobile device and some hints about PWA stuff on Elk.

## 🦄 Stack

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Nuxt](https://nuxt.com/) - The Intuitive Web Framework
- [Vue](https://vuejs.org/) - The Progressive JavaScript Framework
- [VueUse](https://vueuse.org/) - Collection of Vue Composition Utilities
- [Pinia](https://pinia.vuejs.org/) - The Vue Store that you will enjoy using
- [Vue Macros](https://vue-macros.sxzz.moe/) - More macros and syntax sugar for Vue
- [UnoCSS](https://uno.antfu.me/) - The instant on-demand atomic CSS engine
- [Iconify](https://github.com/iconify/icon-sets#iconify-icon-sets-in-json-format) - Iconify icon sets in JSON format
- [Masto.js](https://neet.github.io/masto.js) - Mastodon API client in TypeScript
- [shiki](https://shiki.style/) - A beautiful yet powerful syntax highlighter
- [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) - Prompt for update, Web Push Notifications and Web Share Target API

## 👨‍💻 Contributors

<a href="https://github.com/elk-zone/elk/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=BDX-town/elk" />
</a>

## 📄 License

[MIT](./LICENSE) &copy; 2022-PRESENT Mangane and Elk contributors
