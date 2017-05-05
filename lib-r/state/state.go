package state

import (
	"net/http"
	"github.com/synw/terr"
	"github.com/synw/rethinkdb-editor/lib-r/conf"
)


var Addr string
var User string
var Pwd string
var Verbosity int
var HttpServer *http.Server
var Dbs []string
var Db string
var Table string

func InitState(name string, verbosity int) *terr.Trace {
	// options
	Verbosity = verbosity
	// config
	cf, tr := conf.GetConf(name)
	if tr != nil {
		return tr
	}
	// db credentials
	Addr = cf["addr"].(string)
	User = cf["user"].(string)
	Pwd = cf["password"].(string)
	return nil
}