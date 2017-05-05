Rethinkdb Editor
================

Manage [Rethinkdb](http://rethinkdb.com/) databases and edit content

Techs
-----

- Backend: Go stdlib with [Chi router](com/pressly/chi)

- Frontend: [Vue.js](http://vuejs.org/) for data binding, [Axios](https://github.com/mzabriskie/axios) for http operations 
and [Page.js](https://github.com/visionmedia/page.js) for client-side routing

- API: Graphql endpoint

Install and run
---------------

   ```bash
   go get github.com/synw/rethinkdb-editor
   go install github.com/synw/rethinkdb-editor
   ```

Create a `config.json` file in the same folder than the binary:

   ```javascript
   {
	"addr":"localhost:28015",
	"user":"username",
	"password":"password"
	}
   ```

Then run and open `http://localhost:8080`

API
---

Example graphql queries:

   ```bash
   # get a list of databases
   curl -g 'http://localhost:8080/graphql?query={dbs{name}}'
   
   # get a list of tables in a database
   curl -g 'http://localhost:8080/graphql?query={tables(db:"rethinkdb"){name}}'
   ```


*Note*: this app is still under heavy development