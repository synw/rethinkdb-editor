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
    "host": "localhost:8080",
	"addr":"localhost:28015",
	"user":"username",
	"password":"password"
	}
   ```

Then run and open `http://localhost:8080`

*Note*: this app is still under heavy development

## Roadmap

- [x] Backend: translate graphql queries to reql queries
- [x] Backend: graphql server
- [x] Explore databases and tables
- [x] Fetch arbitrary documents from the database
- [x] Format documents and detect types
- [ ] Add document
- [ ] Query timeout
- [ ] Basic inline edit features
- [ ] Add option to use Codemirror to edit some fields
- [ ] Backend mutations to save document
- [ ] Users and permissions management
- [ ] Alternate simplified ui for editors with limited rights
- [ ] Display more info in ui about query results
- [ ] Delete documents
- [ ] Create databases and tables
- [ ] Table level imutability option
- [ ] Start with the collaborative editor feature

## Todo

- [ ] Nested pluck queries
- [ ] Secondary indexes queries
- [ ] Range queries
- [ ] Detect date type and use date picker widget
