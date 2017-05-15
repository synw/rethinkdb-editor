const app = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	mixins: [vvMixin],
	data () {
        return {
        	
        }
	},
	methods: {
		loadDbs: function() {
			url = this.query('{dbs{name}}');
			function error(err) {
				console.log(err)
				//console.log("ERROR loadDbs: "+err)
			}
			function action(data) {
				store.dispatch("setDbs", data["dbs"]);
			}
			this.loadData(url, action, error);
		},
		loadTables: function(db) {
			if (!db) { db = store.getters.currentDb };
			var q = '{tables(db:"'+db+'"){name}}';
			var url = this.query(q);
			function error(err) {
				console.log(err)
				//console.log("ERROR loadTables: "+err)
			}
			function action(data) {
				store.dispatch("setTables", data["tables"]);
			}
			this.loadData(url, action, error);
		},
		useDb: function(newdb) {
			//console.log("USE DB", newdb, 'TABLE:', this.currentTable);
			store.dispatch("setCurrentDb", newdb);
			store.dispatch("setPageTitle", store.getters.currentDb);
			//console.log("useDb / table", store.getters.currentTable);
			store.dispatch("deactivateTableBtn", store.getters.currentTable);
			store.dispatch("setCurrentTable", "");
			this.loadTables(store.getters.currentDb);
			if ( this.isActive("currentDb")  === false ) {
				store.dispatch("activate", ["currentDb"])
			}
			if ( this.isActive("currentTable") === true ) {
				store.dispatch("deactivate", ["currentTable"]);
			}
		},
		useTable: function(db, table, oldtable) {
			//console.log("USE TABLE", table, "OLD TABLE", oldtable);
			if ( this.isActive("currentDb") === false ) {
				this.useDb(db);
				store.dispatch("setCurrentDb", db)
			}
			if ( this.isActive("currentTable") === false ) {
				store.dispatch("activate", ["currentTable"]);
			}
			store.dispatch("setCurrentTable", table);
			store.dispatch("activate", ["currentTable"]);
			var payload = {"table": table, "oldtable": oldtable};
			store.dispatch("activateTableBtn", payload);
		},
    	loadDb: function(db) {
    		var url = "/"+db;
			page(url);
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
    			var arr = data.getAll;
    			console.log("FETCHED DATA", arr);
    			var res = ""
    			for (i=0;i<arr.length;i++) {
    				var el = arr[i];
    				console.log("DATa", el);
    				var obj = JSON.parse(el.data);
    				console.log("OBJ", obj);
    				//res = res+JSON.parse(d.data);
    				//console.log("RES", res);
    			}
    		}
    		this.loadData(url, action, error);
    	},
    	makeQuery: function() {
    		var form = this.get("querybar_form")
    		var data = this.serializeForm(form);
    		if ( store.getters.currentDb !== undefined && store.getters.currentTable !== undefined ) {
    			var limit = 100;
    			if (data.limit) {
    				limit = data.limit
    			}
    			var q = 'getAll(db:"'+store.getters.currentDb+'",table:"'+store.getters.currentTable+'"';
    			var stropts = ""
    			if (limit !== 0) {
    				stropts = stropts+',limit:'+limit;
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
