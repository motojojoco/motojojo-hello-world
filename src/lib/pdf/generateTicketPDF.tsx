import { pdf, Font } from '@react-pdf/renderer';
import { TicketPDF } from './TicketPDF';

// Register fonts if needed (you can add custom fonts here)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf',
// });

export interface TicketData {
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

export const generateTicketPDF = async (ticketData: TicketData): Promise<Blob> => {
  // Create a blob from the PDF
  const blob = await pdf(
    <TicketPDF {...ticketData} />
  ).toBlob();
  
  return blob;
};

export const generateTicketPDFs = async (ticketsData: TicketData[]): Promise<Blob[]> => {
  const pdfBlobs: Blob[] = [];
  
  // Generate a PDF for each ticket
  for (const ticketData of ticketsData) {
    const blob = await generateTicketPDF(ticketData);
    pdfBlobs.push(blob);
  }
  
  return pdfBlobs;
};
