import React, { useState } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../Components/ui/avatar";
import { ScrollArea, ScrollBar } from "../../Components/ui/scroll-area";
import { Badge } from "../../Components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../Components/ui/tabs";
import { showErrorToast, showSuccessToast } from "../../Components/toastUtils";
import PatientTableContent from "./PatientTableContent";
import { useNavigate } from "react-router-dom";
import { StethoscopeIcon, TableIcon } from "lucide-react";
import { useSelector } from "react-redux";

const patientsData = [
  {
    id: 1,
    name: "Rohit Kumar",
    age: "34Y",
    gender: "Male",
    initials: "RK",
    team: "Medical",
    type: "Appointment",
    startTime: "25-Sep-2024 09:00 AM",
    endTime: "25-Sep-2024 09:10 AM",
    status: "Scheduled",
  },
  {
    id: 2,
    name: "Dipti Kumari",
    age: "26Y",
    gender: "Female",
    initials: "DK",
    team: "Medical",
    type: "Appointment",
    startTime: "29-Sep-2024 09:00 AM",
    endTime: "29-Sep-2024 09:10 AM",
    status: "Scheduled",
  },
  {
    id: 3,
    name: "Neha Verma",
    age: "29Y",
    gender: "Female",
    initials: "NV",
    team: "Surgery",
    type: "Appointment",
    startTime: "26-Sep-2024 11:00 AM",
    endTime: "26-Sep-2024 11:10 AM",
    status: "Checked In",
  },
  {
    id: 4,
    name: "Arjun Mehta",
    age: "45Y",
    gender: "Male",
    initials: "AM",
    team: "Cardiology",
    type: "Appointment",
    startTime: "27-Sep-2024 02:00 PM",
    endTime: "27-Sep-2024 02:10 PM",
    status: "Checked Out",
  },
  {
    id: 5,
    name: "Priya Singh",
    age: "38Y",
    gender: "Female",
    initials: "PS",
    team: "Orthopedics",
    type: "Appointment",
    startTime: "28-Sep-2024 10:30 AM",
    endTime: "28-Sep-2024 10:40 AM",
    status: "Closed",
  },
];

const allowedTransitions = {
  Scheduled: ["Checked In"],
  "Checked In": ["Checked Out"],
  "Checked Out": ["Closed"],
  Closed: [],
};

const initialStatuses = ["Scheduled", "Checked In", "Checked Out", "Closed"];

function PatientDetails() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(patientsData);

  // Define onStatusChange
  const onStatusChange = (id, newStatus) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === id && allowedTransitions[patient.status].includes(newStatus)
          ? { ...patient, status: newStatus }
          : patient
      )
    );
  };

  const onTaskDragStart = (event, patientId) => {
    event.dataTransfer.setData("text/plain", patientId.toString());
  };

  const onTaskDrop = (event, status) => {
    event.preventDefault();
    const patientId = parseInt(event.dataTransfer.getData("text/plain"), 10);
    const updatedPatients = patients.map((patient) => {
      if (patient.id === patientId && allowedTransitions[patient.status].includes(status)) {
        showSuccessToast(`${patient.name}'s status changed to ${status}!`);
        return { ...patient, status };
      } else if (patient.id === patientId) {
        showErrorToast(`Cannot change ${patient.name}'s status from ${patient.status} to ${status}`);
      }
      return patient;
    });
    setPatients(updatedPatients);
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const handleTaskClick = (patient) => {
    navigate("/fillDetails", { state: { status: patient.status } });
    // setIsDialogOpen(true);
  };

 


  const statusColors = {
    Scheduled: "bg-purple-100 text-purple-800",
    "Checked In": "bg-green-100 text-green-800",
    "Checked Out": "bg-yellow-100 text-yellow-800",
    Closed: "bg-red-100 text-red-800",
  };

  return (
    <>
      <div className="p-1">
        <Tabs defaultValue="Patient Details">
          <TabsList>
            <TabsTrigger value="Patient Details">
              <StethoscopeIcon className="w-5 h-5" />
              <span className="ml-2">Patient Details</span>
            </TabsTrigger>
            <TabsTrigger value="Table">
              <TableIcon className="w-5 h-5" />
              <span className="ml-2">Table</span>
            </TabsTrigger>
          </TabsList>

          {/* Kanban Board View */}
          <TabsContent value="Patient Details">
            <ScrollArea>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
                {initialStatuses.map((status) => (
                  <div
                    key={status}
                    className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 h-[500px]"
                  >
                    <div
                      className={`flex justify-between items-center mb-4 p-2 rounded-lg ${statusColors[status]}`}
                    >
                      <h2 className="text-sm font-semibold">{status}</h2>
                    </div>
                    <ScrollArea className={`h-[400px]`}>
                      <div
                        onDragOver={onDragOver}
                        onDrop={(event) => onTaskDrop(event, status)}
                        className="min-h-[150px] p-2 bg-gray-50 rounded-lg shadow-inner"
                      >
                        {patients
                          .filter((patient) => patient.status === status)
                          .map((patient) => (
                            <div
                              key={patient.id}
                              className="bg-white p-4 mb-1 rounded-lg cursor-pointer shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
                              draggable
                              onDragStart={(event) =>
                                onTaskDragStart(event, patient.id)
                              }
                              onClick={() => handleTaskClick(patient)}
                            >
                              <div className="flex items-center space-x-4 mb-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={patient.profileImage} />
                                  <AvatarFallback>
                                    {patient.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <h3 className="text-sm font-semibold text-gray-600">
                                    {patient.name}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    {patient.age} | {patient.gender}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">
                                  {new Date(
                                    patient.startTime
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                                <div className="flex items-center">
                                  <p className="text-xs text-gray-400">
                                    {patient.startTime.split(" ")[1]}{" "}
                                    {patient.startTime.split(" ")[2]}
                                  </p>{" "}
                                  <span className="text-gray-400 p-[1px]">
                                    {" - "}
                                  </span>
                                  <p className="text-xs text-gray-400">
                                    {patient.endTime.split(" ")[1]}{" "}
                                    {patient.endTime.split(" ")[2]}
                                  </p>
                                </div>
                                <Badge className="mt-2 text-xs font-normal" variant="forestLight">
                                  {patient.type}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>

          {/* Table View */}
          <TabsContent value="Table">
            <PatientTableContent patients={patients} statusColors={statusColors} onStatusChange={onStatusChange}/>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default PatientDetails;



