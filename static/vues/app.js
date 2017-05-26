const app = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	mixins: [vvMixin, jsoneditMixin],
	data () {
        return {
        	
        }
	},
	methods: {
		loadDbs: function() {
			url = this.query('{dbs{name}}');
			function error(err) {
				console.log(err)
			}
			function action(data) {
				store.dispatch("setDbs", data["dbs"]);
			}
			this.loadData(url, action, error);
		},
		loadTables: function(db) {
			this.reset();
			if (!db) { db = store.getters.currentDb };
			var q = '{tables(db:"'+db+'"){name}}';
			var url = this.query(q);
			function error(err) {
				console.log(err)
			}
			function action(data) {
				store.dispatch("setTables", data["tables"]);
			}
			this.loadData(url, action, error);
		},
		useDb: function(newdb) {
			store.dispatch("setCurrentDb", newdb);
			store.dispatch("setPageTitle", store.getters.currentDb);
			store.dispatch("setCurrentTable", "");
			this.loadTables(store.getters.currentDb);
			if ( this.isActive("currentDb")  === false ) {
				store.dispatch("activate", ["currentDb"])
			}
			if ( this.isActive("currentTable") === true ) {
				store.dispatch("deactivate", ["currentTable"]);
			}
			if ( this.isActive("sidebar") === false ) {
				this.activate(["sidebar"])
			}
		},
		useTable: function(db, table, oldtable) {
			this.reset();
			if ( this.isActive("currentDb") === false ) {
				this.useDb(db);
				store.dispatch("setCurrentDb", db)
			}
			if ( this.isActive("currentTable") === false ) {
				this.activate(["currentTable"]);
			}
			if ( this.isActive("docs") === false ) {
				this.activate(["docs"]);
			}
			if ( this.isActive("querybar") === false ) {
				this.activate(["querybar"]);
			}
			store.dispatch("setCurrentTable", table);
			var payload = {"table": table, "oldtable": oldtable};
		},
    	loadDb: function(db) {
    		this.reset();
    		var url = "/"+db;
			page(url);
    	},
    	reset: function() {
    		this.docs = [];
    		this.doc = {};
    	},
		countTt: function() {
			var s = "Count documents in table "+store.getters.currentTable;
			return s
		},
    	getTableUrl: function(table) {
    		var url = "/"+store.getters.currentDb+"/"+table;
    		return url
    	},
    	getTableId: function(table) {
    		var id = "btn-table-"+table;
    		return id
    	},
    	runQuery: function(q) {
    		var url = '/graphql?query={'+q+'}';
    		console.log("URL", decodeURI(url));
    		
    		function error(err) {
    			console.log("ERROR", err)
    		}
    		function action(data) {
    			var arr = data.docs;
    			//console.log("FETCHED DATA", arr);
    			var res = "";
    			var docs = [];
    			for (i=0;i<arr.length;i++) {
    				var el = arr[i];
    				var obj = JSON.parse(el.data);
    				//console.log("OBJ", obj);
    				Object.freeze(obj);
    				docs.push(obj);
    			}
    			app.deactivate(["spinner"]);
    			app.activate(["docs"]);
    			app.docs = docs;
    		}
    		this.loadData(url, action, error);
    	},
    	countQuery: function() {
    		app.activate(["spinner"]);
    		var form = this.get("querybar_form")
    		var data = this.serializeForm(form);
    		if ( store.getters.currentDb !== undefined && store.getters.currentTable !== undefined ) {
    			var q = 'count(db:"'+store.getters.currentDb+'",table:"'+store.getters.currentTable+'"){num}';
    			this.runQuery(q);
    		} else {
    			console.log("ERROR: database or table are not set")
    		}
    	},
    	makeQuery: function() {
    		app.activate(["spinner"]);
    		var form = this.get("querybar_form")
    		var data = this.serializeForm(form);
    		if ( store.getters.currentDb !== undefined && store.getters.currentTable !== undefined ) {
    			var limit = 100;
    			if (data.limit) {
    				limit = data.limit
    			}
    			var q = 'docs(db:"'+store.getters.currentDb+'",table:"'+store.getters.currentTable+'"';
    			var stropts = ""
    			if (limit !== 0) {
    				stropts = stropts+',limit:'+limit;
    			}
    			if (data.pluck) {
    				stropts = stropts+',pluck:"'+data.pluck+'"';
    			}
     			q = q+stropts+'){data}';
     			console.log(q);
     			this.runQuery(q);
    		} else {
    			console.log("ERROR: database or table are not set")
    		}
    	},
	},
});

// routes
page('/:db/:table', function(ctx, next) { app.useTable(ctx.params.db ,ctx.params.table, store.getters.currentTable) });
page('/:db', function(ctx, next) { app.useDb(ctx.params.db) });
page();

// init
app.loadDbs();
