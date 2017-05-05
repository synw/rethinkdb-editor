package db

import (
	r "gopkg.in/dancannon/gorethink.v3"
	"github.com/synw/terr"
	"github.com/synw/rethinkdb-editor/lib-r/state"
)

var conn *r.Session

func InitDb() *terr.Trace {
	cn, tr := connect()
	if tr != nil {
		tr := terr.Pass("db.InitDb", tr)
		return tr
	}
	conn = cn
	return nil
}

func GetTables(db string) ([]string, *terr.Trace) {
	var tables []string
	res, err := r.DB(db).TableList().Run(conn)
	if err != nil {
		tr := terr.New("db.GetTables", err)
		return tables, tr
	}
	var row interface{}
	for res.Next(&row) {
	    tables = append(tables, row.(string))
	}
	if res.Err() != nil {
	    tr := terr.New("db.GetTables", err)
		return tables, tr
	}
	return tables, nil
}

func GetDbs() ([]string, *terr.Trace) {
	var dbs []string
	res, err := r.DBList().Run(conn)
	if err != nil {
		tr := terr.New("db.GetDbs", err)
		return dbs, tr
	}
	var row interface{}
	for res.Next(&row) {
	    dbs = append(dbs, row.(string))
	}
	if res.Err() != nil {
	    tr := terr.New("db.GetDbs", err)
		return dbs, tr
	}
	return dbs, nil
}

func connect() (*r.Session, *terr.Trace) {
	user := state.User
	pwd := state.Pwd
	addr := state.Addr
	// connect to Rethinkdb
	session, err := r.Connect(r.ConnectOpts{
		Address: addr,
		Username: user,
		Password: pwd,
		InitialCap: 10,
        MaxOpen:    10,
	})
    if err != nil {
        tr := terr.New("db.rethinkdb.connectToDb()", err)
        return session, tr
    }
    return session, nil
}
