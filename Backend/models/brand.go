package models

import "time"

type Brand struct {
	ID        int    `gorm:"primary_key"`
	Brand     string `gorm:"unique"`
	CreatedAt time.Time
	UpdatedAt time.Time
	Phones    []Phone `gorm:"foreignKey:BrandName;references:Brand;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
