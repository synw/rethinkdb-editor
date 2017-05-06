const app = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	mixins: [vvMixin],
	data () {
        return {
        	databases: [],
        	tables: [],
        	currentDb: "",
        	currentTable: "",
        	pageTitle: "Rethinkdb editor",
        	sidebar: "",
        	activeTableBtn: "",
        }
	},
	methods: {
		loadDbs: function() {
			url = this.query('{dbs{name}}');
			function error(err) {
				console.log(err)
			}
			function action(data) {
				app.databases = data["dbs"];
			}
			this.loadData(url, action, error);
		},
		loadTables: function(db) {
			var q = '{tables(db:"'+db+'"){name}}';
			var url = this.query(q);
			function error(err) {
				console.log(err)
			}
			function action(data) {
				app.tables = data["tables"];
				app.loadSidebar(app.formatTables(db));
			}
			this.loadData(url, action, error);
		},
		useDb: function(newdb) {
			//console.log("USE DB", newdb, 'TABLE:', this.currentTable);
			this.currentDb = newdb;
			this.pageTitle = this.currentDb;
			this.loadTables(this.currentDb);
			if ( this.isActive("currentDb") === false ) {
				this.activate(["currentDb"])
			}
		},
		useTable: function(db, table) {
			//console.log("USE TABLE", table);
			if ( this.isActive("currentDb") === false ) {
				this.useDb(db);
			}
			if ( this.isActive("currentTable") === false ) {
				this.activate(["currentTable"]);
			} 
			if ( this.activeTableBtn ) {
    			this.deactivateTableBtn()
    		} 
			// TOFIX: not working when coming from direct url in browser
			try {
				this.activateTableBtn(table);
			} catch(err) { console.log(err) };
			this.currentTable = table;
		},
		loadSidebar: function(content) {
    		this.sidebar = content;
    	},
    	loadDb: function(db) {
    		this.currentTable = "";
    		this.deactivate(["currentTable"]);
    		if ( this.activeTableBtn ) {
    			this.deactivateTableBtn()
    		}
    		var url = "/"+db;
			page(url);
    	},
    	getDb: function(db) {
    		this.currentTable = "";
    		this.deactivate(["currentTable"]);
    		this.useDb(db);
    	},
		formatTables: function(db) {
			var tb = ""
			for (i=0;i<this.tables.length;i++) {
				var t = this.tables[i].name;
				var l = "/"+db+"/"+t;
				btn = '<div id="table-'+t+'">';
				btn = btn+'<a href="'+l+'"><button id="btn-table-'+t+'" class="btn-default" onclick="page(\''+l+'\')">';
				//btn = btn+'<i class="fa fa-check fa-lg" style="color:green;"></i>'
				btn = btn+''+this.tables[i].name+'</button></a></div>';
				tb = tb+btn;
			}
			return tb
		},
		deactivateTableBtn: function() {
			var btn = this.get("btn-"+this.activeTableBtn);
			btn.style["background-color"] = "transparent";
			btn.style["color"] = "darkslategrey";
			this.activeTableBtn = "";
		},
		activateTableBtn: function(table) {
			this.activeTableBtn = "table-"+table;
			var btn = this.get("btn-"+this.activeTableBtn);
			btn.style["background-color"] = "#f0ead6";
			btn.style["color"] = "#388E8E";
		},
		countTt: function() {
			var s = "Count documents in table "+this.currentTable;
			return s
		}
	},
});

// routes
page('/:db/:table', function(ctx, next) { app.useTable(ctx.params.db ,ctx.params.table) });
page('/:db', function(ctx, next) { app.getDb(ctx.params.db) });
page();

// init
app.loadDbs();
