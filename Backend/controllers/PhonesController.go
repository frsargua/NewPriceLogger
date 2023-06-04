package controllers

import (
	"net/http"
)

type PhonesController struct{}

func (pc *PhonesController) Show(w http.ResponseWriter, r *http.Request) {
	// show action logic
}

func (pc *PhonesController) ShowID(w http.ResponseWriter, r *http.Request) {
	// showId action logic
}

func (pc *PhonesController) Update(w http.ResponseWriter, r *http.Request) {
	// update action logic
}

func (pc *PhonesController) Store(w http.ResponseWriter, r *http.Request) {
	// store action logic
}

func (pc *PhonesController) Destroy(w http.ResponseWriter, r *http.Request) {
	// destroy action logic
}
