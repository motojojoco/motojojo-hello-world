import React from 'react';

export function TicketPreviewEmailTemplate({ eventName, userName, ticketId, eventDate, eventLocation }: {
  eventName: string;
  userName: string;
  ticketId: string;
  eventDate: string;
  eventLocation: string;
}) {
  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', background: '#f4f4f4', padding: 24 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px #eee' }}>
        <div style={{ background: '#ff4d4d', color: '#fff', padding: 20, textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>Your Motojojo Ticket</h1>
        </div>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <h2 style={{ color: '#333' }}>{eventName}</h2>
          <p style={{ color: '#666', fontSize: 16 }}>Hello <b>{userName}</b>,</p>
          <p style={{ color: '#666', fontSize: 16 }}>Thank you for booking! Here are your ticket details:</p>
          <div style={{ background: '#f9f9f9', borderRadius: 6, padding: 16, margin: '24px 0', display: 'inline-block', minWidth: 300 }}>
            <p><b>Ticket ID:</b> {ticketId}</p>
            <p><b>Date:</b> {eventDate}</p>
            <p><b>Location:</b> {eventLocation}</p>
          </div>
          <p style={{ color: '#666', fontSize: 16 }}>Show this ticket at the event entrance. We look forward to seeing you!</p>
        </div>
        <div style={{ background: '#333', color: '#fff', textAlign: 'center', padding: 15, fontSize: 14 }}>
          <p>Follow us for updates: <a href="https://instagram.com/motojojo" style={{ color: '#ff4d4d' }}>Instagram</a></p>
          <p>© 2025 Motojojo. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
} 