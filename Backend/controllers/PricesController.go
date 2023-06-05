package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/frsargua/NewPriceLogger/Backend/models"
	"github.com/go-playground/validator"
	"github.com/gorilla/mux"
)

// PricesController
type PricesController struct{}

func (pc *PricesController) ShowID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)

	phoneID := vars["id"]

	if err := validateId(phoneID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var phonePrices []models.Price
	if err := models.DB.Where("model_id = ?", phoneID).Find(&phonePrices).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		PhonePrices []models.Price `json:"prices"`
	}{
		PhonePrices: phonePrices,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (pc *PricesController) ShowSinglePrice(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)

	priceID := vars["id"]

	if err := validateId(priceID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var phonePrice models.Price
	if err := models.DB.Find(&phonePrice, priceID).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		PhonePrice models.Price `json:"prices"`
	}{
		PhonePrice: phonePrice,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (pc *PricesController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	priceID := vars["id"]

	if err := validateId(priceID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var updatedPrice models.Price



	err := json.NewDecoder(r.Body).Decode(&updatedPrice)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(updatedPrice)

	err = validatePrice(updatedPrice)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}


	var existingPrice models.Price
	if err := models.DB.First(&existingPrice, priceID).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Update the existing phone object with the new data
	existingPrice.Price = updatedPrice.Price
	existingPrice.DateAdded = updatedPrice.DateAdded

	if err := models.DB.Save(&existingPrice).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(existingPrice)
}

func (pc *PricesController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var phonePrice models.Price

	err := json.NewDecoder(r.Body).Decode(&phonePrice)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate brand field
	err = validatePrice(phonePrice)

	fmt.Println(err);

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response, err := json.Marshal(models.DB.Create(&phonePrice).Error)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

func (pc *PricesController) Destroy(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	priceID := vars["id"]
	var existingPrice models.Price

	if err := validateId(priceID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := models.DB.First(&existingPrice, priceID).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := models.DB.Delete(&existingPrice).Error; err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(existingPrice)
}

func validatePrice(price models.Price) error {
	validate := validator.New()

	err := validate.Struct(price)
	if err != nil {
		var errorMessages []string
		for _, err := range err.(validator.ValidationErrors) {
			// fieldName := err.StructField()
			errMessage := err.Tag()

			// Retrieve the custom error message if available
			if customErr, ok := err.(validator.FieldError); ok {
				errMessage = customErr.ActualTag()
			}
			errorMessages = append(errorMessages, errMessage)
		}
		fmt.Println(errorMessages)
		return errors.New(errorMessages[0])
	}

	return nil
}
