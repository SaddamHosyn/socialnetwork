package utils

import (
	"regexp"
)

type ValidationError struct {
	Message string
}

var (
	nicknameRegex = regexp.MustCompile(`^[a-zA-Z0-9_-]{3,20}$`)
	emailRegex    = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
)

func ValidateRegister(nickname, email, password, firstName, lastName string, age, gender int) *ValidationError {
	if nickname == "" || email == "" || password == "" || firstName == "" || lastName == "" {
		return &ValidationError{Message: "All fields are required"}
	}

	if !nicknameRegex.MatchString(nickname) {
		return &ValidationError{Message: "Nickname must be 3-20 characters (alphanumeric, _, -)"}
	}

	if !emailRegex.MatchString(email) {
		return &ValidationError{Message: "Invalid email format"}
	}

	if len(password) < 6 || len(password) > 72 {
		return &ValidationError{Message: "Password must be at least 6 and less than 72 characters"}
	}

	if age < 18 || age > 120 {
		return &ValidationError{Message: "Age must be between 18 and 120"}
	}

	if gender < 1 || gender > 3 {
		return &ValidationError{Message: "Gender must be Male, Female, or Alien"}
	}

	if len(firstName) > 20 || len(lastName) > 20 {
		return &ValidationError{Message: "Names must be 1-20 characters"}
	}

	return nil
}

func ValidateLogin(login, password string) *ValidationError {
	if login == "" || password == "" {
		return &ValidationError{Message: "Login and password are required"}
	}

	if len(login) < 1 {
		return &ValidationError{Message: "Login must be at least 1 character"}
	}

	if len(password) < 6 {
		return &ValidationError{Message: "Password must be at least 6 characters"}
	}
	return nil
}

func ValidatePost(title, content string, cats []string) *ValidationError {
	if title == "" || content == "" {
		return &ValidationError{Message: "Title and content required"}
	}
	if len(cats) < 1 || len(cats) > 3 {
		return &ValidationError{Message: "Select 1 - 3 categories"}
	}
	if len(title) > 100 {
		return &ValidationError{Message: "Title under 100 chars"}
	}
	if len(content) > 1000 {
		return &ValidationError{Message: "Content under 1000 chars"}
	}
	return nil
}

func ValidateComment(content string) *ValidationError {
	if content == "" {
		return &ValidationError{Message: "Comment cannot be empty"}
	}
	if len(content) > 1000 {
		return &ValidationError{Message: "Comment must be under 1000 characters"}
	}
	return nil
}
