// credits for the json prettyfier: http://joncom.be/code/javascript-json-formatter/

var jsoneditMixin = {
    data: function() {
        return {
        	docs: [],
        	numDocs: 0,
        	doc: {},
        	json: "",
        };
    },
    methods: {
    	getDoc: function(doc) {
    		return "<pre>"+this.str(doc)+"</pre>";
    	},
    	formatObj: function(data) {
    		var keys = Object.keys(res);
			var kl = keys.length;
			var idr = '1_res';

			output = output+'<div id="'+idr+'" class="result_cell">';
			output = output+'<div class="pull-right light big" style="margin-right:5px">1</div>';
			output = output+FormatVisual(res);
			output = output+'</div>';
			json_output = json_output+'<div id="'+idr+'" class="result_cell">';
			json_output = json_output+'<div class="pull-right light big">1</div>';
			json_output = json_output+FormatJSON(res);
			json_output = json_output+'</div>';
			return 
    	},
    	formatJson: function(data) {
			if (this.getType(data) == '[object Object]') {
				
				
			}
			if (get_type(res) == '[object Number]') {
				$('#res_v').html('');
				$('#num_results').html(res);
			}
			if (get_type(res) == '[object Array]') {
				var arrayLength = res.length;
				var json_output = '';
				num = 0;
				for (var i = 0; i < arrayLength; i++) {
					var num = i+1;
					var keys = Object.keys(res[i]);
					var kl = keys.length;
					var idr = i+'_res';
					var delete_link = "<a class=\"btn btn-xs btn-danger\" style=\"position:relative;top:4px;\"href=\"javascript:delete_q('"+res[i]["id"]+"')\">Delete</a>";
					//console.log(i+' : '+JSON.stringify(res[i]));
					output = output+'<div id="'+idr+'" class="result_cell">';
					output = output+'<div class="pull-right">'+delete_link+"</div>";
					output = output+'<div class="pull-right light big" style="margin-right:5px">'+num+'</div>';
					output = output+FormatVisual(res[i]);
					output = output+'</div>';
					json_output = json_output+'<div id="'+idr+'" class="result_cell">';
					json_output = json_output+'<div class="pull-right light big">'+num+'</div>';
					json_output = json_output+FormatJSON(res[i]);
					json_output = json_output+'</div>'
				}
				$('#num_results').html(arrayLength);
			}
			$('#results').show();
			$('#results_title').show();
			$("#res_v").html(output);
			$('#res_j').html(json_output);
			if (qtime != null) {
				$('#q_time').html(qtime+' ms');
			} else {
				$('#q_time').html("");
			}
    	}
    },
    get_type: function(thing){
        if(thing===null)return "[object Null]";
        return Object.prototype.toString.call(thing);
    },
}


function RealTypeOf(v) {
  if (typeof(v) == "object") {
    if (v === null) return "null";
    if (v.constructor == (new Array).constructor) return "array";
    if (v.constructor == (new Date).constructor) return "date";
    if (v.constructor == (new RegExp).constructor) return "regex";
    return "object";
  }
  return typeof(v);
}

function SortObject(oData) {
    var oNewData = {};
    var aSortArray = [];

    // sort keys
    $.each(oData, function(sKey) {
        aSortArray.push(sKey);
    });
    aSortArray.sort(SortLowerCase);

    // create new data object
    $.each(aSortArray, function(i) {
        if (RealTypeOf(oData[(aSortArray[i])]) == "object" ) {
            oData[(aSortArray[i])] = SortObject(oData[(aSortArray[i])]);
        }
        oNewData[(aSortArray[i])] = oData[(aSortArray[i])];
    });

    return oNewData;

    function SortLowerCase(a,b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    }
}

function FormatVisual(oData, sIndent) {
    if (arguments.length < 2) {
        var sIndent = "<br />";
    }
    var sIndentStyle = '<span style="margin-left:2em"></span>';
    var sDataType = RealTypeOf(oData);

    // open object
    if (sDataType == "array") {
        if (oData.length == 0) {
            return "[]";
        }
        var sHTML = "";
    } else {
        var iCount = 0;
        $.each(oData, function() {
            iCount++;
            return;
        });
        if (iCount == 0) { // object is empty
            return "{}";
        }
        var sHTML = "";
    }

    // loop through items
    var iCount = 0;
    $.each(oData, function(sKey, vValue) {
    	//console.log(sKey+' , '+vValue);
    	var type = RealTypeOf(vValue);
    	var keytype = RealTypeOf(sKey);
        if (iCount > 0) {
            sHTML += ",";
        }
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
                sHTML += FormatVisual(vValue, (sIndent + sIndentStyle));
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

        // loop
        iCount++;
    });
    return sHTML;
}

function FormatJSON(oData, sIndent) {
    if (arguments.length < 2) {
        var sIndent = "<br />";
    }
    var sIndentStyle = '<span style="margin-left:2em"></span>';
    var sDataType = RealTypeOf(oData);

    // open object
    if (sDataType == "array") {
        if (oData.length == 0) {
            return "[]";
        }
        var sHTML = "[";
    } else {
        var iCount = 0;
        $.each(oData, function() {
            iCount++;
            return;
        });
        if (iCount == 0) { // object is empty
            return "{}";
        }
        var sHTML = "{";
    }

    // loop through items
    var iCount = 0;
    $.each(oData, function(sKey, vValue) {
        if (iCount > 0) {
            sHTML += '<span class="light">,</span>';
        }
        if (sDataType == "array") {
            sHTML += ("\n" + sIndent + sIndentStyle);
        } else {
            sHTML += ("\n" + sIndent + sIndentStyle + "\"<span class=\"blue\">" + sKey + "</span>\"" + ": ");
        }

        // display relevant data type
        switch (RealTypeOf(vValue)) {
            case "array":
            case "object":
                sHTML += FormatJSON(vValue, (sIndent + sIndentStyle));
                break;
            case "boolean":
            case "number":
                sHTML += vValue.toString();
                break;
            case "null":
                sHTML += "null";
                break;
            case "string":
                sHTML += ("\"" + vValue + "\"");
                break;
            default:
                sHTML += ("TYPEOF: " + typeof(vValue));
        }

        // loop
        iCount++;
    });
    if (sDataType == "array") {
        sHTML += ("\n" + sIndent + "]");
    } else {
        sHTML += ("\n" + sIndent + "}");
    }
    return sHTML;
}