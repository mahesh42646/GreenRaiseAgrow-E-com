const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');

// Initialize socket.io for this router
module.exports = function(io) {
  // Submit a contact form
  router.post('/', async (req, res) => {
    try {
      // Add IP address and user agent if available
      const contactData = {
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      };
      
      const newContact = new Contact(contactData);
      const savedContact = await newContact.save();
      
      res.status(201).json({ 
        message: 'Contact form submitted successfully', 
        contactId: savedContact.contactId 
      });
      
      // Emit event for new contact submission
      io.emit('contact:submitted', { 
        contactId: savedContact.contactId,
        name: savedContact.name,
        subject: savedContact.subject
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Get all contact submissions (admin only)
  router.get('/', async (req, res) => {
    try {
      // In a real app, you'd use authentication middleware to verify admin role
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.status(200).json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Get a single contact by ID (admin only)
  router.get('/:id', async (req, res) => {
    try {
      // In a real app, you'd use authentication middleware to verify admin role
      const contact = await Contact.findOne({ contactId: req.params.id });
      
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      // Update status to 'read' if it's 'new'
      if (contact.status === 'new') {
        contact.status = 'read';
        await contact.save();
        
        // Emit event for contact read
        io.emit('contact:read', { 
          contactId: contact.contactId
        });
      }
      
      res.status(200).json(contact);
    } catch (error) {
      console.error('Error fetching contact:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Update contact status and add response (admin only)
  router.put('/:id', async (req, res) => {
    try {
      // In a real app, you'd use authentication middleware to verify admin role
      const { status, responseMessage, respondedBy } = req.body;
      
      const updateData = { status };
      
      // If there's a response message, add it and set the response date
      if (responseMessage) {
        updateData.responseMessage = responseMessage;
        updateData.responseDate = new Date();
        updateData.respondedBy = respondedBy;
      }
      
      const updatedContact = await Contact.findOneAndUpdate(
        { contactId: req.params.id },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      res.status(200).json(updatedContact);
      
      // Emit event for contact update
      io.emit('contact:updated', { 
        contactId: updatedContact.contactId,
        status: updatedContact.status
      });
    } catch (error) {
      console.error('Error updating contact:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  return router;
}; 