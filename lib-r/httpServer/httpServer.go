package httpServer

import (
	"net/http"
	"fmt"
	"time"
	"os"
	"context"
	"bytes"
	"html/template"
	"path/filepath"
	"encoding/json"
	"github.com/pressly/chi"
	"github.com/pressly/chi/middleware"
	"github.com/synw/terr"
	"github.com/synw/rethinkdb-editor/lib-r/schema"
	"github.com/synw/rethinkdb-editor/lib-r/state"
	"github.com/synw/rethinkdb-editor/lib-r/datatypes"
)


type httpResponseWriter struct {
	http.ResponseWriter
	status *int
}

var View = template.Must(template.New("index.html").ParseFiles("templates/index.html", "templates/head.html", "templates/header.html", "templates/navbar.html", "templates/footer.html", "templates/routes.js"))
var V404 = template.Must(template.New("404.html").ParseFiles("templates/404.html", "templates/head.html", "templates/header.html", "templates/navbar.html", "templates/footer.html", "templates/routes.js"))
var V500 = template.Must(template.New("500.html").ParseFiles("templates/500.html", "templates/head.html", "templates/header.html", "templates/navbar.html", "templates/footer.html", "templates/routes.js"))

func InitHttpServer(serve bool) {
	// routing
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.StripSlashes)
	// routes
	r.Get("/", serveRequest)
	r.Route("/graphql", func(r chi.Router) {
		r.Get("/*", handleQuery)
	})
	// init
	loc := ":8080"
	httpServer := &http.Server{
		Addr: loc,
	    ReadTimeout: 5 * time.Second,
	    WriteTimeout: 10 * time.Second,
	    Handler: r,
	}
	state.HttpServer = httpServer
	// static
	workDir, _ := os.Getwd()
	filesDir := filepath.Join(workDir, "static")
	r.FileServer("/static", http.Dir(filesDir))
	// run
	if serve == true {
		if state.Verbosity > 0 {
			fmt.Println("Starting http server ...")
		}
		Run()
	}
	return 
}

func Run() {
	state.HttpServer.ListenAndServe()
}

func Stop() *terr.Trace {
	d := time.Now().Add(5 * time.Second)
	ctx, cancel := context.WithDeadline(context.Background(), d)
	defer cancel()
	srv := state.HttpServer
	err := srv.Shutdown(ctx)
	if err != nil {
		tr := terr.New("httpServer.Stop", err)
		return tr
	}
	return nil
}

// internal methods

func handleQuery(response http.ResponseWriter, request *http.Request) {
	q := request.URL.Query()["query"][0]
	result, tr := schema.ExecuteQuery(q, schema.Schem)
	if tr != nil {
		fmt.Println(tr.Formatc())
	}
	json_bytes, err := json.Marshal(result.Data)
	if err != nil {
		fmt.Println(err)
	}
	var prettyJSON bytes.Buffer
    _ = json.Indent(&prettyJSON, json_bytes, "", "    ")
	//fmt.Println("JSON", string(prettyJSON.Bytes()))
	if err != nil {
		fmt.Println(err)
	}
	response = headers(response)
	fmt.Fprintf(response, "%s\n", json_bytes)
}

func headers(response http.ResponseWriter) http.ResponseWriter {
	response.Header().Set("Content-Type", "application/json")
	return response
}

func serveRequest(response http.ResponseWriter, request *http.Request) {
	url := request.URL.Path
	status := http.StatusOK
    page := &datatypes.Page{Url: url, Title: "Rethinkdb editor", Content: ""}
    response = httpResponseWriter{response, &status}
    renderTemplate(response, page)
}

func renderTemplate(response http.ResponseWriter, page *datatypes.Page) {
    err := View.Execute(response, page)
    if err != nil {
        http.Error(response, err.Error(), http.StatusInternalServerError)
    }
}

func render404(response http.ResponseWriter, page *datatypes.Page) {
	err := V404.Execute(response, page)
    if err != nil {
        http.Error(response, err.Error(), http.StatusInternalServerError)
    }
}
    
func render500(response http.ResponseWriter, page *datatypes.Page) {
	err := V500.Execute(response, page)
    if err != nil {
        http.Error(response, err.Error(), http.StatusInternalServerError)
    }
}
