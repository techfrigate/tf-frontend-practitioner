import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import CustomButton from "../../Components/Common/CustomButton";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "" },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1 solid black",
    paddingBottom: 10,
    marginBottom: 10,
  },
  logo: { width: 80, height: 80 },
  contactInfo: { textAlign: "right" },
  box: {
    border: "1 solid #ccc",
    padding: 8,
    marginBottom: 6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryContainer: {
    marginTop: 20,
    display: "flex",
    alignItems: "flex-start",
    border: "1 solid black",
    padding: 8,
    width: "40%",
  },
  summaryText: { marginBottom: 4, fontSize: 12 },
  boldText: { fontWeight: "bold", fontSize: 14 },
});

const BillPDF = ({
  hospitalLogo,
  bills,
  totalAmount,
  gst,
  doctorFees,
  finalAmount,
}) => {
  const downloadPDF = async () => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image src={hospitalLogo} style={styles.logo} />
            <View style={styles.contactInfo}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                SunCity Heart Hospital
              </Text>
              <Text>Address: 123 Main Street, New York, NY 10001</Text>
              <Text>Phone: (123) 456-7890</Text>
              <Text>Email: contact@suncityhospital.com</Text>
            </View>
          </View>
          <View style={{ borderBottom: "1 solid black", marginBottom: 10 }} />
          {bills.map((bill, index) => (
            <View key={index} style={styles.box}>
              <Text>
                {bill.serviceType} - {bill.name}
              </Text>
              <Text> {bill.amount}</Text>
            </View>
          ))}
          {/* Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>GST (18%): {gst}</Text>
            <Text style={styles.summaryText}>Doctor Fees: {doctorFees}</Text>
            <Text style={styles.summaryText}>Total Amount: {totalAmount}</Text>
            <Text style={styles.boldText}>Final Amount: {finalAmount}</Text>
          </View>
        </Page>
      </Document>
    );
    const pdfBlob = await pdf(doc).toBlob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "Bill_recipt.pdf";
    link.click();
  };
  return (
    <div >
      <CustomButton text="Download Bill PDF" onclick={downloadPDF} />
    </div>
  );
};

export default BillPDF;
