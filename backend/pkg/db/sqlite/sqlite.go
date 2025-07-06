package sqlite

import (
	"database/sql"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func SetDB(database *sql.DB) {
	if database == nil {
		log.Fatal("Database connection is nil")
	}
	db = database
}

func GetDB() *sql.DB {
	if db == nil {
		log.Fatal("DB not initialized")
	}
	return db
}

func InitDB(filepath string) *sql.DB {
	db, err := sql.Open("sqlite3", filepath)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}
	_, err = db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {

		log.Fatal("Error enabling foreign keys:", err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatal("Error pinging database:", err)
	}
	return db
}

func ApplyMigrations(db *sql.DB) error {
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		return err
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file://pkg/db/migrations/sqlite",
		"sqlite3", driver)
	if err != nil {
		return err
	}
	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		return err
	}
	return nil
}
