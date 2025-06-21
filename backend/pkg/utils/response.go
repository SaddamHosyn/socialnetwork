package utils

import (
	"encoding/json"
	"net/http"
)

func WriteJSON(w http.ResponseWriter, statusCode int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(payload)
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
