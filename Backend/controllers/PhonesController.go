package controllers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/frsargua/NewPriceLogger/Backend/models"
	"github.com/go-playground/validator"
	"github.com/gorilla/mux"
	"github.com/sashabaranov/go-openai"
)

type PhonesController struct {
	// App *firebase.App
}

type PhoneModel struct {
	Model string `json:"content"`
}

func (pc *PhonesController) Show(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var phones []models.Phone

	if err := models.DB.Find(&phones).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		Phones []models.Phone `json:"phones"`
	}{
		Phones: phones,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (pc *PhonesController) ShowID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)

	var phone models.Phone
	phoneId := vars["id"]

	if err := validateId(phoneId); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := models.DB.First(&phone, phoneId).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		Phone models.Phone `json:"phone"`
	}{
		Phone: phone,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (pc *PhonesController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	phoneID := vars["id"]

	if err := validateId(phoneID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var updatedPhone models.UpdatePhone
	err := json.NewDecoder(r.Body).Decode(&updatedPhone)
	if err != nil {
		http.Error(w, "Fail to get body", http.StatusBadRequest)
		return
	}
	err = validatePhone(updatedPhone)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var existingPhone models.Phone
	if err := models.DB.First(&existingPhone, phoneID).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Update the existing phone object with the new data
	existingPhone.BrandName = updatedPhone.BrandName
	existingPhone.Model = updatedPhone.Model
	existingPhone.ReleasePrice = updatedPhone.ReleasePrice

	if err := models.DB.Save(&existingPhone).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(existingPhone)
}

func (pc *PhonesController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var phone models.Phone

	err := json.NewDecoder(r.Body).Decode(&phone)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(phone)

	// Validate brand field
	err = validatePhone(phone)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := models.DB.Create(&phone).Error; err != nil {
		http.Error(w, "Phone model might not be unique", http.StatusInternalServerError)
		return
	}

	// Return the created phone in the response
	response, err := json.Marshal(phone)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

// func (pc *PhonesController) UploadImage(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")

// 	file, fileHeader, err := r.FormFile("image")

// 	if err != nil {
// 		http.Error(w, "Failed to get filed to be uploaded", http.StatusBadRequest)
// 		return
// 	}
// 	fileName := fileHeader.Filename

// 	client, err := pc.App.Storage(r.Context())
// 	if err != nil {
// 		http.Error(w, "Failed to initialize Firebase Storage client", http.StatusInternalServerError)
// 		return
// 	}

// 	bucket, err := client.DefaultBucket()
// 	if err != nil {
// 		http.Error(w, "Failed to get default bucket", http.StatusInternalServerError)
// 		return
// 	}

// 	obj := bucket.Object(fileName)

// 	wc := obj.NewWriter(r.Context())
// 	defer wc.Close()

// 	_, err = io.Copy(wc, file)
// 	if err != nil {
// 		http.Error(w, "Failed to upload image", http.StatusInternalServerError)
// 		return
// 	}

// 	attrs, err := obj.Attrs(r.Context())
// 	if err != nil {
// 		http.Error(w, "Failed to get object attributes", http.StatusInternalServerError)
// 		return
// 	}

// 	imageURL := attrs.MediaLink

// 	log.Printf("Image uploaded: %s", imageURL)

// 	// Send a response with the image URL
// 	w.WriteHeader(http.StatusOK)
// 	w.Write([]byte(imageURL))
// }

func (pc *PhonesController) WhatIsThe(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var phoneModel PhoneModel
	err := json.NewDecoder(r.Body).Decode(&phoneModel)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	client := openai.NewClient(os.Getenv("OPEN_AI"))

	content := fmt.Sprintf(`what was the release price of a %s? Just give me the UK price in a short prompt.`, phoneModel.Model)
	fmt.Println(content)

	resp, err := client.CreateChatCompletion(context.Background(), openai.ChatCompletionRequest{
		Model: openai.GPT3Dot5Turbo,
		Messages: []openai.ChatCompletionMessage{{
			Role:    openai.ChatMessageRoleUser,
			Content: content,
		}},
	})

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	response := struct {
		Message string `json:"message"`
	}{
		Message: resp.Choices[0].Message.Content,
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		fmt.Printf("JSON marshal error: %v\n", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
}
func (pc *PhonesController) GetFakeImage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var phoneModel PhoneModel
	err := json.NewDecoder(r.Body).Decode(&phoneModel)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	client := openai.NewClient(os.Getenv("OPEN_AI"))

	content := fmt.Sprintf(` an %s smartphone in a white background`, phoneModel.Model)

	ctx := context.Background()

	// Sample image by link
	reqUrl := openai.ImageRequest{
		Prompt:         content,
		Size:           openai.CreateImageSize512x512,
		ResponseFormat: openai.CreateImageResponseFormatURL,
		N:              1,
	}

	respUrl, err := client.CreateImage(ctx, reqUrl)
	if err != nil {
		fmt.Printf("Image creation error: %v\n", err)
		return
	}

	response := struct {
		URL string `json:"url"`
	}{
		URL: respUrl.Data[0].URL,
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		fmt.Printf("JSON encoding error: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
}

func (pc *PhonesController) Destroy(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	phoneID := vars["id"]
	var existingPhone models.Phone

	if err := validateId(phoneID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	if err := models.DB.First(&existingPhone, phoneID).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := models.DB.Delete(&existingPhone).Error; err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// func (pc *PhonesController) InitialiseFirebase() {

// 	opt := option.WithCredentialsFile("./serviceAccountKey.json")
// 	app, err := firebase.NewApp(context.Background(), nil, opt)
// 	if err != nil {
// 		log.Fatalln(err)
// 	}

// 	pc.App = app
// }

func validatePhone(phone any) error {
	validate := validator.New()

	err := validate.Struct(phone)
	if err != nil {
		var validationErrors []string
		for _, err := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, err.ActualTag())
		}
		return errors.New(strings.Join(validationErrors, ", "))
	}

	return nil
}

func validateId(phoneId string) error {
	if phoneId == "" {
		return errors.New("Missing or empty Id")
	}

	// if _, err := strconv.Atoi(phoneId); err != nil {
	// 	return errors.New("Invalid Id format")
	// }

	return nil
}
func convertString(input string) string {
	converted := strings.ReplaceAll(input, "-", " ")
	return converted
}
