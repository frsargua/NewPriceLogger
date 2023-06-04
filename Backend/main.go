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

	router := mux.NewRouter()

	routes.Routes(router)
	models.ConnectDatabase()

	// Start the server
	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8080", router)

}
