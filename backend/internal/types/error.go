package types

// ApiError represents an error
// @Description ApiError represents an error
type ApiError struct {
	Status  int    `json:"status,omitempty" validate:"required"`
	Message string `json:"message,omitempty" validate:"required"`
	Detail  any    `json:"detail,omitempty"`
} // @name ApiError
