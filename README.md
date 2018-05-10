# Pinterest Clone

## Running the App

Install the dependencies.

```bash
npm install
```

Rename `.env.example` to `.env` and replace the values for `AUTH0_CLIENT_ID`, `AUTH0_DOMAIN`, and `AUTH0_CLIENT_SECRET` with your Auth0 credentials. If you don't yet have an Auth0 account, [sign up](https://auth0.com/signup) for free.

```bash
# copy configuration and replace with your own
cp .env.example .env
```

Run the app.

```bash
npm start
```

The app will be served at `localhost:3000`.

## Running the Sample With Docker

In order to run the example with docker you need to have `docker` installed.

You also need to set the environment variables as explained [previously](#running-the-sample).

Execute in command line `sh exec.sh` to run the Docker in Linux, or `.\exec.ps1` to run the Docker in Windows.

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
