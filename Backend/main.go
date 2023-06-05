package main

import (
	"fmt"
	"net/http"

	"github.com/frsargua/NewPriceLogger/Backend/models"
	"github.com/frsargua/NewPriceLogger/Backend/routes"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	// pc := &controllers.PhonesController{}
	// fmt.Println(pc)
	// pc.InitialiseFirebase()

	router := mux.NewRouter()

	routes.Routes(router)
	models.ConnectDatabase()

	// Start the server
	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8081", allowCORS(router))

}

func allowCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set the Access-Control-Allow-Origin header to allow requests from any origin
		origin := r.Header.Get("Origin")
		w.Header().Set("Access-Control-Allow-Origin", origin)

		// w.Header().Set("Access-Control-Allow-Origin", "*")

		w.Header().Set("Access-Control-Allow-Methods", "DELETE, PUT")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		// Call the next handler
		next.ServeHTTP(w, r)
	})
}
