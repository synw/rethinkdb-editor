package main

import (
	"flag"
	"fmt"
	"github.com/synw/goregraph/db"
	"github.com/synw/rethinkdb-editor/lib-r/httpServer"
	"github.com/synw/rethinkdb-editor/lib-r/state"
)

var dev_mode = flag.Bool("d", false, "Dev mode")
var verbosity = flag.Int("v", 1, "Verbosity")

func main() {
	flag.Parse()
	// init state
	tr := state.InitState(*dev_mode, *verbosity)
	if tr != nil {
		fmt.Println(tr.Formatc())
	}
	// init db
	err := db.Init(state.Conf)
	if err != nil {
		fmt.Println(err)
	}
	state.Dbs = db.GetDbs()
	// run http server
	defer httpServer.Stop()
	if state.Verbosity > 0 {
		defer fmt.Println("Exit")
	}
	httpServer.InitHttpServer(true)
	select {}
}
