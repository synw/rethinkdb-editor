package main

import (
	"fmt"
	"flag"
	"github.com/synw/terr"
	"github.com/synw/rethinkdb-editor/lib-r/state"
	"github.com/synw/rethinkdb-editor/lib-r/httpServer"
	"github.com/synw/rethinkdb-editor/lib-r/db"
)


var dev_mode = flag.Bool("d", false, "Dev mode")
var verbosity = flag.Int("v", 1, "Verbosity")

func main() {
	flag.Parse()
	name := "normal"
	if *dev_mode == true {
		name = "dev"
	}
	// init state
	tr := state.InitState(name, *verbosity)
	if tr != nil {
		fmt.Println(tr.Formatc())
	}
	// init db
	tr = db.InitDb()
	if tr != nil {
		terr.Fatal("main", tr)
	}
	dbs, tr := db.GetDbs()
	if tr != nil {
		terr.Fatal("main", tr)
	}
	state.Dbs = dbs
	if state.Verbosity > 0 {
		fmt.Println("Database is ready")
	}
	// run http server
	defer httpServer.Stop() 
	if state.Verbosity > 0 { 
		fmt.Println("Starting editor ...")
		defer fmt.Println("Exit") 
	}
	httpServer.InitHttpServer(true)
}
