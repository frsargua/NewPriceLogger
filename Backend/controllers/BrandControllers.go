package controllers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/frsargua/NewPriceLogger/Backend/models"
)

// BrandControllers
type BrandControllers struct{}

func (bc *BrandControllers) Show(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var brands []models.Brand

	if err := models.DB.Find(&brands).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		Brands []models.Brand `json:"brands"`
	}{
		Brands: brands,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (bc *BrandControllers) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var brand models.Brand

	err := json.NewDecoder(r.Body).Decode(&brand)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate brand field
	err = validateBrand(brand)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result := models.DB.Create(&brand)
	if result.Error != nil {
		http.Error(w, "Brand might not be unique", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(brand)

}

func validateBrand(brand models.Brand) error {
	//  brandDB := models.Brand{Brand: brand.Brand}

	if brand.Brand == "" {
		return errors.New("Brand name cannot be empty")
	}

	if len(brand.Brand) < 3 || len(brand.Brand) > 30 {
		return errors.New("Brand name should be between 3 and 30 characters")
	}

	return nil
}
