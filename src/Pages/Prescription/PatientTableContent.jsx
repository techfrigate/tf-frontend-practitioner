// // import React from "react";
// // import GlobalTable from "../../components/Common/GlobalTable";
// // import { Badge } from "../../components/ui/badge";
// // import { useNavigate } from "react-router-dom";
// // import { TableCell, TableRow } from "../../components/ui/table";

// // const PatientTableContent = ({ patients, statusColors }) => {
// //   const navigate = useNavigate();
// //   const tableHeaders = [
// //     "#",
// //     "Title",
// //     "Team",
// //     "Type",
// //     "Start Time",
// //     "End Time",
// //     "Status",
// //   ];

// //   return (
// //     <GlobalTable headers={tableHeaders}>
// //       {patients?.map((patient, index) => (
// //         <TableRow key={patient.id}>
// //           <TableCell className={`text-center`}>W{index + 1}</TableCell>
// //           <TableCell>
// //             {patient.name} | {patient.age} | {patient.gender}
// //           </TableCell>
// //           <TableCell>{patient.team}</TableCell>
// //           <TableCell
// //             className="p-3 cursor-pointer text-blue-500"
// //             onClick={() =>
// //               navigate("/fillDetails", {
// //                 state: { status: patient.status },
// //               })
// //             }
// //           >
// //             {patient.type}
// //           </TableCell>

// //           <TableCell>{patient.startTime}</TableCell>
// //           <TableCell>{patient.endTime}</TableCell>
// //           <TableCell>
// //             <Badge
// //               className={`mt-2 text-xs font-normal ${
// //                 statusColors[patient.status]
// //               }`}
// //             >
// //               {patient.status}
// //             </Badge>
// //           </TableCell>
// //         </TableRow>
// //       ))}
// //     </GlobalTable>
// //   );
// // };

// // export default PatientTableContent;

// import React from "react";
// import GlobalTable from "../../components/Common/GlobalTable";
// import { Badge } from "../../components/ui/badge";
// import { useNavigate } from "react-router-dom";
// import { TableCell, TableRow } from "../../components/ui/table";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "../../components/ui/select";

// const statusOptions = ["Scheduled", "Checked In", "Checked Out", "Closed"];

// const PatientTableContent = ({ patients, onStatusChange }) => {
//   const navigate = useNavigate();
//   const statusColors = {
//     Scheduled: "infoLightPurple",
//     "Checked In": "forestLight",
//     "Checked Out": "warningLight",
//     Closed: "dangerLight",
//   };

//   const tableHeaders = [
//     "#",
//     "Title",
//     "Team",
//     "Type",
//     "Start Time",
//     "End Time",
//     "Status",
//     "Change Status",
//   ];

//   const handleStatusChange = (newStatus, patient) => {
//     if (onStatusChange) {
//       onStatusChange(patient.id, newStatus);
//     }
//   };

//   return (
//     <GlobalTable headers={tableHeaders}>
//       {patients?.map((patient, index) => (
//         <TableRow key={patient.id}>
//           <TableCell className="text-center">W{index + 1}</TableCell>
//           <TableCell>
//             {patient.name} | {patient.age} | {patient.gender}
//           </TableCell>
//           <TableCell>{patient.team}</TableCell>
//           <TableCell
//             className="p-3 cursor-pointer text-blue-500"
//             onClick={() =>
//               navigate("/fillDetails", {
//                 state: { status: patient.status },
//               })
//             }
//           >
//             {patient.type}
//           </TableCell>

//           <TableCell>{patient.startTime}</TableCell>
//           <TableCell>{patient.endTime}</TableCell>
//           <TableCell className="text-nowrap">
//             <Badge variant={`${statusColors[patient.status]}`}>
//               {patient.status}
//             </Badge>
//           </TableCell>
//           <TableCell>
//             <Select
//               value={patient.status}
//               onValueChange={(value) => handleStatusChange(value, patient)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 {statusOptions.map((status) => (
//                   <SelectItem key={status} value={status}>
//                     {status}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </TableCell>
//         </TableRow>
//       ))}
//     </GlobalTable>
//   );
// };

// export default PatientTableContent;



import React from "react";
import GlobalTable from "../../components/Common/GlobalTable";
import { Badge } from "../../components/ui/badge";
import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "../../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { useSelector } from "react-redux";

const statusOptions = ["Scheduled", "Checked In", "Checked Out", "Closed"];

// Define allowed transitions for each status
const allowedTransitions = {
  Scheduled: ["Checked In"],
  "Checked In": ["Checked Out"],
  "Checked Out": ["Closed"],
  Closed: [],
};

const PatientTableContent = ({ patients, onStatusChange}) => {
  const navigate = useNavigate();
  const statusColors = {
    Scheduled: "infoLightPurple",
    "Checked In": "forestLight",
    "Checked Out": "warningLight",
    Closed: "dangerLight",
  };

  const tableHeaders = [
    "#",
    "Title",
    "Team",
    "Type",
    "Start Time",
    "End Time",
    "Status",
    "Change Status",
  ];

  const handleStatusChange = (newStatus, patient) => {
    if (onStatusChange) {
      onStatusChange(patient.id, newStatus);
    }
  };

  return (
    <GlobalTable headers={tableHeaders}>
      {patients?.map((patient, index) => (
        <TableRow key={patient.id}>
          <TableCell className="text-center">W{index + 1}</TableCell>
          <TableCell>
            {patient.name} | {patient.age} | {patient.gender}
          </TableCell>
          <TableCell>{patient.team}</TableCell>
          <TableCell
            className="p-3 cursor-pointer text-blue-500"
            onClick={() =>
              navigate("/fillDetails", {
                state: { status: patient.status },
              })
            }
          >
            {patient.type}
          </TableCell>

          <TableCell>{patient.startTime}</TableCell>
          <TableCell>{patient.endTime}</TableCell>
          <TableCell className="text-nowrap">
            <Badge variant={`${statusColors[patient.status]}`}>
              {patient.status}
            </Badge>
          </TableCell>
          <TableCell>
            <Select
              value={patient.status}
              onValueChange={(value) => handleStatusChange(value, patient)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    disabled={
                      // Disable option if it's not in the allowed transitions
                      patient.status !== status &&
                      !allowedTransitions[patient.status].includes(status)
                    }
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>
      ))}
    </GlobalTable>
  );
};

export default PatientTableContent;
