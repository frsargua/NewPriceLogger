package controllers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"github.com/frsargua/NewPriceLogger/Backend/controllers"
	"github.com/frsargua/NewPriceLogger/Backend/models"
	"github.com/gorilla/mux"
)

func TestPhonesController_Store(t *testing.T) {
	phonesController := &controllers.PhonesController{}
	model := generate(9)
	phone := models.Phone{
		BrandName:    "apple",
		Model:        model,
		ReleaseDate:  time.Now(),
		ReleasePrice: 999.99,
	}

	payload, err := json.Marshal(phone)
	if err != nil {
		t.Fatalf("failed to convert object to JSON: %v", err)
	}

	request, err := http.NewRequest("POST", "/phones", bytes.NewBuffer(payload))
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	recorder := httptest.NewRecorder()

	phonesController.Store(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Errorf("expected status %d, but got %d", http.StatusOK, recorder.Code)
	}

	var responsePhone models.Phone
	err = json.Unmarshal(recorder.Body.Bytes(), &responsePhone)
	if err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if responsePhone.BrandName != phone.BrandName {
		t.Errorf("expected brand name %q, but got %q", phone.BrandName, responsePhone.BrandName)
	}
	if responsePhone.Model != phone.Model {
		t.Errorf("expected model %q, but got %q", phone.Model, responsePhone.Model)
	}
	if !responsePhone.ReleaseDate.Equal(phone.ReleaseDate) {
		t.Errorf("expected release date %v, but got %v", phone.ReleaseDate, responsePhone.ReleaseDate)
	}
	if responsePhone.ReleasePrice != phone.ReleasePrice {
		t.Errorf("expected release price %f, but got %f", phone.ReleasePrice, responsePhone.ReleasePrice)
	}
}

func TestPhonesController_Destroy(t *testing.T) {
	phonesController := &controllers.PhonesController{}

	model := generate(12)
	phone := models.Phone{
		BrandName:    "apple",
		Model:        model,
		ReleaseDate:  time.Now(),
		ReleasePrice: 999.99,
	}
	if err := models.DB.Create(&phone).Error; err != nil {
		t.Fatalf("failed to create phone: %v", err)
	}

	router := mux.NewRouter()
	router.HandleFunc("/phones/{id}", phonesController.Destroy).Methods("DELETE")

	phoneId := strconv.Itoa(phone.ID)

	request, err := http.NewRequest("DELETE", "/phone/"+phoneId, nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	request = mux.SetURLVars(request, map[string]string{"id": phoneId})

	recorder := httptest.NewRecorder()

	phonesController.Destroy(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Errorf("expected status %d, but got %d", http.StatusOK, recorder.Code)
	}

}
