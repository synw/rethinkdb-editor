const app = new Vue({
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
		useDb: function(newdb) {
			this.currentDb = newdb;
			this.pageTitle = this.currentDb;
			this.loadTables(newdb);
		},
		loadTables: function(db) {
			var q = '{tables(db:"'+db+'"){name}}';
			var url = this.query(q);
			function error(err) {
				console.log(err)
			}
			function action(data) {
				app.tables = data["tables"];
				app.loadSidebar(app.formatTables());
			}
			this.loadData(url, action, error);
		},
		formatTables: function() {
			var tb = ""
			for (i=0;i<this.tables.length;i++) {
				tb = tb+"<div class=\"btn-sidebar\"><button>"+this.tables[i].name+"</button></div>"
			}
			return tb
		},
		loadSidebar: function(content) {
    		this.sidebar = content;
    	},
	},
	watch: {
		currentDb: function (newdb) {
			this.useDb(newdb);
		}
	},
});

app.loadDbs();

