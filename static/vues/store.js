const store = new Vuex.Store({
	state: {
		active: [],
		dbs: [],
    	tables: [],
    	currentDb: "",
    	currentTable: "",
    	pageTitle: "Rethinkdb editor",
	},
	mutations: {
		activate(state, elems) {
			for (i=0;i<elems.length;i++) {
				state.active.push(elems[i]);
			}
		},
		deactivate(state, elems) {
			for (i=0;i<state.active.length;i++) {
				if (elems[i] === state.active[i]) {
					var index = state.active.indexOf(elems[i]);
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
		activateTableBtn(state, table, oldtable) {
			var btn = app.get("btn-table-"+table);
			//console.log("ACTIVATE", "btn-table-"+table, oldtable);
			
			btn.style["background-color"] = "#f0ead6";
			btn.style["color"] = "#388E8E";
		},
		deactivateTableBtn(state, oldtable) {
 			//console.log("************* DEACT btns for", oldtable);
 			//if (!oldtable) { console.log("no table\n*****");return };
			var id = "sidebar";
			var elem = document.getElementById(id)||null;
			//if (elem === null) { console.log("elem null", id);return };
			var nodes = elem.childNodes;
			for (i=0;i<nodes.length;i++) {
				var a = nodes[i];
				var btn = a.childNodes[0];
				//console.log("NODE -> ", btn);
				
				btn.style["background-color"] = "transparent";
				btn.style["color"] = "darkslategrey";
			}
			if (oldtable) {
				var b = "btn-table-"+oldtable;
				//console.log("DEACTIVATE OLD TABLE", b);
				try {
					var btn = app.get(b);
					//console.log("DEACT", b);
					btn.style["background-color"] = "transparent";
					btn.style["color"] = "darkslategrey";
				} catch(err) { 
					//console.log("deactivate table btn", err) 
				}
			}
		},
		fillSidebar(state, content) {
			state.sidebar = content;
		},
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
		activateTableBtn(context, payload) {
			var oldtable = payload.oldtable;
			var table = payload.table;
			context.commit("deactivateTableBtn", table);
			if (oldtable) {
				context.commit("activateTableBtn", table);
			} else {
				//console.log("delayed");
				setTimeout( function() {
					context.commit("activateTableBtn", table);
				}, 500);
			}
		},
		deactivateTableBtn(context, oldtable) {
			context.commit("deactivateTableBtn", oldtable);
		},
	},
	getters: {
		active: function(state) { return state.active },
		dbs: function(state) { return state.dbs },
    	tables: function(state) { return state.tables },
    	currentDb: function(state) { return state.currentDb },
    	currentTable: function(state) { return state.currentTable },
    	pageTitle: function(state) { return state.pageTitle },
    	sidebar: function(state) { return state.sidebar },
    	activeTableBtn: function(state) { return state.activeTableBtn },
	},
});