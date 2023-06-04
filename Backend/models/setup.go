package models

import (
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/jinzhu/gorm/dialects/postgres"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := fmt.Sprintf(
		"host=%s user=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)


	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), 
		logger.Config{
			SlowThreshold: time.Second,
			LogLevel:      logger.Info, 
			Colorful:      true,        
		},
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})


	
	if err != nil {
		panic("Failed to connect to database")
	}


	database.AutoMigrate(&Brand{},&Phone{},&Price{})


	DB = database
}
