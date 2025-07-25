import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  styled
} from '@mui/material';
import { alpha } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme, customStyles }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: customStyles?.inputBackgroundColor || '#ffffff',
    '& fieldset': {
      borderColor: customStyles?.formBorderColor || '#1976d2',
    },
    '&:hover fieldset': {
      borderColor: customStyles?.formBorderColor || '#1976d2',
    },
    '&.Mui-focused fieldset': {
      borderColor: customStyles?.formBorderColor || '#1976d2',
    },
    '& input': {
      color: customStyles?.inputTextColor || '#333333',
    }
  },
  '& .MuiInputLabel-root': {
    color: customStyles?.labelColor || '#333333',
    '&.Mui-focused': {
      color: customStyles?.labelColor || '#333333',
    }
  },
  '& .MuiFormHelperText-root': {
    color: customStyles?.labelColor || '#333333',
  }
}));

const StyledButton = styled(Button)(({ theme, customStyles }) => ({
  backgroundColor: customStyles?.buttonColor || '#1976d2',
  color: customStyles?.buttonTextColor || '#ffffff',
  '&:hover': {
    backgroundColor: alpha(customStyles?.buttonColor || '#1976d2', 0.9),
  },
  '&.Mui-disabled': {
    backgroundColor: alpha(customStyles?.buttonColor || '#1976d2', 0.5),
    color: customStyles?.buttonTextColor || '#ffffff',
  }
}));

const ContactForm = ({ customStyles = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('contactFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData && typeof parsedData === 'object') {
          setFormData(parsedData);
        }
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }, []);

  const handleChange = (e) => {
    try {
      const { name, value } = e.target;
      const newFormData = {
        ...formData,
        [name]: value
      };
      setFormData(newFormData);
      localStorage.setItem('contactFormData', JSON.stringify(newFormData));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const handleSubmit = (e) => {
    try {
      const emptyForm = {
        name: '',
        phone: '',
        email: ''
      };
      localStorage.setItem('contactFormData', JSON.stringify(emptyForm));
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  };

  return (
    <form 
      action="https://formspree.io/f/mqalqbeo" 
      method="POST"
      onSubmit={handleSubmit}
      target="_self"
    >
      <input type="hidden" name="_next" value={window.location.origin + '/merci'} />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_subject" value="New message from website" />
      <input type="hidden" name="_language" value="en" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            customStyles={customStyles}
            helperText="Please enter your full name"
          />
        </Grid>

        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            type="tel"
            customStyles={customStyles}
            helperText="Enter your phone number with country code (e.g. +1 234 567-89-00)"
            inputProps={{
              pattern: "^\\+?[0-9\\s-()]{7,}$"
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            type="email"
            customStyles={customStyles}
            helperText="Enter your valid email address"
            inputProps={{
              pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <StyledButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            customStyles={customStyles}
          >
            Send Message
          </StyledButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default ContactForm; 