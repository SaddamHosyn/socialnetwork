package utils

import (
	"bytes"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"os"

	"github.com/google/uuid"
)

const (
	MaxImageSize   = 10 << 20 // 10 MB
	MaxImageWidth  = 1024
	MaxImageHeight = 1024
)

func SaveUploadFile(fh *multipart.FileHeader) (string, *ValidationError) {
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
		img = NearestNeighborResize(img, w, h)
	}

	buf := &bytes.Buffer{}
	if err := encode(buf, img); err != nil {
		return nil, "", &ValidationError{Message: "Failed to re-encode image"}
	}
	return buf.Bytes(), ext, nil
}

func NearestNeighborResize(src image.Image, w2, h2 int) *image.RGBA {
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
