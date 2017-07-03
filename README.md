Ryde Board
==================================

- ES6 support via [babel](https://babeljs.io)
- REST resources as middleware via [resource-router-middleware](https://github.com/developit/resource-router-middleware)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)

> Tip: If you are using [Mongoose](https://github.com/Automattic/mongoose), you can automatically expose your Models as REST resources using [restful-mongoose](https://git.io/restful-mongoose).

Docker Support
------
```sh

# Build your docker
docker build -t es6/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 8080:8080 es6/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```

Install
-------------------------
Before using the service you must run the following commands in your terminal

**Yarn**
```sh
$ yarn install
```
**NPM**
```sh
$ npm install
```

Start Development
-------------------------
To run project locally with hot reloading whenever code is changed inside the project use the following commands.

**Yarn**
```sh
$ PORT=8080 yarn dev # Set port manually
$ yarn dev # Automatically sets port to 8080
```
**NPM**
```sh
$ PORT=8080 npm dev # Set port manually
$ npm dev # Automatically sets port to 8080
```

Deploy
-------------------------
If you have a [now.sh](https://now.sh) account setup. Running the following command will deploy an instance of this service to your account.

**Yarn**
```sh
$ yarn deploy
```
**NPM**
```sh
$ npm deploy
```


Docker Demo
-------------------------
It's supposed to be pretty easy to take your Docker to your favourite cloud service, here's a demo of what's our Dockerized bolierplate is like: [Ride endpoint](https://rydeboard-dev.now.sh/api/rides)

License
-------

MIT
