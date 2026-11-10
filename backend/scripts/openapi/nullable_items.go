package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"

	"sigs.k8s.io/yaml"
)

// nullableItemsExtension marks an array field whose items can be null (struct tag
// `extensions:"x-nullable-items"`). swag cannot set nullable on an items schema, so the generated
// spec is rewritten: the items get the OpenAPI 3.1 type [<type>, "null"] and the marker is removed.
const nullableItemsExtension = "x-nullable-items"

// swagger.json and docs.go hold all the schemas on this one line of compact JSON.
const componentsLinePrefix = `    "components": `

func rewriteFile(filePath string, rewrite func([]byte) ([]byte, error)) error {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("read %s: %w", filePath, err)
	}
	rewritten, err := rewrite(content)
	if err != nil {
		return fmt.Errorf("set nullable items in %s: %w", filePath, err)
	}
	if err := os.WriteFile(filePath, rewritten, 0644); err != nil {
		return fmt.Errorf("write %s: %w", filePath, err)
	}
	return nil
}

func nullableItemsYAML(content []byte) ([]byte, error) {
	asJSON, err := yaml.YAMLToJSON(content)
	if err != nil {
		return nil, fmt.Errorf("convert yaml to json: %w", err)
	}
	rewritten, err := nullableItemsJSON(asJSON)
	if err != nil {
		return nil, err
	}
	asYAML, err := yaml.JSONToYAML(rewritten)
	if err != nil {
		return nil, fmt.Errorf("convert json to yaml: %w", err)
	}
	return asYAML, nil
}

// nullableItemsComponentsLine rewrites the components line only: docs.go is a Go template around
// the JSON, so neither file can be decoded as a whole.
func nullableItemsComponentsLine(content []byte) ([]byte, error) {
	lines := bytes.Split(content, []byte("\n"))
	for i, line := range lines {
		value, found := bytes.CutPrefix(line, []byte(componentsLinePrefix))
		if !found {
			continue
		}
		value, trailingComma := bytes.CutSuffix(value, []byte(","))
		rewritten, err := nullableItemsJSON(value)
		if err != nil {
			return nil, err
		}
		newLine := append([]byte(componentsLinePrefix), rewritten...)
		if trailingComma {
			newLine = append(newLine, ',')
		}
		lines[i] = newLine
		return bytes.Join(lines, []byte("\n")), nil
	}
	return nil, fmt.Errorf("no line starts with %q", componentsLinePrefix)
}

func nullableItemsJSON(content []byte) ([]byte, error) {
	decoder := json.NewDecoder(bytes.NewReader(content))
	decoder.UseNumber()
	var document any
	if err := decoder.Decode(&document); err != nil {
		return nil, fmt.Errorf("decode json: %w", err)
	}
	if err := setNullableItems(document, ""); err != nil {
		return nil, err
	}
	encoded, err := json.Marshal(document)
	if err != nil {
		return nil, fmt.Errorf("encode json: %w", err)
	}
	return encoded, nil
}

func setNullableItems(node any, path string) error {
	switch n := node.(type) {
	case map[string]any:
		if marker, found := n[nullableItemsExtension]; found {
			if err := makeItemsNullable(n, marker, path); err != nil {
				return err
			}
		}
		for key, child := range n {
			if err := setNullableItems(child, path+"/"+key); err != nil {
				return err
			}
		}
	case []any:
		for i, child := range n {
			if err := setNullableItems(child, fmt.Sprintf("%s/%d", path, i)); err != nil {
				return err
			}
		}
	}
	return nil
}

func makeItemsNullable(schema map[string]any, marker any, path string) error {
	if marker != true {
		return fmt.Errorf("%s: %s must be true, got %v", path, nullableItemsExtension, marker)
	}
	items, isMap := schema["items"].(map[string]any)
	if !isMap {
		return fmt.Errorf("%s: %s is set on a schema with no items", path, nullableItemsExtension)
	}
	itemType, isString := items["type"].(string)
	if !isString {
		return fmt.Errorf("%s: %s needs items of one type, got %v", path, nullableItemsExtension, items["type"])
	}
	items["type"] = []any{itemType, "null"}
	delete(schema, nullableItemsExtension)
	return nil
}
