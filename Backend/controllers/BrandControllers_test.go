package controllers_test

import (
	"bytes"
	"crypto/rand"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"
	"unsafe"

	"github.com/frsargua/NewPriceLogger/Backend/controllers"
	"github.com/frsargua/NewPriceLogger/Backend/models"
)

func TestDB(m *testing.T) {
	err := models.ConnectDatabase()
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

}

func TestShowBrands(t *testing.T) {
	req, err := http.NewRequest("GET", "/brand", nil)
	if err != nil {
		t.Fatal(err)
	}

	recorder := httptest.NewRecorder()

	brandController := controllers.BrandControllers{}

	brandController.Show(recorder, req)

	res := recorder.Result()

	if res.StatusCode != http.StatusOK {
		t.Errorf("expected status OK; got %v", res.StatusCode)
	}

	var response struct {
		Brands []models.Brand
	}
	err = json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		t.Fatal(err)
	}

	// Assert the expected brands
	expectedBrands := []models.Brand{
		{Brand: "Brand 1"},
		{Brand: "Brand 2"},
	}

	if !(len(response.Brands) > len(expectedBrands)) {
		t.Fatal("Wrong brand length: expected and actual lengths do not match")
	}

	for i, brand := range expectedBrands {
		if brand.Brand == response.Brands[i].Brand {
			t.Fatal("Brand names should not match")
		}
	}
}

func TestBrandControllers_Store(t *testing.T) {
	brandController := &controllers.BrandControllers{}

	newBrandName := generate(9)

	brand := models.Brand{
		Brand: newBrandName,
	}

	payload, err := json.Marshal(brand)
	if err != nil {
		t.Fatalf("failed to convert to json: %v", err)
	}

	request, err := http.NewRequest("POST", "/brand", bytes.NewBuffer(payload))
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	recorder := httptest.NewRecorder()

	brandController.Store(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Errorf("expected status %d, but got %d", http.StatusOK, recorder.Code)
	}

	var responseBrand models.Brand
	err = json.Unmarshal(recorder.Body.Bytes(), &responseBrand)
	if err != nil {
		t.Fatalf("failed to convert back from a json format: %v", err)
	}

	if responseBrand.Brand != brand.Brand {
		t.Errorf("expected brand name %q, but got %q", brand.Brand, responseBrand.Brand)
	}
}

var alphabet = []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func generate(size int) string {
	b := make([]byte, size)
	rand.Read(b)
	for i := 0; i < size; i++ {
		b[i] = alphabet[b[i]%byte(len(alphabet))]
	}
	return *(*string)(unsafe.Pointer(&b))
}
