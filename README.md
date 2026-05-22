# vialswap

Trade, earn, and own vials on the all-in-one multichain DEX.

## dev

```sh
npm install
npm run dev
```

## build

```sh
npm run build
```

## deploy (cloudflare pages)

```sh
npx wrangler login
npm run deploy      # production
npm run deploy:preview  # preview branch
```

Or auto-deploy via Git: connect the repo in Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git, with build command `npm run build` and output dir `dist`.
