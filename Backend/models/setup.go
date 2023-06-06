package models

import (
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() error {
	dsn := "host=localhost user=postgres dbname=smartphone port=5432 sslmode=disable"
	// dsn := fmt.Sprintf(
	// 	"host=%s user=%s dbname=%s port=%s sslmode=disable",
	// 	os.Getenv("DB_HOST"),
	// 	os.Getenv("DB_USER"),
	// 	os.Getenv("DB_NAME"),
	// 	os.Getenv("DB_PORT"),
	// )

	// newLogger := logger.New(
	// 	log.New(os.Stdout, "\r\n", log.LstdFlags),
	// 	logger.Config{
	// 		SlowThreshold: time.Second,
	// 		LogLevel:      logger.Info,
	// 		Colorful:      true,
	// 	},
	// )

	database, err := gorm.Open(postgres.Open(dsn))
	// , &gorm.Config{
	// 	Logger: newLogger,
	// }

	if err != nil {
		panic("Failed to connect to database")
	}

	database.AutoMigrate(&Brand{}, &Phone{}, &Price{})

	DB = database

	return nil

}
