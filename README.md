# FS API Sample App

A sample app for getting started with the [FamilySearch API](https://familysearch.org/developers/).
The app uses the [fs-js-lite SDK](https://github.com/FamilySearch/fs-js-lite)
to show how to perform basic API operations such as authentication and loading
the current user's person.

_This app is not intended to be an example of best practices for the web._

## Try It Out

We will use [Glitch](https://glitch.com/) to copy the sample app into an online
development environment so that you can run and modify the sample app without
installing anything.

1. Follow the [Getting Started Guide](https://familysearch.org/developers/docs/guides/getting-started) to 
create a developer account and register an app. You can name the app anything you
want. We recommend it be descriptive, such as "Sample App." For the redirect URI,
just put "http://localhost". We will change that later.

    ![Create app](https://familysearch.github.io/fs-sample-app/images/create-app.png)

1. Click the "Remix on Glitch" button below to have the sample app automatically
imported into Glitch with an editor and environment ready to go.

    [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b/remix-button.svg)](https://glitch.com/edit/#!/import/github/york-solutions/fs-sample-app)

1. Click the "Show" button at the top to preview the app. Your app will be available 
at URL of the form `https://[RANDOM_APP_NAME].glitch.me/`. For example, 
`https://wiry-bass.glitch.me/`.

    ![Glitch preview](https://familysearch.github.io/fs-sample-app/images/glitch-preview.png)

1. In the FamilySearch developer center, update the registered redirect URI of 
your app, from step 1 above, to match the `glitch.me` URL of your app.

    ![Update redirect URI](https://familysearch.github.io/fs-sample-app/images/update-redirect-uri.png)

1. In the Glitch editor, open `index.js`. 

1. Modify the value of `APP_KEY` to match the app key generated in step 1 above.

1. Modify the value of `REDIRECT_URI` to match the `glitch.me` URL of your app.

    ![Update code](https://familysearch.github.io/fs-sample-app/images/update-code.png)

1. Run the app again. You can now login with FamilySearch and see it load your 
integration user's current person.