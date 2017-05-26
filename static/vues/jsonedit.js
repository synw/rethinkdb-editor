// credits for the json prettyfier: http://joncom.be/code/javascript-json-formatter/

var jsoneditMixin = {
    data: function() {
        return {
        	docs: [],
        	doc: {},
        };
    },
    methods: {
    	jsonDoc: function(doc) {
    		return "<pre>"+this.str(doc)+"</pre>";
    	},
    	editDoc: function(doc) {
			db = store.getters.currentDb;
			table = store.getters.currentTable;
			this.deactivate(["docs"]);
			this.activate(["doc"]);
			this.doc = doc;
			console.log("DOC", doc);
		},
	    formatDoc: function(oIndex, data, sIndent) {
	    	var oData = {}
	    	if (oIndex > -1) {
	    		oData = this.docs[oIndex];
	    	} else {
	    		oData = data;
	    	}
	    	if (sIndent === undefined) { sIdent = 2 };
	        if (arguments.length < 2) {
	            var sIndent = "<br />";
	        }
	        var sIndentStyle = '<span style="margin-left:2em"></span>';
	        var sDataType = this.getType(oData);
	        // open object
	        if (sDataType == "array") {
	            if (oData.length == 0) {
	                return "[]";
	            }
	            var sHTML = "";
	        } else {
	            var iCount = 0;
	            var keys = Object.keys(oData);
	            for (i=0;i<keys.length;i++) {
	                iCount++;
	            };
	            if (iCount == 0) {
	                return "{}";
	            }
	            var sHTML = "";
	        }
	        // loop through items
	        for (sKey in oData) {
	        	var vValue = oData[sKey];	
	        	var type = this.getType(vValue);
	        	var keytype = this.getType(sKey);
	            sHTML += sIndent+ sIndentStyle;
	            if (sDataType == "array") {
	            	if ( type == "object") {
	            		sHTML += ("\n" + sKey+' <span class=\"object\">Object</span>');
	            	}
	            	else if ( type == "array") {
	            		sHTML += ("\n" + sKey+' </span> <span class=\"array\">Array</span>');
	            	}
	            	else {
	            		sHTML += ("\n" + sKey+' ');
	            	}
	            }
	            else {
	            	if ( type == "object") {
	            		sHTML += ("\n<span class=\"blue\">"+ sKey + "</span> <span class=\"object\">Object</span>");
	            	}
	            	else if ( type == "array") {
	            		sHTML += ('\n<span class="blue">'+sKey+'</span> <span class=\"array\">Array</span>');
	            	}
	            	else {
	            		sHTML += ("\n<span class=\"blue\">"+ sKey + "</span> : ");
	            	}
	            }
	            sHTML += '<div class="pull-right light small" style="margin-right:2em">'+type+'</div>';
	            // display relevant data type
	            switch (type) {
	                case "array":
	                case "object":
	                    sHTML += this.formatDoc(-1, vValue, (sIndent + sIndentStyle));
	                    break;
	                case "boolean":
	                case "number":
	                    sHTML += "<span class=\"number\">"+vValue.toString()+"</span>";
	                    break;
	                case "null":
	                    sHTML += "<span class=\"light\">null</span>";
	                    break;
	                case "string":
	                    sHTML += ('<span class="light">"</span>' + vValue.replace(/(<([^>]+)>)/ig,"") + '<span class="light">"</span>');
	                    break;
	                default:
	                    sHTML += ("TYPEOF: " + typeof(vValue));
	            }
	        };
	        return sHTML;
	    },
	    getType: function(v) {
	    	if (typeof(v) == "object") {
	    		if (v === null) return "null";
	    		if (v.constructor == (new Array).constructor) return "array";
	    		if (v.constructor == (new Date).constructor) return "date";
	    		if (v.constructor == (new RegExp).constructor) return "regex";
	    		return "object";
	    	}
		return typeof(v);
		},
		getDocNum: function(i) {
			return i+1
		},
    }
}
