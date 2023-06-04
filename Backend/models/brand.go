package models

import "time"

type Brand struct {
	ID        uint   `gorm:"primary_key"`
	Brand     string `gorm:"unique"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
