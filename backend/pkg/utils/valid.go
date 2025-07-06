package utils

import (
	"regexp"
	"time"
)

type ValidationError struct {
	Message string
}

var (
	emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
)

func ValidateRegister(email, password, firstName, lastName, nickname, aboutMe string, dob time.Time, gender int) *ValidationError {
	if email == "" || password == "" || firstName == "" || lastName == "" {
		return &ValidationError{Message: "Email, password and full name fields are required"}
	}

	if !emailRegex.MatchString(email) {
		return &ValidationError{Message: "Invalid email format"}
	}

	if len(password) < 6 || len(password) > 72 {
		return &ValidationError{Message: "Password must be at least 6 and less than 72 characters"}
	}

	now := time.Now()
	age := now.Year() - dob.Year()
	if now.YearDay() < dob.YearDay() {
		age--
	}
	if age < 18 {
		return &ValidationError{Message: "You must be at least 18 years old"}
	}

	if gender < 1 || gender > 3 {
		return &ValidationError{Message: "Gender must be Male, Female, or Alien"}
	}

	if len(firstName) > 20 || len(lastName) > 20 {
		return &ValidationError{Message: "Names must be 1-20 characters"}
	}

	if len(aboutMe) > 500 {
		return &ValidationError{Message: "Maximum 500 characeters"}
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

func ValidateGroup(title, description string) *ValidationError {
	if title == "" || description == "" {
		return &ValidationError{Message: "Title and description are required"}
	}
	if len(title) < 3 || len(title) > 50 {
		return &ValidationError{Message: "Title must be 3-50 characters"}
	}
	if len(description) < 10 || len(description) > 500 {
		return &ValidationError{Message: "Description must be 10-500 characters"}
	}
	return nil
}

func ValidateEvent(title, description string, eventTime time.Time) *ValidationError {
	if title == "" || description == "" {
		return &ValidationError{Message: "Title and description are required"}
	}
	if len(title) < 3 || len(title) > 100 {
		return &ValidationError{Message: "Title must be 3-100 characters"}
	}
	if len(description) < 10 || len(description) > 1000 {
		return &ValidationError{Message: "Description must be 10-1000 characters"}
	}
	if eventTime.Before(time.Now()) {
		return &ValidationError{Message: "Event time must be in the future"}
	}
	return nil
}
