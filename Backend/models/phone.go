package models

import (
	"time"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Phone struct {
	ID           int `gorm:"primary_key"`
	BrandName    string
	Model        string
	ReleaseDate  time.Time `validate:"required"`
	ReleasePrice float64   `validate:"required,min=10,max=3000"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Prices       []Price `gorm:"foreignkey:ModelID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Brand        Brand   `gorm:"foreignKey:BrandName;references:Brand"`
}

type UpdatePhone struct {
	BrandName    string
	Model        string
	ReleasePrice float64 `validate:"required,min=10,max=3000"`
}
