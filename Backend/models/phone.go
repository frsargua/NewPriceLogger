package models

import (
	"time"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Phone struct {
	ID           uint       `gorm:"primary_key"`
	BrandName    string
	Model        string     `gorm:"unique"`
	ReleaseDate  time.Time
	ReleasePrice float64
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Brand        Brand      `gorm:"foreignkey:BrandName"`
}
