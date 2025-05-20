package backend

import (
	"bytes"
	"io"
	"image"
    "image/gif"
    "image/jpeg"
	"fmt"
    "image/png"
	"mime/multipart"
	"github.com/google/uuid"
	"os"
	//"github.com/disintegration/imaging"
	// "github.com/wagslane/go-password-validator"
	// "net/mail"
	"regexp"
)

type ValidationError struct {
	Message string
}

var (
	nicknameRegex = regexp.MustCompile(`^[a-zA-Z0-9_-]{3,20}$`)
	emailRegex    = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	//passStrength  = 20.0
)

func ValidateRegister(nickname, email, password, firstName, lastName string, age, gender int) *ValidationError {
	if nickname == "" || email == "" || password == "" || firstName == "" || lastName == "" {
		return &ValidationError{Message: "All fields are required"}
	}

	if !nicknameRegex.MatchString(nickname) {
		return &ValidationError{Message: "Nickname must be 3-20 characters (alphanumeric, _, -)"}
	}

	// if _, err := mail.ParseAddress(email); err != nil {
	// 	return &ValidationError{Message: invalidEmail}
	// }

	if !emailRegex.MatchString(email) {
		return &ValidationError{Message: "Invalid email format"}
	}

	if len(password) < 6 || len(password) > 72 {
		return &ValidationError{Message: "Password must be at least 6 and less than 72 characters"}
	}

	// if err := passwordvalidator.Validate(password, passStrength); err != nil {
	// 	return &ValidationError{Message: "Password is too weak: " + err.Error()}
	// }

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

// var allowedMIMEs = map[string]string{
// 	"image/jpeg": ".jpg",
// 	"image/png":  ".png",
// 	"image/gif":  ".gif",
// }

const (
	MaxImageSize   = 10 << 20 // 10 MB
	MaxImageWidth  = 1024
	MaxImageHeight = 1024
)

func saveUploadFile(fh *multipart.FileHeader) (string, *ValidationError) {
    file, err := fh.Open()
    if err != nil {
        return "", &ValidationError{Message: "Invalid image data"}
    }
    defer file.Close()

    buf := &bytes.Buffer{}
    if _, err := io.CopyN(buf, file, MaxImageSize+1); err != nil && err != io.EOF {
        return "", &ValidationError{Message: "Invalid image data"}
    }
    if buf.Len() > MaxImageSize {
        return "", &ValidationError{Message: "Image must be under 10 MB"}
    }

    processed, ext, verr := ValidateImage(bytes.NewReader(buf.Bytes()), fh.Header.Get("Content-Type"))
    if verr != nil {
        return "", verr
    }

    // ensure upload dir
    if err := os.MkdirAll("./uploads", 0755); err != nil {
        return "", &ValidationError{Message: "Could not prepare upload directory"}
    }

    filename := fmt.Sprintf("./uploads/%s%s", uuid.New().String(), ext)
    if err := os.WriteFile(filename, processed, 0644); err != nil {
        return "", &ValidationError{Message: "Could not save image"}
    }
    return filename, nil
}

func ValidateImage(r io.Reader, mimeType string) ([]byte, string, *ValidationError) {
    // lookup extension + encoder
    var (
        ext    string
        encode func(io.Writer, image.Image) error
    )
    switch mimeType {
    case "image/jpeg", "image/jpg":
        ext = ".jpg"
        encode = func(w io.Writer, img image.Image) error {
            return jpeg.Encode(w, img, &jpeg.Options{Quality: 85})
        }
    case "image/png":
        ext = ".png"
        encode = png.Encode
    case "image/gif":
        ext = ".gif"
        encode = func(w io.Writer, img image.Image) error {
            return gif.Encode(w, img, nil)
        }
    default:
        return nil, "", &ValidationError{Message: "Unsupported image format"}
    }

    img, _, err := image.Decode(r)
    if err != nil {
        return nil, "", &ValidationError{Message: "Invalid image data"}
    }

    w, h := img.Bounds().Dx(), img.Bounds().Dy()
    if w > MaxImageWidth || h > MaxImageHeight {
        // preserve aspect ratio
        if float64(w)/float64(MaxImageWidth) > float64(h)/float64(MaxImageHeight) {
            h = h * MaxImageWidth / w
            w = MaxImageWidth
        } else {
            w = w * MaxImageHeight / h
            h = MaxImageHeight
        }
        img = nearestNeighborResize(img, w, h)
    }

    buf := &bytes.Buffer{}
    if err := encode(buf, img); err != nil {
        return nil, "", &ValidationError{Message: "Failed to re-encode image"}
    }
    return buf.Bytes(), ext, nil
}

func nearestNeighborResize(src image.Image, w2, h2 int) *image.RGBA {
    b := src.Bounds()
    w1, h1 := b.Dx(), b.Dy()
    dst := image.NewRGBA(image.Rect(0, 0, w2, h2))
    for y2 := 0; y2 < h2; y2++ {
        y1 := b.Min.Y + y2*h1/h2
        for x2 := 0; x2 < w2; x2++ {
            x1 := b.Min.X + x2*w1/w2
            dst.Set(x2, y2, src.At(x1, y1))
        }
    }
    return dst
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

////////////////////////////////////////////////////////////////// DO NOT DELETE!!! ////////////////////////////////////////////////////////////////////////////////

// func ValidateImage(data []byte, mimeType string) ([]byte, string, error) {
// 	// lookup extension
// 	ext, ok := allowedMIMEs[mimeType]
// 	if !ok {
// 		return nil, "", fmt.Errorf("unsupported image type %s", mimeType)
// 	}

// 	// decode
// 	img, err := imaging.Decode(bytes.NewReader(data))
// 	if err != nil {
// 		return nil, "", fmt.Errorf("invalid image data")
// 	}

// 	// resize if too large
// 	w, h := img.Bounds().Dx(), img.Bounds().Dy()
// 	if w > MaxImageWidth || h > MaxImageHeight {
// 		img = imaging.Fit(img, MaxImageWidth, MaxImageHeight, imaging.Lanczos)
// 	}

// 	// re-encode
// 	out := &bytes.Buffer{}

// 	switch ext {
// 	case ".jpg":
// 		err = imaging.Encode(out, img, imaging.JPEG)
// 	case ".png":
// 		err = imaging.Encode(out, img, imaging.PNG)
// 	case ".gif":
// 		err = imaging.Encode(out, img, imaging.GIF)
// 	}
// 	if err != nil {
// 		return nil, "", fmt.Errorf("failed to encode image: %v", err)
// 	}

// 	return out.Bytes(), ext, nil
// }