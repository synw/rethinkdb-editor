const vvDebug = true;

var vvMixin = {
    data: function() {
        return {
        	active: [],
        };
    },
    methods: {
    	flush: function(preserve) {
			if (vvDebug === true) {console.log("FLUSH"+"\n# active: "+this.active, this.active.length)};
			var act = [];
			for (i=0;i<this.active.length;i++) {
				if (vvDebug === true) {if (preserve) {console.log("Preserve: "+this.active[i]+" / "+preserve)}};
				if (this.active[i] != preserve) {
					var t = typeOf(this.active[i]);
					if (isNaN(t)) {
						if (vvDebug === true) { console.log("NaN value "+this.active[i])};
						continue
					}
					if (t === "string") {
						if (vvDebug === true) { console.log(+ " [x] Flushing "+this.active[i]+" (string)")};
						this.active[i] = "";
					} else if (t === "array") {
						if (vvDebug === true) { console.log(+ " [x] Flushing "+this.active[i]+" (array)")};
						this.active[i] = [];
					} else if (t === "object") {
						if (vvDebug === true) { console.log(+ " [x] Flushing "+this.active[i]+" (object)")};
						this.active[i] = {}
					} else if (t === "boolean") {
						if (vvDebug === true) { console.log(+ " [x] Flushing "+this.active[i]+" (boolean)")};
						this.active[i] = false
					} else if (t === "number") {
						if (vvDebug === true) { console.log(+ " [x] Flushing "+this.active[i]+" (number)")};
						this.active[i] = 0
					} else {
						if (vvDebug === true) { console.log("Type not found "+this.active[i])};
						continue
					}
					act.push(this.active[i]);
				} else {
					if (vvDebug === true) { console.log("Preserving "+this.active[i])};
				}
			}
			this.active = act;
			if (vvDebug === true) { console.log("--> active: "+this.active+"\n ****** flushed *****\n") };
		},
		isActive: function(item) {
			if (this.active.indexOf(item) > -1) {
				return true
			}
			return false
		},
		loadData: function(resturl, action, error) {
			axios.get(resturl).then(function (response) {
			    action(response.data);
			}).catch(function (error) {
				console.log(error);
			});
		},
		postForm: function(url, data, action, error, token) {
			if (!token) {
				token = csrftoken
			}
			var ax = axios.create({headers: {'X-CSRFToken': token}});
			ax({
				method: 'post',
				url: url,
				data: data,
			}).then(function (response) {
				action(response)
			}).catch(function (err) {
				error(err);
			});
		},
		query: function(q) {
			var q = encodeURIComponent(q);
			var url = '/graphql?query='+q;
			return url
		},
		str: function(el) {
			return JSON.stringify(el, null, 2)
		},
		get: function(node) {
			return document.getElementById(node)
		},
    }
};