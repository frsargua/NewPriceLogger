package main

import (
	"fmt"
	"net/http"

	"github.com/frsargua/NewPriceLogger/Backend/models"
	"github.com/frsargua/NewPriceLogger/Backend/routes"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	godotenv.Load()

	router := mux.NewRouter()

	routes.Routes(router)
	models.ConnectDatabase()

	headers := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			next.ServeHTTP(w, r)
		})
	}

		router.Use(headers)

	corsHandler := cors.Default().Handler(router)


	// Start the server
	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8080", corsHandler)

}
