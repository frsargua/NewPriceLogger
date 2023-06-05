package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/frsargua/NewPriceLogger/Backend/models"
	"github.com/go-playground/validator"
	"github.com/gorilla/mux"
)

type PhonesController struct{}

func (pc *PhonesController) Show(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var phones []models.Phone

	if err := models.DB.Find(&phones).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		Phones []models.Phone `json:"phones"`
	}{
		Phones: phones,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (pc *PhonesController) ShowID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)

	var phone models.Phone
	phoneId := vars["id"]

	if err := validateId(phoneId); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := models.DB.First(&phone, phoneId).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		Phone models.Phone `json:"phone"`
	}{
		Phone: phone,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (pc *PhonesController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	phoneID := vars["id"]

	if err := validateId(phoneID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var updatedPhone models.Phone
	err := json.NewDecoder(r.Body).Decode(&updatedPhone)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var existingPhone models.Phone
	if err := models.DB.First(&existingPhone, phoneID).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Update the existing phone object with the new data
	existingPhone.BrandName = updatedPhone.BrandName
	existingPhone.Model = updatedPhone.Model
	existingPhone.ReleaseDate = updatedPhone.ReleaseDate
	existingPhone.ReleasePrice = updatedPhone.ReleasePrice

	if err := models.DB.Save(&existingPhone).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(existingPhone)
}

func (pc *PhonesController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var phone models.Phone

	err := json.NewDecoder(r.Body).Decode(&phone)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(phone)

	// Validate brand field
	err = validatePhone(phone)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

    if err := models.DB.Create(&phone).Error; err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Return the created phone in the response
    response, err := json.Marshal(phone)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }


	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

func (pc *PhonesController) Destroy(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
	println("Hey")
	vars := mux.Vars(r)
	phoneID := vars["id"]
	var existingPhone models.Phone

	if err := validateId(phoneID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
println("one")

	if err := models.DB.First(&existingPhone, phoneID).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
println("two")
	if err := models.DB.Delete(&existingPhone).Error; err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	println("three")
	// json.NewEncoder(w).Encode(existingPhone)
		w.WriteHeader(http.StatusOK)	

}

func validatePhone(phone models.Phone) error {
	validate := validator.New()

	err := validate.Struct(phone)
	if err != nil {
		// 	var validationErrors []string
		// 	for _, err := range err.(validator.ValidationErrors) {
		// 		validationErrors = append(validationErrors, err.Error())
		// 	}
		// 	return errors.New(strings.Join(validationErrors, ", "))
	}

	return nil
}

func validateId(phoneId string) error {
	if phoneId == "" {
		return errors.New("Missing or empty Id")
	}

	if _, err := strconv.Atoi(phoneId); err != nil {
		return errors.New("Invalid Id format")
	}

	return nil
}
