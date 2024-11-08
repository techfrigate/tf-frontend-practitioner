import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";

const GlobalForm = ({
  formFields,
  onSubmit,
  className,
  buttonText,
  editId,
}) => {
  const [formData, setFormData] = useState({});
  const [filteredSuggestions, setFilteredSuggestions] = useState({});
  useEffect(() => {
    const updatedData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value || "";
      return acc;
    }, {});
    setFormData(updatedData);

    const initialSuggestions = formFields.reduce((acc, field) => {
      if (field.suggestions) {
        acc[field.name] = field.suggestions;
      }
      return acc;
    }, {});
    setFilteredSuggestions(initialSuggestions);
  }, [formFields]);

  const handleChange = (e, field) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (field.suggestions && type === "text") {
      const suggestions = field.suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions((prevState) => ({
        ...prevState,
        [name]: suggestions.length ? suggestions : ["Not Found"],
      }));
    }

    if (field.onChange) {
      field.onChange(e);
    }
  };

  const handleSelectSuggestion = (name, value, field) => {
    if (value === "Not Found") return;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setFilteredSuggestions((prevState) => ({
      ...prevState,
      [name]: [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, resetForm);
  };

  const resetForm = () => {
    setFormData(
      formFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {})
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
     <ScrollArea className={`h-[500px]`}>
     <div className={className}>
        {formFields.map((field) => (
          <div key={field.name} className="relative flex flex-col">
            <Label className="mb-3">{field.label}</Label>

            {/* Select input */}
            {field.type === "select" ? (
              <Select
                onValueChange={(value) =>
                  handleChange({ target: { name: field.name, value } }, field)
                }
                value={formData[field.name] || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === "textarea" ? (
              <Textarea
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(e, field)}
                placeholder={field.placeholder || ""}
                required={field.required || false}
              />
            ) : (
              <div className="relative">
                {/* Text input */}
                <Input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(e, field)}
                  placeholder={field.placeholder || ""}
                  required={field.required || false}
                  autoComplete="off"
                />
                {/* Dropdown Suggestions */}
                {field.suggestions && formData[field.name] && (
                  <ul className="absolute z-10 bg-white rounded-md shadow-md w-full max-h-40 overflow-auto mt-1">
                    {filteredSuggestions[field.name]?.map(
                      (suggestion, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleSelectSuggestion(
                              field.name,
                              suggestion,
                              field
                            )
                          }
                        >
                          {suggestion}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
     </ScrollArea>
      <div className="mt-7 flex justify-center gap-2">
        <Button variant="forest" type="submit">
          {buttonText}
        </Button>
        {editId && (
          <Button
            onClick={() => {
              resetForm();
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </form>
  );
};

export default GlobalForm;
