package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/frsargua/NewPriceLogger/Backend/controllers"
)

func TestGetBrandTable(t *testing.T) {

	rr := httptest.NewRecorder()
	req, err := http.NewRequest(http.MethodGet, "/brands", nil)

	if err != nil {
		t.Error(err)
	}

	bc := &controllers.BrandControllers{}
	bc.Show(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status 200, but got %d", rr.Code)
	}

	if rr.Body.Len() > 10 {
		t.Errorf("Expected size, but got %s", "zero")
	}

}
