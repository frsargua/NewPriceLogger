package models

import (
	"time"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Price struct {
	ID        uint `gorm:"primary_key"`
	ModelID   uint
	DateAdded time.Time
	Price     float64
	CreatedAt time.Time
	UpdatedAt time.Time
	Model     Phone `gorm:"foreignkey:ModelID"`
}
