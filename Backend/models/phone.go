package models

import (
	"time"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Phone struct {
	ID           uint      `gorm:"primary_key"`
	BrandName    string    `validate:"required,min=3,max=30"`
	Model        string    `gorm:"unique"`
	ReleaseDate  time.Time `validate:"required"`
	ReleasePrice float64   `validate:"required,min=10,max=3000"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Brand        Brand `gorm:"foreignkey:BrandName"`
}
