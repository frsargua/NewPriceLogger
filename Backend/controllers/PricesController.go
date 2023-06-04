package controllers

import (
	"net/http"
)

// PricesController
type PricesController struct{}

func (pc *PricesController) Show(w http.ResponseWriter, r *http.Request) {
	// show action logic
}

func (pc *PricesController) ShowID(w http.ResponseWriter, r *http.Request) {
	// showId action logic
}

func (pc *PricesController) ShowSinglePrice(w http.ResponseWriter, r *http.Request) {
	// showSinglePrice action logic
}

func (pc *PricesController) Update(w http.ResponseWriter, r *http.Request) {
	// update action logic
}

func (pc *PricesController) Store(w http.ResponseWriter, r *http.Request) {
	// store action logic
}

func (pc *PricesController) Destroy(w http.ResponseWriter, r *http.Request) {
	// destroy action logic
}