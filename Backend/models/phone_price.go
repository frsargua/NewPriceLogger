package models

import (
	"time"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Price struct {
	ID        int `gorm:"primary_key"`
	ModelID   int
	DateAdded time.Time
	Price     float64
	CreatedAt time.Time
	UpdatedAt time.Time
}

// Model     Phone `gorm:"foreignkey:ModelID"`
