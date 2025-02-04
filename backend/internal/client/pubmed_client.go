package client

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
) 

type PubmedClient struct {
    httpClient *http.Client
	baseUrl    string
	cache 		map[string]*types.PubmedCitation
	cacheMutex 	sync.RWMutex
}

type PubmedClientService interface {
	GetCitationById(id string) (*types.PubmedCitation, error)
}

func NewPubmedClient() *PubmedClient {
    return &PubmedClient{
        httpClient: &http.Client{Timeout: time.Duration(15) * time.Second},
        baseUrl:    os.Getenv("PUBMED_BASE_URL"),
		cache: make(map[string]*types.PubmedCitation),
    }
}

func (client * PubmedClient) GetCitationById(id string) (*types.PubmedCitation, error) {
	citation, found := client.getCitationByIdFromCache(id)
	if found {
		return citation, nil
	}

	res, err := client.httpClient.Get(fmt.Sprintf("%s/lit/ctxp/v1/pubmed/?format=citation&id=%s", client.baseUrl, id))
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	// could'nt get one during tests but just in case
	if res.StatusCode == http.StatusNotFound { 
		return nil, nil
	}
	if res.StatusCode != http.StatusOK {
		err = fmt.Errorf("Error while fetching citation from pubmed: %d %s", res.StatusCode, string(data));
		log.Print(err)
		return nil, err
	}
	citation = &types.PubmedCitation{}
	if err := json.Unmarshal(data, citation); err != nil {
		err = fmt.Errorf("Error while parsing citation from pubmed: %d %s", res.StatusCode, string(data));
		log.Print(err)
		return nil, nil // equivalent to NOT FOUND during tests
	}
	client.cacheMutex.Lock()
	defer client.cacheMutex.Unlock()
	client.cache[id] = citation
	return citation, nil
}

func (client * PubmedClient) getCitationByIdFromCache(id string) (*types.PubmedCitation, bool) {
	client.cacheMutex.RLock()
	defer client.cacheMutex.RUnlock()
	item, found := client.cache[id]
	return item, found
}

