const store = new Vuex.Store({
	state: {
		active: [],
		dbs: [],
    	tables: [],
    	currentDb: "",
    	currentTable: "",
    	//docs: [],
    	pageTitle: "Rethinkdb editor",
	},
	mutations: {
		activate(state, elems) {
			for (i=0;i<elems.length;i++) {
				state.active.push(elems[i]);
			}
		},
		deactivate(state, elems) {
			for (i=0;i<elems.length;i++) {
				var index = state.active.indexOf(elems[i]);
				if (index > -1) {
					state.active.splice(index, 1);
				}
			}
		},
		setTables(state, tables) {
			state.tables = tables;
		},
		setDbs(state, dbs) {
			state.dbs = dbs;
		},
		setCurrentDb(state, db) {
			state.currentDb = db;
		},
		setCurrentTable(state, table) {
			state.currentTable = table;
		},
		setPageTitle(state, title) {
			state.pageTitle = title;
		},
		fillSidebar(state, content) {
			state.sidebar = content;
		},
		/*setDocs(state, docs) {
			state.docs = docs;
		},*/
	},
	actions: {
		activate(context, elems) {
			context.commit("activate", elems);
		},
		deactivate(context, elems) {
			context.commit("deactivate", elems);
		},
		setTables(context, tables) {
			context.commit("setTables", tables);
		},
		setDbs(context, dbs) {
			context.commit("setDbs", dbs);
		},
		setCurrentDb(context, db) {
			context.commit("setCurrentDb", db);
		},
		setCurrentTable(context, table) {
			context.commit("setCurrentTable", table);
		},
		setPageTitle(context, title) {
			context.commit("setPageTitle", title);
		},
		fillSidebar(context, content) {
			context.commit("fillSidebar", content);
		},
		/*setDocs(context, content) {
			context.commit("getDocs", docs);
		},*/
	},
	getters: {
		active: function(state) { return state.active },
		dbs: function(state) { return state.dbs },
    	tables: function(state) { return state.tables },
    	//docs: function(state) { return state.docs },
    	currentDb: function(state) { return state.currentDb },
    	currentTable: function(state) { return state.currentTable },
    	pageTitle: function(state) { return state.pageTitle },
    	sidebar: function(state) { return state.sidebar },
	},
});