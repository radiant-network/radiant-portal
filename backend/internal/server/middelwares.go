package server

import (
	"encoding/json"
	"log"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

type DecodedJWT struct {
	Name string
    jwt.StandardClaims
}

func ExtractJWTInformation() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
			c.Next()
            return
        }

        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
			c.Next()
            return
        }

		tokenParts := strings.Split(parts[1], ".")
		if len(tokenParts) != 3 {
			c.Next()
            return
        }

		decoded, err := jwt.DecodeSegment(tokenParts[1])
		if err != nil {
			log.Print("Error decoding token: ", err)
			c.Next()
			return
		}

		decodedJWT := &DecodedJWT{}
		err = json.Unmarshal(decoded, decodedJWT)
		if err != nil {
			log.Print("Error parsing token: ", err)
			c.Next()
			return
		}

		c.Set("decodedJWT", decodedJWT)
		c.Next()
    }
}
