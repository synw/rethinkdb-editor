package state

import (
	"net/http"
	"github.com/synw/terr"
	"github.com/synw/rethinkdb-editor/lib-r/conf"
	"github.com/synw/goregraph/lib-r/types"
)

var Conf *types.Conf
var Verbosity int
var HttpServer *http.Server
var Dbs []string
var Db string
var Table string

func InitState(dev bool, verbosity int) *terr.Trace {
	// options
	Verbosity = verbosity
	// config
	cf, tr := conf.GetConf(dev, verbosity)
	if tr != nil {
		return tr
	}
	Conf  = cf
	return nil
}