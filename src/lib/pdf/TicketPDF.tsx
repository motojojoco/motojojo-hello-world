import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF5E6',
    padding: 20,
  },
  header: {
    backgroundColor: '#D32F55',
    color: 'white',
    padding: 20,
    textAlign: 'center',
    marginBottom: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.9,
  },
  section: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderLeft: `4px solid #D32F55`,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#D32F55',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#666',
    width: '30%',
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    width: '70%',
    textAlign: 'right',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 10,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  barcode: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 10,
    color: '#888',
  },
});

interface TicketPDFProps {
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventCity: string;
  bookerName: string;
  ticketNumber: string;
  ticketHolderName: string;
  ticketPrice: number;
  bookingDate: string;
}

export const TicketPDF: React.FC<TicketPDFProps> = ({
  eventName,
  eventDate,
  eventTime,
  eventVenue,
  eventCity,
  bookerName,
  ticketNumber,
  ticketHolderName,
  ticketPrice,
  bookingDate,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Document>
      <Page size="A6" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>MOJO EVENT</Text>
          <Text style={styles.subtitle}>Your Ticket to {eventName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EVENT DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Event:</Text>
            <Text style={styles.value}>{eventName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(eventDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.value}>{eventTime}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Venue:</Text>
            <Text style={styles.value}>{eventVenue}, {eventCity}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TICKET HOLDER</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{ticketHolderName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Booked by:</Text>
            <Text style={styles.value}>{bookerName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ticket #:</Text>
            <Text style={styles.value}>{ticketNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>₹{ticketPrice.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.barcode}>
            <Text>QR Code</Text>
            <Text>Would Appear Here</Text>
          </View>
          <Text style={{ fontSize: 8, marginTop: 5 }}>Scan at venue for entry</Text>
        </View>

        <View style={styles.footer}>
          <Text>Booking Date: {new Date(bookingDate).toLocaleDateString()}</Text>
          <Text>This is an electronic ticket. No printouts required.</Text>
          <Text>© {new Date().getFullYear()} Mojo Events. All rights reserved.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TicketPDF;
