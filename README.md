<img alt="OrderUp HookUp" align="right" src="https://regexpressyourself.github.io/public/ohlogo.png" width="400px"/>

# OrderUp HookUp

OrderUp HookUp is the answer to the question "What's for dinner?"

Can't decide what you're in the mood for? Just put in your location and see what shows up!

[See it live here!](http://www.orderuphookup.com/)

## Table of Contents

1. [Getting Started](#getting-started)
3. [Deployment](#deployment)
2. [Built With](#built-with)
3. [Contributing](#contributing)
3. [Authors](#authors)
3. [License](#license)


## Introduction

OrderUp HookUp is a stripped down front end for Yelp's API, with mobile-first design principles at the forefront. OrderUp HookUp is meant to be a general-purpose food finder, giving you a map, phone number, photo, and category for nearby restaurants. The simple, intuitive design makes it easy to quickly see what's nearby and decide on what to eat.

## Getting Started

OrderUp HookUp uses Node and Express on the backed, and Angular on the front end. 

### Prerequisites

#### API Access

To run OrderUp HookUp, you will need access to [Yelp's Fusion API](https://www.yelp.com/developers/documentation/v3). You can start that process [here](https://www.yelp.com/developers/documentation/v3/get_started).

Once you have an id and a secret, you will need to generate a token. This is done with the following command (replacing `YOUR_ID` and `YOUR_SECRET` with your Yelp access id and secret, respectively):

``` 
curl    -d grant_type=client_credentials  \
        -d client_id=YOUR_YELP_ID         \
        -d client_secret=YOUR_YELP_SECRET \
        'https://api.yelp.com/oauth2/token'
```

The access_token that is returned still needs to be made available to OrderUp HookUp, however. This is done using the [dotenv](https://www.npmjs.com/package/dotenv) library.

The token should be declared in a file named `.env` located in the project root. The `.env` file should take the following form:

```
   YELPTOKEN=YOUR_ACCESS_TOKEN
```

With that completed, you are ready to build the app!


#### Tech

To build OrderUp HookUp, you will need Node and either NPM or Yarn installed. [You can download Node here](https://nodejs.org/en/download/). This will install NPM as well.

You are welcome to use [Yarn](https://yarnpkg.com/en/) instead of NPM if you prefer.

### Installing

First, clone the project to a local directory.

```
   git clone https://github.com/regexpressyourself/OrderUp-HookUp.git && cd OrderUp-HookUp
```

Next, install the dependencies using NPM or Yarn.

#### Using NPM

```
   npm install
```

#### Using Yarn

```
   yarn install
```


**[Back to top](#table-of-contents)**

## Deployment

To deploy OrderUp HookUp, you simply need to run the `start` script declared in `package.json`. This will run the `./bin/www` file with Node and serve the app locally.

#### Using NPM

```
   npm run start
```

#### Using Yarn

```
   yarn run start
```

   That's it! Your development server is running at [http://localhost:3000](http://localhost:3000)
   

**[Back to top](#table-of-contents)**

## Built With

* [Angular v. 1](https://angularjs.org/) - The front end framework that powers the site
* [Node](https://nodejs.org/en/) - The backend server
* [Express](https://expressjs.com/) - Handles all routing in the server
* [EJS](http://ejs.co/) - The templating language used to go from Angular data to HTML

**[Back to top](#table-of-contents)**

## Contributing

I'm always happy to receive pull requests, questions/issues regarding code, and feature requests on all my projects. Please feel free to open an issue or submit a pull request.

**[Back to top](#table-of-contents)**

## Authors

* **[Sam Messina](https://www.github.com/regexpressyourself)** - *Sole Developer* 

**[Back to top](#table-of-contents)**

## License

OrderUp HookUp is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


**[Back to top](#table-of-contents)**













OrderUp HookUp is the answer to the question "What's for dinner?"

Can't decide what you're in the mood for? Just put in your location and see what shows up!

## Tech

OrderUp HookUp uses Yelp's Fusion API v3 and Google Places and Maps APIs for data. 

The backend is running Node.js with Express. The front end is running Angular 1.5.8 and Extended JavaScript to handle and dynamically display different data. 

Twitter Bootstrap and regular HTML, CSS, and Javascript are all used for design. All logo design was done on Adobe Illustrator and Photoshop.

## Note

In order to protect sensitive data, I created this repository to provide a public-facing version of the codebase. While all the functionality is the same, access tokens, passwords, etc. have been removed. As a result, the commit history from development is not reflected here.

