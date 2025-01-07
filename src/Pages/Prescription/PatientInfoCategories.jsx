import React, { useState, useEffect } from "react";
import categories from "./CategoriesData";
import FillDetailsSheet from "./FillDetailsSheet";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Close, Add } from "@mui/icons-material";

const PatientInfoCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const location = useLocation();
  const status = location.state?.status;
  const allergies = useSelector((state) => state.formData.Allergies);

  const categoryData = {
    Allergies: {
      columns: [
        "Allergen",
        "Reaction",
        "Onset Date",
        "Criticality",
        "Status",
        "Action",
      ],
      data: [
        {
          allergen: "Skin flap",
          reaction: "Itching and redness",
          onsetDate: "25-Sep-2024 08:35 AM",
          criticality: "High",
          status: "Active",
          action: "Review",
        },
      ],
    },
    Vitals: {
      columns: [
        "Date",
        "Blood Pressure",
        "Heart Rate",
        "Temperature",
        "Respiratory Rate",
        "Action",
      ],
      data: [
        {
          date: "25-Sep-2024 09:00 AM",
          bloodPressure: "120/80",
          heartRate: "72",
          temperature: "98.6",
          respiratoryRate: "16",
          action: "Monitor",
        },
      ],
    },
    "Chief Complaints": {
      columns: ["Date", "Complaint", "Severity", "Duration", "Notes", "Action"],
      data: [
        {
          date: "25-Sep-2024",
          complaint: "Headache",
          severity: "Moderate",
          duration: "2 days",
          notes: "Ongoing pain.",
          action: "Prescribe meds",
        },
      ],
    },
    Procedures: {
      columns: [
        "Procedure Name",
        "Date",
        "Performed By",
        "Location",
        "Notes",
        "Action",
      ],
      data: [
        {
          procedureName: "Appendectomy",
          date: "20-Aug-2023",
          performedBy: "Dr. Smith",
          location: "City Hospital",
          notes: "No issues.",
          action: "Follow-up",
        },
      ],
    },
    Diagnosis: {
      columns: [
        "Diagnosis Name",
        "Date Diagnosed",
        "Severity",
        "Diagnosed By",
        "Status",
        "Notes",
        "Action",
      ],
      data: [
        {
          diagnosisName: "Hypertension",
          dateDiagnosed: "10-Jan-2020",
          severity: "Moderate",
          diagnosedBy: "Dr. Adams",
          status: "Active",
          notes: "Lifestyle changes needed.",
          action: "Review meds",
        },
      ],
    },
    Medications: {
      columns: [
        "Medication Name",
        "Dosage",
        "Frequency",
        "Start Date",
        "End Date",
        "Prescribed By",
        "Notes",
        "Action",
      ],
      data: [
        {
          medicationName: "Lisinopril",
          dosage: "10 mg",
          frequency: "Once daily",
          startDate: "15-Jan-2020",
          endDate: "Ongoing",
          prescribedBy: "Dr. Adams",
          notes: "Effective BP control.",
          action: "Monitor",
        },
      ],
    },
    "Surgical History": {
      columns: [
        "Surgery Name",
        "Date",
        "Surgeon",
        "Location",
        "Outcome",
        "Notes",
        "Action",
      ],
      data: [
        {
          surgeryName: "Knee Replacement",
          date: "12-Sep-2018",
          surgeon: "Dr. Brown",
          location: "Orthopedic Center",
          outcome: "Recovered well.",
          notes: "Physiotherapy advised.",
          action: "Schedule follow-up",
        },
      ],
    },
    "Medical History": {
      columns: ["Condition", "Date Diagnosed", "Status", "Notes", "Action"],
      data: [
        {
          condition: "Diabetes Type 2",
          dateDiagnosed: "01-Mar-2015",
          status: "Managed",
          notes: "Diet critical.",
          action: "Periodic check-ups",
        },
      ],
    },
    "Family History": {
      columns: [
        "Condition",
        "Family Member",
        "Onset Age",
        "Severity",
        "Notes",
        "Action",
      ],
      data: [
        {
          condition: "Heart Disease",
          familyMember: "Father",
          onsetAge: "50",
          severity: "Severe",
          notes: "Genetic risk.",
          action: "Counseling",
        },
      ],
    },
  };

  useEffect(() => {
    const defaultCategory = categories.find((cat) => cat.name === "Allergies");
    if (defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, []);

  const handleButtonClick = (category) => {
    setSelectedCategory(category);
    setIsFormSheetOpen(true);
  };

  const closeSheet = () => {
    setIsFormSheetOpen(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "86vh",
        p: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      {status === "Checked In" && (
        <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
          {/* Left Side: Categories */}
          <Box
            sx={{
              width: "300px",
              height: "100%",
              overflowY: "auto",
              pr: 2,
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
              },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {categories.map((category, index) => (
                <Card
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 0,
                    cursor: "pointer",
                    boxShadow: "none",
                    border: "1px solid #e0e0e0",
                    transition: "all 0.2s ease",
                    backgroundColor:
                      selectedCategory?.name === category.name
                        ? "#e8f4fd"
                        : "white",
                    "&:hover": {
                      backgroundColor: "#f0f7ff",
                      transform: "translateX(2px)",
                    },
                  }}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent
                    sx={{
                      p: "12px !important",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      {category.name}(1)
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.8rem",
                        color: "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      {category.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ pr: 2 }}>{category.icon}</Box>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Right Side: Dynamic Table */}
          <Box sx={{ flex: 1, ml: 2 }}>
            <TableContainer
              component={Paper}
              sx={{
                height: "100%",
                borderRadius: 1,
                boxShadow: 1,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {selectedCategory && (
                <>
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",

                      color: "#2c3e50",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {selectedCategory.name}
                    </Typography>
                    <IconButton
                      //  onClick={() => handleButtonClick(category)}
                      size="small"
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#45a049",
                        },
                        width: 32,
                        height: 32,
                      }}
                      onClick={() => handleButtonClick(selectedCategory)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {categoryData[selectedCategory.name]?.columns.map(
                          (column, index) => (
                            <TableCell
                              key={index}
                              sx={{
                                color: "#2c3e50",
                                fontWeight: 600,
                                backgroundColor: "#e8f4fd",
                                borderBottom: "2px solid teal-100",
                              }}
                            >
                              {column}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoryData[selectedCategory.name]?.data.map(
                        (row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#f8fafc" : "white",
                              "&:hover": {
                                backgroundColor: "#f0f7ff",
                              },
                            }}
                          >
                            {categoryData[selectedCategory.name].columns.map(
                              (column, colIndex) => (
                                <TableCell key={colIndex}>
                                  {column === "Action" ? (
                                    <Box>
                                      <IconButton
                                        size="small"
                                        sx={{
                                          color: "teal",
                                          mr: 1,
                                        }}
                                      >
                                        <Edit fontSize="small" />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        sx={{
                                          color: "#e74c3c",
                                        }}
                                      >
                                        <Close fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  ) : (
                                    row[
                                      Object.keys(row).find(
                                        (key) =>
                                          key.toLowerCase() ===
                                          column.toLowerCase().replace(/ /g, "")
                                      )
                                    ]
                                  )}
                                </TableCell>
                              )
                            )}
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </>
              )}
              {!selectedCategory && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    color: "#666",
                  }}
                >
                  <Typography>Select a category to view details</Typography>
                </Box>
              )}
            </TableContainer>
          </Box>
        </Box>
      )}

      {/* FillDetailsSheet Component */}
      {selectedCategory && (
        <FillDetailsSheet
          isDialogOpen={isFormSheetOpen}
          setIsDialogOpen={setIsFormSheetOpen}
          selectedCategory={selectedCategory}
          closeSheet={closeSheet}
        />
      )}
    </Box>
  );
};

export default PatientInfoCategories;
