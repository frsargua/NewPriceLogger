package models

import (
	"time"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Price struct {
	ID        int       `gorm:"primary_key"`
	ModelID   int       `validate:"required" error:"Model ID is required"`
	DateAdded time.Time `validate:"required" error:"Date Added is required"`
	Price     float64   `validate:"required,min=10,max=3000" error:"Price must be between 10 and 3000"`
	CreatedAt time.Time
	UpdatedAt time.Time
}


// Model     Phone `gorm:"foreignkey:ModelID"`
