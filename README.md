Rethinkdb Editor
================

Manage [Rethinkdb](http://rethinkdb.com/) databases and edit content

Techs
-----

- Backend: Go stdlib with [Chi router](https://github.com/pressly/chi)

- Frontend: [Vue.js](http://vuejs.org/) for data binding, [Axios](https://github.com/mzabriskie/axios) for http operations 
and [Page.js](https://github.com/visionmedia/page.js) for client-side routing

- API: Graphql endpoint with [Goregraph](https://github.com/synw/goregraph)

Install and run
---------------

   ```bash
   go get github.com/synw/rethinkdb-editor
   go install github.com/synw/rethinkdb-editor
   ```

Grab the generated binary file and create a `config.json` file in the same folder than the binary. 
Set your database location and credentials:

   ```javascript
   {
	"addr":"localhost:28015",
	"user":"username",
	"password":"password"
	}
   ```

Then run and open `http://localhost:8080`

*Note*: this app is still under heavy development