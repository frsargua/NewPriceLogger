package routes

import (
	"net/http"

	"github.com/gorilla/mux"

	"github.com/frsargua/NewPriceLogger/Backend/controllers"
)

func Routes(router *mux.Router) {

	// PhoneController routes
	phoneController := controllers.PhonesController{}
	phoneRouter := router.PathPrefix("/phones").Subrouter()
	phoneRouter.HandleFunc("", phoneController.Show).Methods("GET")
	phoneRouter.HandleFunc("/{id}", phoneController.ShowID).Methods("GET")
	phoneRouter.HandleFunc("/{id}", phoneController.Update).Methods("PUT")
	phoneRouter.HandleFunc("", phoneController.Store).Methods("POST")
	phoneRouter.HandleFunc("/{id}", phoneController.Destroy).Methods("DELETE")
	// phoneRouter.HandleFunc("/store/image", phoneController.UploadImage).Methods("POST")
	phoneRouter.HandleFunc("/chat", phoneController.WhatIsThe).Methods("POST")
	phoneRouter.HandleFunc("/fakeimage", phoneController.GetFakeImage).Methods("POST")

	// PricesController routes
	priceController := controllers.PricesController{}
	priceRouter := router.PathPrefix("/prices").Subrouter()
	priceRouter.HandleFunc("/{id}", priceController.ShowID).Methods("GET")
	priceRouter.HandleFunc("/single/{id}", priceController.ShowSinglePrice).Methods("GET")
	priceRouter.HandleFunc("/update/{id}", priceController.Update).Methods("PUT")
	priceRouter.HandleFunc("/store", priceController.Store).Methods("POST")
	priceRouter.HandleFunc("/delete/{id}", priceController.Destroy).Methods("DELETE")

	// BrandControllers routes
	brandController := controllers.BrandControllers{}
	brandRouter := router.PathPrefix("/brand").Subrouter()
	brandRouter.HandleFunc("", brandController.Show).Methods("GET")
	brandRouter.HandleFunc("", brandController.Store).Methods("POST")

	router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "Page not found", http.StatusNotFound)
	})
}
