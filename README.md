# wateringcan

A tool for managing growth and skills development, and maybe continuous feedback as well

## Install deps

```
pushd wateringcan-web
npm i
popd
pushd wateringcan-server
npm i
knex migrate:latest
knex seed:run
popd
```

## Run the webserver

```
cd wateringcan-server
npm run dev
```

## Run the frontend
```
cd wateringcan-web
npm run start
```

