package schema

import (
	"fmt"
	"errors"
	"github.com/graphql-go/graphql"
	"github.com/synw/terr"
	"github.com/synw/rethinkdb-editor/lib-r/state"
	"github.com/synw/rethinkdb-editor/lib-r/db"
)

type Db struct {
	Name string `json:"name"`
}

type Table struct {
	Name string `json:"name"`
}

var dbType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Db",
		Fields: graphql.Fields{
			"name": &graphql.Field{Type: graphql.String},
		},
	},
)

var tableType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Table",
		Fields: graphql.Fields{
			"name": &graphql.Field{Type: graphql.String},
		},
	},
)

var queryType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"dbs": &graphql.Field{
				Type: graphql.NewList(dbType),
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					dbs := getDbs()
					return dbs, nil
				},
			},
			"tables": &graphql.Field{
				Type: graphql.NewList(tableType),
				Args: graphql.FieldConfigArgument{
					"db": &graphql.ArgumentConfig{
						Type: graphql.String,
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					tables, tr := getTables(p.Args["db"].(string))
					if tr != nil {
						return tables, tr.ToErr()
					}
					return tables, nil
				},
			},
		},
	})

var Schem, _ = graphql.NewSchema(
	graphql.SchemaConfig{
		Query: queryType,
	},
)

func ExecuteQuery(query string, schema graphql.Schema) (*graphql.Result, *terr.Trace) {
	result := graphql.Do(graphql.Params{
		Schema: Schem,
		RequestString: query,
	})
	if len(result.Errors) > 0 {
		msg := fmt.Sprintf("wrong result, unexpected errors: %v", result.Errors)
		err := errors.New(msg)
		tr := terr.New("schema.ExecuteQuery", err)
		return result, tr
	}
	return result, nil
}

func getTables(dbstr string) ([]*Table, *terr.Trace) {
	var tables []*Table
	tbs, tr := db.GetTables(dbstr)
	if tr != nil {
		return tables, tr
	}
	for _, table := range(tbs) {
		t := Table{table}
		tables = append(tables, &t)
	}
	return tables, nil
}

func getDbs() []*Db {
	var dbs []*Db
	for _, db := range(state.Dbs) {
		d := Db{db}
		dbs = append(dbs, &d)
	}
	return dbs
}
