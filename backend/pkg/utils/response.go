package utils

import (
	"encoding/json"
	"log"
	"net/http"
)

func WriteJSON(w http.ResponseWriter, statusCode int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	// Handle the error from JSON encoding
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		// Log the error but don't try to write another response
		log.Printf("Error encoding JSON: %v", err)
		return
	}
}

func Success(w http.ResponseWriter, statusCode int, data any) {
	WriteJSON(w, statusCode, map[string]any{
		"success": true,
		"data":    data,
	})
}

func Fail(w http.ResponseWriter, statusCode int, errMsg string) {
	WriteJSON(w, statusCode, map[string]any{
		"success": false,
		"error":   errMsg,
	})
}
