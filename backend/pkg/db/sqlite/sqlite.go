package sqlite

import (
	"database/sql"
	"log"
	"time"

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
	// Use WAL mode and other optimizations for better concurrency
	db, err := sql.Open("sqlite3", filepath+"?_journal_mode=WAL&_synchronous=NORMAL&_cache_size=1000&_foreign_keys=ON&_busy_timeout=5000")
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Enable foreign keys (redundant with connection string but kept for clarity)
	_, err = db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		log.Fatal("Error enabling foreign keys:", err)
	}

	// Set WAL mode (redundant with connection string but kept for clarity)
	_, err = db.Exec("PRAGMA journal_mode = WAL;")
	if err != nil {
		log.Fatal("Error setting WAL mode:", err)
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
