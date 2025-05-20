package backend

import (
	"encoding/json"
	"net/http"
)

func writeJSON(w http.ResponseWriter, statusCode int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(payload)
}

func success(w http.ResponseWriter, statusCode int, data any) {
	writeJSON(w, statusCode, map[string]any{
		"success": true,
		"data":    data,
	})
}

func fail(w http.ResponseWriter, statusCode int, errMsg string) {
	writeJSON(w, statusCode, map[string]any{
		"success": false,
		"error":   errMsg,
	})
}
