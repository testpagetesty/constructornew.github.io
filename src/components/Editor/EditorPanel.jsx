import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Paper, Typography, Grid, TextField, Button, Collapse, Stack, IconButton, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import HeaderEditor from './HeaderEditor';
import HeroEditor from './HeroEditor';
import ContactEditor from './ContactEditor';
import FooterEditor from './FooterEditor';
import LegalDocumentsEditor from './LegalDocumentsEditor';
import AiParser from '../AiParser/AiParser';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import { CARD_TYPES } from '../../utils/configUtils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportSite } from '../../utils/siteExporter';
import { generateLiveChatHTML, generateLiveChatCSS, generateLiveChatJS } from '../../utils/liveChatExporter';

import LiveChatEditor from './LiveChatEditor';
import Slider from '@mui/material/Slider';
import { imageCacheService } from '../../utils/imageCacheService';
import { videoCacheService } from '../../utils/videoCacheService';
import imageCompression from 'browser-image-compression';
import AuthPanel from '../Auth/AuthPanel';
import SectionImageGallery from './SectionImageGallery';
import { STYLE_PRESETS } from '../../utils/editorStylePresets';

// Локальные стили больше не нужны - используем импорт
const UNUSED_LOCAL_STYLE_PRESETS = {
  CORPORATE: {
    titleColor: '#1a237e',
    descriptionColor: '#455a64',
    cardType: CARD_TYPES.ELEVATED,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    cardBackgroundColor: '#f5f5f5',
    cardBorderColor: '#e0e0e0',
    cardTitleColor: '#1a237e',
    cardContentColor: '#455a64',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#f5f5f5',
    cardGradientColor2: '#e0e0e0',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  MODERN: {
    titleColor: '#6200ea',
    descriptionColor: '#424242',
    cardType: CARD_TYPES.GRADIENT,
    backgroundColor: '#fafafa',
    borderColor: '#e0e0e0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#7c4dff',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffffff',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#6200ea',
    cardGradientColor2: '#9c27b0',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  MINIMAL: {
    titleColor: '#212121',
    descriptionColor: '#757575',
    cardType: CARD_TYPES.SIMPLE,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#eeeeee',
    cardTitleColor: '#212121',
    cardContentColor: '#757575',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#ffffff',
    cardGradientColor2: '#f5f5f5',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: 'none',
      borderRadius: '4px'
    }
  },
  NATURE: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: CARD_TYPES.ELEVATED,
    backgroundColor: '#f1f8e9',
    borderColor: '#c5e1a5',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#a5d6a7',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e8f5e9',
    cardGradientColor2: '#c8e6c9',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  OCEAN: {
    titleColor: '#01579b',
    descriptionColor: '#0277bd',
    cardType: CARD_TYPES.GRADIENT,
    backgroundColor: '#e1f5fe',
    borderColor: '#b3e5fc',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#81d4fa',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e1f5fe',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#0288d1',
    cardGradientColor2: '#039be5',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  SUNSET: {
    titleColor: '#bf360c',
    descriptionColor: '#d84315',
    cardType: CARD_TYPES.GRADIENT,
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffab91',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e64a19',
    cardGradientColor2: '#f4511e',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  DARK_MODE: {
    titleColor: '#ffffff',
    descriptionColor: '#b0bec5',
    cardType: 'elevated',
    backgroundColor: '#263238',
    borderColor: '#37474f',
    cardBackgroundColor: '#37474f',
    cardBorderColor: '#455a64',
    cardTitleColor: '#ffffff',
    cardContentColor: '#b0bec5',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#37474f',
    cardGradientColor2: '#455a64',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.2)',
      borderRadius: '8px'
    }
  },
  PASTEL: {
    titleColor: '#6a1b9a',
    descriptionColor: '#8e24aa',
    cardType: 'simple',
    backgroundColor: '#f3e5f5',
    borderColor: '#e1bee7',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ce93d8',
    cardTitleColor: '#6a1b9a',
    cardContentColor: '#8e24aa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#f3e5f5',
    cardGradientColor2: '#e1bee7',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.05)',
      borderRadius: '12px'
    }
  },
  FOREST: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#e8f5e9',
    borderColor: '#c8e6c9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#a5d6a7',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#81c784',
    cardGradientColor2: '#66bb6a',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  ROYAL: {
    titleColor: '#4a148c',
    descriptionColor: '#6a1b9a',
    cardType: 'gradient',
    backgroundColor: '#f3e5f5',
    borderColor: '#e1bee7',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ce93d8',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f3e5f5',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#6a1b9a',
    cardGradientColor2: '#8e24aa',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  CRIMSON_TIDE: {
    titleColor: '#b71c1c',
    descriptionColor: '#c62828',
    cardType: 'elevated',
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ef9a9a',
    cardTitleColor: '#b71c1c',
    cardContentColor: '#c62828',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#ffebee',
    cardGradientColor2: '#ffcdd2',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  AMBER_GOLD: {
    titleColor: '#ff6f00',
    descriptionColor: '#ff8f00',
    cardType: 'gradient',
    backgroundColor: '#fff8e1',
    borderColor: '#ffecb3',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffe082',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff8e1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff8f00',
    cardGradientColor2: '#ffb300',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  TEAL_ELEGANCE: {
    titleColor: '#00695c',
    descriptionColor: '#00796b',
    cardType: 'elevated',
    backgroundColor: '#e0f2f1',
    borderColor: '#b2dfdb',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#80cbc4',
    cardTitleColor: '#00695c',
    cardContentColor: '#00796b',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#e0f2f1',
    cardGradientColor2: '#b2dfdb',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  CYBER_NEON: {
    titleColor: '#00e5ff',
    descriptionColor: '#00b8d4',
    cardType: 'gradient',
    backgroundColor: '#0a0a1f',
    borderColor: '#121236',
    cardBackgroundColor: '#0a0a1f',
    cardBorderColor: '#121236',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f7fa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#121236',
    cardGradientColor2: '#1a1a4a',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(0,229,255,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  GRAPE_SODA: {
    titleColor: '#4a148c',
    descriptionColor: '#6a1b9a',
    cardType: 'gradient',
    backgroundColor: '#f3e5f5',
    borderColor: '#e1bee7',
    cardBackgroundColor: '#4a148c',
    cardBorderColor: '#7b1fa2',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f3e5f5',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#4a148c',
    cardGradientColor2: '#7b1fa2',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 8px rgba(0,0,0,0.2)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  COFFEE_CREAM: {
    titleColor: '#3e2723',
    descriptionColor: '#4e342e',
    cardType: 'elevated',
    backgroundColor: '#efebe9',
    borderColor: '#d7ccc8',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#bcaaa4',
    cardTitleColor: '#3e2723',
    cardContentColor: '#4e342e',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#efebe9',
    cardGradientColor2: '#d7ccc8',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  SPRING_BLOOM: {
    titleColor: '#ad1457',
    descriptionColor: '#c2185b',
    cardType: 'elevated',
    backgroundColor: '#fce4ec',
    borderColor: '#f8bbd0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f48fb1',
    cardTitleColor: '#ad1457',
    cardContentColor: '#c2185b',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#fce4ec',
    cardGradientColor2: '#f8bbd0',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '12px'
    }
  },
  BRIGHT_FUTURE: {
    titleColor: '#0d47a1',
    descriptionColor: '#1565c0',
    cardType: 'gradient',
    backgroundColor: '#e3f2fd',
    borderColor: '#bbdefb',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#90caf9',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e3f2fd',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1565c0',
    cardGradientColor2: '#1976d2',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  LAVENDER_MIST: {
    titleColor: '#4527a0',
    descriptionColor: '#512da8',
    cardType: 'elevated',
    backgroundColor: '#ede7f6',
    borderColor: '#d1c4e9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#b39ddb',
    cardTitleColor: '#4527a0',
    cardContentColor: '#512da8',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#ede7f6',
    cardGradientColor2: '#d1c4e9',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  MIDNIGHT_SKY: {
    titleColor: '#e1f5fe',
    descriptionColor: '#b3e5fc',
    cardType: 'gradient',
    backgroundColor: '#0d47a1',
    borderColor: '#1565c0',
    cardBackgroundColor: '#1a237e',
    cardBorderColor: '#283593',
    cardTitleColor: '#e1f5fe',
    cardContentColor: '#b3e5fc',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1a237e',
    cardGradientColor2: '#283593',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(0,0,0,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  CORAL_REEF: {
    titleColor: '#bf360c',
    descriptionColor: '#d84315',
    cardType: 'gradient',
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffcc80',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff7043',
    cardGradientColor2: '#ff8a65',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  EMERALD_DREAM: {
    titleColor: '#004d40',
    descriptionColor: '#00695c',
    cardType: 'gradient',
    backgroundColor: '#e0f2f1',
    borderColor: '#b2dfdb',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#80cbc4',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f2f1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00695c',
    cardGradientColor2: '#00796b',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  DARK_ELEGANCE: {
    titleColor: '#f5f5f5',
    descriptionColor: '#e0e0e0',
    cardType: 'elevated',
    backgroundColor: '#212121',
    borderColor: '#424242',
    cardBackgroundColor: '#333333',
    cardBorderColor: '#616161',
    cardTitleColor: '#f5f5f5',
    cardContentColor: '#e0e0e0',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#333333',
    cardGradientColor2: '#424242',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 4px 8px rgba(0,0,0,0.3)',
      borderRadius: '8px'
    }
  },
  GOLDEN_LUXURY: {
    titleColor: '#3e2723',
    descriptionColor: '#4e342e',
    cardType: 'gradient',
    backgroundColor: '#fef9e7',
    borderColor: '#f9e9ca',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f5d7a1',
    cardTitleColor: '#3e2723',
    cardContentColor: '#4e342e',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ffd700',
    cardGradientColor2: '#ffecb3',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(218,165,32,0.2)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  CHERRY_BLOSSOM: {
    titleColor: '#ad1457',
    descriptionColor: '#c2185b',
    cardType: 'elevated',
    backgroundColor: '#fce4ec',
    borderColor: '#f8bbd0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f48fb1',
    cardTitleColor: '#ad1457',
    cardContentColor: '#c2185b',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#fce4ec',
    cardGradientColor2: '#f8bbd0',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px'
    }
  },
  NORDIC_FROST: {
    titleColor: '#0d47a1',
    descriptionColor: '#1565c0',
    cardType: 'elevated',
    backgroundColor: '#eceff1',
    borderColor: '#cfd8dc',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#b0bec5',
    cardTitleColor: '#0d47a1',
    cardContentColor: '#1565c0',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#eceff1',
    cardGradientColor2: '#cfd8dc',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  NEON_LIFE: {
    titleColor: '#f50057',
    descriptionColor: '#ff4081',
    cardType: 'gradient',
    backgroundColor: '#1a1a2e',
    borderColor: '#282846',
    cardBackgroundColor: '#1a1a2e',
    cardBorderColor: '#282846',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0e0e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#282846',
    cardGradientColor2: '#16213e',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(245,0,87,0.3)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  EARTH_TONES: {
    titleColor: '#33691e',
    descriptionColor: '#558b2f',
    cardType: 'elevated',
    backgroundColor: '#f1f8e9',
    borderColor: '#dcedc8',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#c5e1a5',
    cardTitleColor: '#33691e',
    cardContentColor: '#558b2f',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#f1f8e9',
    cardGradientColor2: '#dcedc8',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  AZURE_DREAMS: {
    titleColor: '#01579b',
    descriptionColor: '#0277bd',
    cardType: 'gradient',
    backgroundColor: '#e1f5fe',
    borderColor: '#b3e5fc',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#81d4fa',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e1f5fe',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#039be5',
    cardGradientColor2: '#29b6f6',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  SUNSET_VIBES: {
    titleColor: '#b71c1c',
    descriptionColor: '#c62828',
    cardType: 'gradient',
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ef9a9a',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffebee',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff8a80',
    cardGradientColor2: '#ff5252',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  },
  LIME_FRESH: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#f9fbe7',
    borderColor: '#f0f4c3',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#e6ee9c',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'solid',
    cardGradientColor1: '#f9fbe7',
    cardGradientColor2: '#f0f4c3',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }
  },
  OCEAN_WAVE: {
    titleColor: '#ffffff',
    descriptionColor: '#e0f2f1',
    cardType: 'gradient',
    backgroundColor: '#006064',
    borderColor: '#00838f',
    cardBackgroundColor: '#006064',
    cardBorderColor: '#00acc1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f7fa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#006064',
    cardGradientColor2: '#00838f',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(0,96,100,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  MAGENTA_GLOW: {
    titleColor: '#880e4f',
    descriptionColor: '#ad1457',
    cardType: 'gradient',
    backgroundColor: '#fce4ec',
    borderColor: '#f8bbd0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f48fb1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fce4ec',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e91e63',
    cardGradientColor2: '#f06292',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(233,30,99,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  STEEL_BLUE: {
    titleColor: '#102027',
    descriptionColor: '#263238',
    cardType: 'elevated',
    backgroundColor: '#eceff1',
    borderColor: '#cfd8dc',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#90a4ae',
    cardTitleColor: '#102027',
    cardContentColor: '#263238',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#eceff1',
    cardGradientColor2: '#cfd8dc',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.15)',
      borderRadius: '10px'
    }
  },
  FIRE_BURST: {
    titleColor: '#ffffff',
    descriptionColor: '#fff3e0',
    cardType: 'gradient',
    backgroundColor: '#e65100',
    borderColor: '#f57c00',
    cardBackgroundColor: '#e65100',
    cardBorderColor: '#ff9800',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff3d00',
    cardGradientColor2: '#ff6d00',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(255,61,0,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  MINT_CHOCOLATE: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'gradient',
    backgroundColor: '#e8f5e8',
    borderColor: '#c8e6c9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#a5d6a7',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e8f5e8',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#4caf50',
    cardGradientColor2: '#66bb6a',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(76,175,80,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  VIOLET_STORM: {
    titleColor: '#ffffff',
    descriptionColor: '#ede7f6',
    cardType: 'gradient',
    backgroundColor: '#4a148c',
    borderColor: '#6a1b9a',
    cardBackgroundColor: '#4a148c',
    cardBorderColor: '#8e24aa',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ede7f6',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#6a1b9a',
    cardGradientColor2: '#9c27b0',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(106,27,154,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  BRONZE_ELEGANCE: {
    titleColor: '#3e2723',
    descriptionColor: '#5d4037',
    cardType: 'elevated',
    backgroundColor: '#efebe9',
    borderColor: '#d7ccc8',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#bcaaa4',
    cardTitleColor: '#3e2723',
    cardContentColor: '#5d4037',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#efebe9',
    cardGradientColor2: '#d7ccc8',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  ELECTRIC_LIME: {
    titleColor: '#33691e',
    descriptionColor: '#558b2f',
    cardType: 'gradient',
    backgroundColor: '#f1f8e9',
    borderColor: '#dcedc8',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#aed581',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f1f8e9',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#689f38',
    cardGradientColor2: '#8bc34a',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(104,159,56,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  DEEP_OCEAN: {
    titleColor: '#ffffff',
    descriptionColor: '#b3e5fc',
    cardType: 'gradient',
    backgroundColor: '#01579b',
    borderColor: '#0277bd',
    cardBackgroundColor: '#01579b',
    cardBorderColor: '#0288d1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#b3e5fc',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#0277bd',
    cardGradientColor2: '#03a9f4',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(2,119,189,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  ROSE_GOLD: {
    titleColor: '#ad1457',
    descriptionColor: '#c2185b',
    cardType: 'gradient',
    backgroundColor: '#fce4ec',
    borderColor: '#f8bbd0',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#f48fb1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fce4ec',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ec407a',
    cardGradientColor2: '#f06292',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(236,64,122,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  ARCTIC_BLUE: {
    titleColor: '#0d47a1',
    descriptionColor: '#1565c0',
    cardType: 'elevated',
    backgroundColor: '#e3f2fd',
    borderColor: '#bbdefb',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#64b5f6',
    cardTitleColor: '#0d47a1',
    cardContentColor: '#1565c0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e3f2fd',
    cardGradientColor2: '#bbdefb',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  SUNSET_ORANGE: {
    titleColor: '#ffffff',
    descriptionColor: '#fff3e0',
    cardType: 'gradient',
    backgroundColor: '#e65100',
    borderColor: '#f57c00',
    cardBackgroundColor: '#e65100',
    cardBorderColor: '#ff9800',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff5722',
    cardGradientColor2: '#ff7043',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(255,87,34,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  JADE_TEMPLE: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#e8f5e8',
    borderColor: '#c8e6c9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#81c784',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e8f5e8',
    cardGradientColor2: '#c8e6c9',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  ROYAL_PURPLE: {
    titleColor: '#ffffff',
    descriptionColor: '#ede7f6',
    cardType: 'gradient',
    backgroundColor: '#311b92',
    borderColor: '#512da8',
    cardBackgroundColor: '#311b92',
    cardBorderColor: '#673ab7',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ede7f6',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#512da8',
    cardGradientColor2: '#7986cb',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(81,45,168,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  GOLDEN_HOUR: {
    titleColor: '#e65100',
    descriptionColor: '#f57c00',
    cardType: 'gradient',
    backgroundColor: '#fff8e1',
    borderColor: '#ffecb3',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffe082',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff8e1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ffc107',
    cardGradientColor2: '#ffeb3b',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(255,193,7,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  MIDNIGHT_FOREST: {
    titleColor: '#ffffff',
    descriptionColor: '#e8f5e8',
    cardType: 'gradient',
    backgroundColor: '#1b5e20',
    borderColor: '#2e7d32',
    cardBackgroundColor: '#1b5e20',
    cardBorderColor: '#388e3c',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e8f5e8',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#2e7d32',
    cardGradientColor2: '#4caf50',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(46,125,50,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  CORAL_SUNSET: {
    titleColor: '#bf360c',
    descriptionColor: '#d84315',
    cardType: 'elevated',
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffab91',
    cardTitleColor: '#bf360c',
    cardContentColor: '#d84315',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#fff3e0',
    cardGradientColor2: '#ffe0b2',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  SPACE_NEBULA: {
    titleColor: '#e1bee7',
    descriptionColor: '#ce93d8',
    cardType: 'gradient',
    backgroundColor: '#1a0033',
    borderColor: '#2d0052',
    cardBackgroundColor: '#1a0033',
    cardBorderColor: '#4a0e7a',
    cardTitleColor: '#e1bee7',
    cardContentColor: '#ce93d8',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#2d0052',
    cardGradientColor2: '#4a0e7a',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(74,14,122,0.5)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  CRIMSON_FLAME: {
    titleColor: '#ffffff',
    descriptionColor: '#ffebee',
    cardType: 'gradient',
    backgroundColor: '#b71c1c',
    borderColor: '#c62828',
    cardBackgroundColor: '#b71c1c',
    cardBorderColor: '#d32f2f',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffebee',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#d32f2f',
    cardGradientColor2: '#f44336',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(211,47,47,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  EMERALD_SHINE: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#e8f5e8',
    borderColor: '#c8e6c9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#66bb6a',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e8f5e8',
    cardGradientColor2: '#c8e6c9',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(27,94,32,0.2)',
      borderRadius: '12px'
    }
  },
  SILVER_MIST: {
    titleColor: '#263238',
    descriptionColor: '#37474f',
    cardType: 'gradient',
    backgroundColor: '#eceff1',
    borderColor: '#cfd8dc',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#90a4ae',
    cardTitleColor: '#ffffff',
    cardContentColor: '#eceff1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#607d8b',
    cardGradientColor2: '#78909c',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(96,125,139,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  TROPICAL_PARADISE: {
    titleColor: '#004d40',
    descriptionColor: '#00695c',
    cardType: 'gradient',
    backgroundColor: '#e0f2f1',
    borderColor: '#b2dfdb',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#4db6ac',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f2f1',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00897b',
    cardGradientColor2: '#26a69a',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(0,137,123,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  NEON_CYAN: {
    titleColor: '#ffffff',
    descriptionColor: '#e0f7fa',
    cardType: 'gradient',
    backgroundColor: '#006064',
    borderColor: '#00838f',
    cardBackgroundColor: '#006064',
    cardBorderColor: '#00acc1',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e0f7fa',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#00acc1',
    cardGradientColor2: '#00e5ff',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(0,229,255,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  AUTUMN_LEAVES: {
    titleColor: '#bf360c',
    descriptionColor: '#d84315',
    cardType: 'elevated',
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffb74d',
    cardTitleColor: '#bf360c',
    cardContentColor: '#d84315',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#fff3e0',
    cardGradientColor2: '#ffe0b2',
    cardGradientDirection: 'to right',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  LAVENDER_FIELD: {
    titleColor: '#4527a0',
    descriptionColor: '#512da8',
    cardType: 'gradient',
    backgroundColor: '#f3e5f5',
    borderColor: '#e1bee7',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ba68c8',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f3e5f5',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#7b1fa2',
    cardGradientColor2: '#ab47bc',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 4px 8px rgba(123,31,162,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  COSMIC_BLUE: {
    titleColor: '#ffffff',
    descriptionColor: '#e3f2fd',
    cardType: 'gradient',
    backgroundColor: '#0d47a1',
    borderColor: '#1565c0',
    cardBackgroundColor: '#0d47a1',
    cardBorderColor: '#1976d2',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e3f2fd',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#1976d2',
    cardGradientColor2: '#42a5f5',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(25,118,210,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  HONEY_GOLD: {
    titleColor: '#e65100',
    descriptionColor: '#f57c00',
    cardType: 'elevated',
    backgroundColor: '#fff8e1',
    borderColor: '#ffecb3',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffc107',
    cardTitleColor: '#e65100',
    cardContentColor: '#f57c00',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#fff8e1',
    cardGradientColor2: '#ffecb3',
    cardGradientDirection: 'to bottom',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.12)',
      borderRadius: '10px'
    }
  },
  RUBY_RED: {
    titleColor: '#ffffff',
    descriptionColor: '#ffebee',
    cardType: 'gradient',
    backgroundColor: '#ad1457',
    borderColor: '#c2185b',
    cardBackgroundColor: '#ad1457',
    cardBorderColor: '#e91e63',
    cardTitleColor: '#ffffff',
    cardContentColor: '#ffebee',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e91e63',
    cardGradientColor2: '#ec407a',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(233,30,99,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  FOREST_MIST: {
    titleColor: '#1b5e20',
    descriptionColor: '#2e7d32',
    cardType: 'elevated',
    backgroundColor: '#e8f5e8',
    borderColor: '#c8e6c9',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#81c784',
    cardTitleColor: '#1b5e20',
    cardContentColor: '#2e7d32',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#e8f5e8',
    cardGradientColor2: '#c8e6c9',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 3px 6px rgba(0,0,0,0.1)',
      borderRadius: '12px'
    }
  },
  SAPPHIRE_DREAM: {
    titleColor: '#ffffff',
    descriptionColor: '#e8eaf6',
    cardType: 'gradient',
    backgroundColor: '#283593',
    borderColor: '#3f51b5',
    cardBackgroundColor: '#283593',
    cardBorderColor: '#5c6bc0',
    cardTitleColor: '#ffffff',
    cardContentColor: '#e8eaf6',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#3f51b5',
    cardGradientColor2: '#7986cb',
    cardGradientDirection: '45deg',
    style: {
      shadow: '0 6px 12px rgba(63,81,181,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  },
  PEACH_SUNSET: {
    titleColor: '#bf360c',
    descriptionColor: '#d84315',
    cardType: 'gradient',
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
    cardBackgroundColor: '#ffffff',
    cardBorderColor: '#ffab91',
    cardTitleColor: '#ffffff',
    cardContentColor: '#fff3e0',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#ff7043',
    cardGradientColor2: '#ffab91',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 4px 8px rgba(255,112,67,0.3)',
      borderRadius: '14px',
      padding: '18px'
    }
  },
  ELECTRIC_PURPLE: {
    titleColor: '#ffffff',
    descriptionColor: '#f3e5f5',
    cardType: 'gradient',
    backgroundColor: '#6a1b9a',
    borderColor: '#8e24aa',
    cardBackgroundColor: '#6a1b9a',
    cardBorderColor: '#ab47bc',
    cardTitleColor: '#ffffff',
    cardContentColor: '#f3e5f5',
    cardBackgroundType: 'gradient',
    cardGradientColor1: '#8e24aa',
    cardGradientColor2: '#ba68c8',
    cardGradientDirection: '135deg',
    style: {
      shadow: '0 6px 12px rgba(142,36,170,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }
  }
}; // UNUSED_LOCAL_STYLE_PRESETS - заменен на импорт из editorStylePresets.js

// Define image handling functions before the main component
const handleReorderImages = (sectionsData, sectionId, startIndex, endIndex) => {
  const section = sectionsData[sectionId];
  if (!section?.images) return sectionsData;

  const newImages = [...section.images];
  const [movedImage] = newImages.splice(startIndex, 1);
  newImages.splice(endIndex, 0, movedImage);

  return {
    ...sectionsData,
    [sectionId]: {
      ...sectionsData[sectionId],
      images: newImages
    }
  };
};
const EditorPanel = ({
  headerData = {
    siteName: 'My Site',
    titleColor: '#000000',
    backgroundColor: '#ffffff',
    linksColor: '#000000',
    siteBackgroundColor: '#f8f9fa',
    siteBackgroundType: 'solid',
    siteGradientColor1: '#ffffff',
    siteGradientColor2: '#f5f5f5',
    siteGradientDirection: 'to right',
    menuItems: [],
    language: 'en',
    runningLine: {
      enabled: false,
      text: '',
      speed: 25,
      backgroundColor: '#1976d2',
      textColor: '#ffffff',
      fontSize: '20px',
      fontWeight: 'bold',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textStyle: 'normal',
      lineHeight: '1.2',
      padding: '4',
      syncWithContacts: true
    }
  },
  onHeaderChange,
  sectionsData,
  onSectionsChange,
  heroData,
  onHeroChange,
  contactData,
  onContactChange,
  footerData,
  onFooterChange,
  legalDocuments,
  onLegalDocumentsChange,
  liveChatData = { enabled: false, apiKey: '' },
  onLiveChatChange
}) => {
  console.log('EditorPanel received props:', {
    headerData,
    heroData,
    sectionsData,
    contactData,
    footerData,
    legalDocuments
  });

  const [expandedSections, setExpandedSections] = React.useState({
    header: false,
    hero: false,
    menu: false,
    menuItems: {},
    contact: false,
    footer: false,
    legal: false,
    liveChat: false
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Combined useEffect for all checks and tracking
  useEffect(() => {
          // Check authentication
    const auth = localStorage.getItem('editorAuth');
    const authTime = localStorage.getItem('editorAuthTime');
    const currentTime = new Date().getTime();
    
          // Check if authentication time has expired (2 hours = 7200000 milliseconds)
    if (auth === 'true' && authTime && (currentTime - parseInt(authTime)) < 7200000) {
      setIsAuthenticated(true);
    } else {
              // If time has expired, clear authentication data
      localStorage.removeItem('editorAuth');
      localStorage.removeItem('editorAuthTime');
      setIsAuthenticated(false);
    }

          // Navigation prevention handler
    const handlePreventNavigation = (event) => {
              // If language is not specified, prevent navigation
      if (!headerData.language || (typeof headerData.language === 'string' && headerData.language.trim() === '')) {
        event.preventDefault();
                  // Return header section to expanded state
        setExpandedSections(prev => ({
          ...prev,
          header: true
        }));
      }
    };

    window.addEventListener('preventNavigation', handlePreventNavigation);

          // Track changes in sectionsData
    console.log('sectionsData changed:', sectionsData);
    if (sectionsData.features) {
      console.log('Features section current state:', sectionsData.features);
    }

    return () => {
      window.removeEventListener('preventNavigation', handlePreventNavigation);
    };
  }, [headerData.language, sectionsData]);

  const handleAuth = (success) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('editorAuth', 'true');
      localStorage.setItem('editorAuthTime', new Date().getTime().toString());
    }
  };

  if (!isAuthenticated) {
    return <AuthPanel onAuth={handleAuth} />;
  }

  const toggleSection = (section) => {
    // Check language before switching section
    if (section !== 'header' && (!headerData.language || (typeof headerData.language === 'string' && headerData.language.trim() === ''))) {
              // If language is not specified, keep header section expanded
      setExpandedSections(prev => ({
        ...prev,
        header: true
      }));
      return;
    }

    setExpandedSections(prev => {
      const newState = { ...prev };
      
      // If this is a menu subitem (starts with menuItem_)
      if (section.startsWith('menuItem_')) {
        const menuItemId = section.replace('menuItem_', '');
                  // Create a new menuItems object where all items are closed
        const newMenuItems = {};
                  // If item was already open, just close it
        if (prev.menuItems[menuItemId]) {
          newState.menuItems = newMenuItems;
        } else {
                      // If item was closed, close all others and open it
          newMenuItems[menuItemId] = true;
          newState.menuItems = newMenuItems;
          
          // Scroll to corresponding section on the site
          setTimeout(() => {
            const targetSection = document.getElementById(menuItemId);
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
        return newState;
      }
      
      // If this is a main section
      // If section is already open, just close it
      if (newState[section]) {
        newState[section] = false;
        return newState;
      }
      
      // If section is closed, close all others and open it
      Object.keys(newState).forEach(key => {
        if (key !== 'menuItems') {
          newState[key] = key === section;
        }
      });

      // Scroll to corresponding section on the site
      setTimeout(() => {
        const targetSection = document.getElementById(section);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      return newState;
    });
  };

  const handleChange = (field, value) => {
    console.log('handleChange called in EditorPanel:', { field, value });
    console.log('Current heroData:', heroData);
    
    // Ensure we're working with a fresh copy of the data
    const newHeroData = { ...heroData };
    
    // Handle color fields specifically
    if (field.includes('Color')) {
      console.log('Color field detected:', field);
      // Ensure the color value is properly formatted
      if (!value.startsWith('#')) {
        value = `#${value}`;
      }
      console.log('Formatted color value:', value);
    }
    
    newHeroData[field] = value;
    console.log('New heroData to be set:', newHeroData);
    onHeroChange(newHeroData);
  };

  const handleAddMenuItem = (sectionId) => {
    const newId = `section_${Date.now()}`;
    const newMenuItem = {
      id: newId,
      text: 'New Menu Item',
      title: '',
      description: '',
      image: '',
      link: `#${newId}`,
      cardType: CARD_TYPES.NONE,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    // Check that ID is unique
    const isIdUnique = !headerData.menuItems.some(item => item.id === newId);
    if (!isIdUnique) {
      console.error('ID already exists, generating new one');
      return handleAddMenuItem(sectionId);
    }

    // Add new menu item to headerData
    const updatedMenuItems = [...headerData.menuItems, newMenuItem];
    onHeaderChange({ ...headerData, menuItems: updatedMenuItems });

    // Create new section with the same ID
    const newSection = {
      id: newId,
      title: '',
      description: '',
      cardType: CARD_TYPES.NONE,
      cards: []
    };

    // Update sectionsData as object
    onSectionsChange({ ...sectionsData, [newId]: newSection });

    // Open new section in editor
    setExpandedSections(prev => ({
      ...prev,
      menuItems: {
        ...prev.menuItems,
        [newId]: true
      }
    }));
  };

  const handleMenuItemChange = (id, field, value) => {
    console.log('handleMenuItemChange called:', { id, field, value });
    console.log('Current headerData:', headerData);
    
    // Update menu item
    const updatedMenuItems = headerData.menuItems.map(item => {
      if (item.id === id) {
        // If ID changes, update link as well
        if (field === 'id') {
          return { ...item, [field]: value, link: `#${value}` };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    
    const newHeaderData = { ...headerData, menuItems: updatedMenuItems };
    console.log('New headerData to be set:', newHeaderData);
    onHeaderChange(newHeaderData);

    // Check if section exists
    let sectionExists = sectionsData[id] !== undefined;
    
    if (!sectionExists) {
      // If section doesn't exist, create new one with basic parameters
      const newSection = {
        id: id,
        title: '',
        description: '',
        cardType: CARD_TYPES.NONE,
        cards: [],
        titleColor: '#000000',
        descriptionColor: '#666666'
      };
      onSectionsChange({ ...sectionsData, [id]: newSection });
    }

    // If ID changes, update section ID as well
    if (field === 'id') {
      const { [id]: oldSection, ...restSections } = sectionsData;
      if (oldSection) {
        onSectionsChange({ ...restSections, [value]: { ...oldSection, id: value } });
      }
    }
  };

  const handleDeleteMenuItem = (id) => {
    setSectionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sectionToDelete) {
      const updatedMenuItems = headerData.menuItems.filter(item => item.id !== sectionToDelete);
      onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
      
      // Delete section from sectionsData object
      const { [sectionToDelete]: deletedSection, ...restSections } = sectionsData;
      onSectionsChange(restSections);
      
      setExpandedSections(prev => {
        const newState = { ...prev };
        delete newState.menuItems[sectionToDelete];
        return newState;
      });
    }
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  const handleSectionChange = (sectionId, field, value) => {
    if (!sectionsData[sectionId]) return;
    
    // If card type changes, check its value
    if (field === 'cardType' && !Object.values(CARD_TYPES).includes(value)) {
      console.error('Invalid card type value:', value);
      return;
    }

    const updatedSections = {
      ...sectionsData,
      [sectionId]: {
        ...sectionsData[sectionId],
        [field]: value
      }
    };
    
    onSectionsChange(updatedSections);
  };

  const applyPreset = (presetName, sectionId) => {
    const preset = STYLE_PRESETS[presetName];
    if (!preset || !sectionId) return;

    // Update only selected section
    const updatedSections = {
      ...sectionsData,
      [sectionId]: {
        ...sectionsData[sectionId],
        titleColor: preset.titleColor,
        descriptionColor: preset.descriptionColor,
        cardType: preset.cardType,
        backgroundColor: preset.backgroundColor,
        borderColor: preset.borderColor,
        // Update cards only in selected section
        cards: sectionsData[sectionId]?.cards?.map(card => ({
          ...card,
          titleColor: preset.cardTitleColor,
          contentColor: preset.cardContentColor,
          backgroundColor: preset.cardBackgroundColor,
          borderColor: preset.cardBorderColor,
          backgroundType: preset.cardBackgroundType,
          gradientColor1: preset.cardGradientColor1,
          gradientColor2: preset.cardGradientColor2,
          gradientDirection: preset.cardGradientDirection,
          style: {
            ...card.style,
            ...preset.style
          }
        })) || []
      }
    };

    onSectionsChange(updatedSections);
  };

  const processImage = async (file, sectionId) => {
    try {
      // Image compression
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });

              // Convert to Blob
      const blob = new Blob([compressedFile], { type: 'image/jpeg' });
      
              // Generate unique filename using section ID and timestamp
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const filename = `${sectionId}_${timestamp}_${randomStr}.jpg`;

              // Save to cache
      await imageCacheService.saveImage(filename, blob);

              // Create URL for preview
      const url = URL.createObjectURL(blob);

              // Save image metadata
      const imageMetadata = {
        filename,
        type: 'image/jpeg',
        size: blob.size,
        lastModified: new Date().toISOString()
      };

      // Save metadata to cache
      const metadataKey = `section_${sectionId}_metadata`;
      await imageCacheService.saveMetadata(metadataKey, imageMetadata);
      console.log('✓ Image metadata saved to cache:', imageMetadata);

      return { url, filename, blob };
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };

  const handleSectionImageUpload = async (id, event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    try {
      const newImages = [];
      
      for (const file of files) {
        // Check format
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select only images');
        }

        const { url, filename } = await processImage(file, id);
        const imagePath = `/images/sections/${filename}`;
        
        newImages.push({
          path: imagePath,
          url: url,
          filename: filename
        });
      }

      console.log('[EditorPanel] Processed images:', newImages);

      // Update section data
      const currentImages = sectionsData[id]?.images || [];
      const updatedSectionsData = {
        ...sectionsData,
        [id]: {
          ...sectionsData[id],
          images: [...currentImages, ...newImages]
        }
      };
      
      onSectionsChange(updatedSectionsData);

      // Send message to preview for image update
      try {
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          console.log('[EditorPanel] Sending images to preview:', newImages);
          previewIframe.contentWindow.postMessage({
            type: 'UPDATE_SECTION_IMAGES',
            sectionId: id,
            images: newImages
          }, '*');
        }
      } catch (error) {
        console.error('Error sending message to preview:', error);
      }

      alert('Section images successfully processed and saved');
    } catch (error) {
      console.error('Error loading:', error);
      alert('Error loading images: ' + error.message);
    }
  };

  const handleCardChange = (sectionId, cardId, field, value) => {
    const section = sectionsData[sectionId];
    if (!section) return;

    const updatedCards = section.cards.map(card => {
      // Apply changes only to selected card
      if (card.id === cardId) {
        return { ...card, [field]: value };
      }
      return card;
    });

    onSectionsChange({
      ...sectionsData,
      [sectionId]: {
        ...section,
        cards: updatedCards
      }
    });
  };

  const handleAddCard = (sectionId) => {
    const section = sectionsData[sectionId];
    if (!section) return;

    // Check that section supports cards
    if (section.cardType === CARD_TYPES.NONE) {
      console.warn('Cannot add card to section with type NONE');
      return;
    }

    // Generate new ID for card
    let newCardId;
    if (!section.cards || section.cards.length === 0) {
      newCardId = 1;
      } else {
      // Find maximum ID among existing cards
      const maxId = Math.max(...section.cards.map(card => {
        const id = parseInt(card.id);
        return isNaN(id) ? 0 : id;
      }));
      newCardId = maxId + 1;
    }

    console.log('Generating new card with ID:', newCardId);
    
    // Take styles from first card if it exists
    const firstCard = (section.cards && section.cards[0]) || {};
    
    // Create new card
    const newCard = {
      id: newCardId,
      title: `Card ${newCardId}`,
      content: 'Card content',
      showTitle: true,
      titleColor: firstCard.titleColor || '#333333',
      contentColor: firstCard.contentColor || '#666666',
      backgroundType: firstCard.backgroundType || 'solid',
      backgroundColor: firstCard.backgroundColor || '#ffffff',
      gradientColor1: firstCard.gradientColor1 || '#ffffff',
      gradientColor2: firstCard.gradientColor2 || '#f5f5f5',
      gradientDirection: firstCard.gradientDirection || 'to right',
      borderColor: firstCard.borderColor || '#e0e0e0',
      style: {
        shadow: firstCard.style?.shadow || '0 2px 4px rgba(0,0,0,0.05)',
        borderRadius: firstCard.style?.borderRadius || '12px'
      }
    };

    // Update section with new card
    onSectionsChange({
      ...sectionsData,
      [sectionId]: {
        ...section,
        cards: [...section.cards, newCard]
      }
    });
  };

  const handleDeleteCard = (sectionId, cardId) => {
    const section = sectionsData[sectionId];
    if (!section) return;

    const updatedCards = section.cards.filter(card => card.id !== cardId);
    
    onSectionsChange({
      ...sectionsData,
      [sectionId]: {
        ...section,
        cards: updatedCards
      }
    });
  };

  const handleLegalDocumentsSave = (documents) => {
    console.log('Saving legal documents:', documents);
    if (onLegalDocumentsChange) {
      onLegalDocumentsChange(documents);
    }
  };

  const generateHTML = (data) => {
    console.log('🚀 generateHTML called with data:', data);
    console.log('🚀 liveChatData:', data.liveChatData);
    console.log('🚀 liveChatData.enabled:', data.liveChatData?.enabled);
    console.log('🚀 liveChatData.apiKey:', data.liveChatData?.apiKey ? 'Present' : 'Missing');
    
    // Применяем значения по умолчанию для contactData
    const contactData = {
      showBackground: true,
      backgroundType: 'solid',
      backgroundColor: '#f8f9fa',
      gradientColor1: '#ffffff',
      gradientColor2: '#f5f5f5',
      gradientDirection: 'to bottom',
      titleColor: '#1565c0',
      descriptionColor: '#424242',
      buttonColor: '#1976d2',
      ...data.contactData
    };
    
    console.log('🎨 CONTACT BACKGROUND DEBUG:');
    console.log('📊 Original contactData:', data.contactData);
    console.log('🔧 Final contactData:', contactData);
    console.log('👁️ showBackground:', contactData.showBackground);
    console.log('🎭 backgroundType:', contactData.backgroundType);
    console.log('🌈 backgroundColor:', contactData.backgroundColor);
    console.log('🎨 gradientColor1:', contactData.gradientColor1);
    console.log('🎨 gradientColor2:', contactData.gradientColor2);
    console.log('📐 gradientDirection:', contactData.gradientDirection);
    
    return `<!DOCTYPE html>
<html lang="${data.headerData.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.headerData.title || data.headerData.siteName}</title>
  <link rel="icon" type="image/png" href="assets/images/Favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="assets/css/styles.css">
  <meta name="description" content="${data.headerData.description || 'Our site offers the best solutions'}">
  ${data.headerData.domain ? `<link rel="canonical" href="https://${data.headerData.domain}" />` : ''}
  <style>
    /* Live Chat Styles */
    ${data.liveChatData?.enabled ? generateLiveChatCSS() : ''}
  </style>
</head>
<body>
  ${data.headerData.siteBackgroundType === 'image' ? `
  <div class="background-image" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('assets/images/fon.jpg');
    background-size: cover;
    background-position: center;
    filter: ${data.headerData.siteBackgroundBlur ? `blur(${data.headerData.siteBackgroundBlur}px)` : 'none'};
    z-index: -2;
  "></div>
  ${data.headerData.siteBackgroundDarkness ? `
  <div class="site-overlay" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, ${data.headerData.siteBackgroundDarkness / 100});
    z-index: -1;
  "></div>
  ` : ''}
  ` : data.headerData.siteBackgroundType === 'gradient' ? `
  <div class="background-image" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(${data.headerData.siteGradientDirection || 'to right'}, 
      ${data.headerData.siteGradientColor1 || '#ffffff'}, 
      ${data.headerData.siteGradientColor2 || '#f5f5f5'});
    z-index: -2;
  "></div>
  ` : data.headerData.siteBackgroundType === 'solid' ? `
  <div class="background-image" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${data.headerData.siteBackgroundColor || '#ffffff'};
    z-index: -2;
  "></div>
  ` : ''}
  
  <!-- Бегущая строка -->
  ${data.headerData.runningLine?.enabled && data.headerData.runningLine?.text ? `
  <div class="running-line-container">
    <div class="running-line" style="
      background-color: ${data.headerData.runningLine.backgroundColor || '#1976d2'};
    ">
      <div class="running-line-text">${data.headerData.runningLine.text}</div>
    </div>
  </div>
  ` : ''}
  
  <header>
    <nav style="background-color: ${data.headerData.backgroundColor || '#ffffff'}; --menu-bg-color: ${data.headerData.backgroundColor || '#fff'}; --menu-link-color: ${data.headerData.linksColor || '#1976d2'};">
      <div class="nav-container">
        <div class="site-branding" style="display: flex; flex-direction: column; margin-right: 2rem;">
          <div class="logo" style="color: ${data.headerData.titleColor || '#000000'}">${data.headerData.siteName || 'My Site'}</div>
          <div class="domain" style="color: ${data.headerData.titleColor || '#000000'}; opacity: 0.8; font-size: 0.9rem; display: none;">${data.headerData.domain || ''}</div>
        </div>
        <button class="menu-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-menu">
          ${data.headerData.menuItems.map(item => `
            <li>
              <a href="#${item.id}" style="
                color: ${data.headerData.linksColor || '#000000'};
                font-size: ${data.headerData.styles?.menuItemFontSize || '16px'};
                font-weight: ${data.headerData.styles?.menuItemFontWeight || '500'};
                transition: ${data.headerData.styles?.menuItemTransition || '0.3s'};
              ">${item.text}</a>
            </li>
          `).join('')}
          <li>
            <a href="#contact" style="
              color: ${data.headerData.linksColor || '#000000'};
              font-size: ${data.headerData.styles?.menuItemFontSize || '16px'};
              font-weight: ${data.headerData.styles?.menuItemFontWeight || '500'};
              transition: ${data.headerData.styles?.menuItemTransition || '0.3s'};
            ">${contactData.title || 'Contact Us'}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>

  <main>
    <section id="hero" class="hero" style="
      ${data.heroData.backgroundType === 'solid' ? `background-color: ${data.heroData.backgroundColor || '#ffffff'};` : ''}
      ${data.heroData.backgroundType === 'gradient' ? `background: linear-gradient(${data.heroData.gradientDirection || 'to right'}, ${data.heroData.gradientColor1 || '#ffffff'}, ${data.heroData.gradientColor2 || '#f5f5f5'});` : ''}
    ">
      ${data.heroData.backgroundType === 'image' ? `
        <div class="hero-bg-animation" style="background-image: url('${data.heroData.backgroundImage.replace('/images/hero/', 'assets/images/')}');"></div>
      ` : ''}
      ${data.heroData.backgroundType === 'video' ? `
        <div class="video-loading-overlay" id="videoLoadingOverlay">
          <div class="video-loading-spinner"></div>
        </div>
        <video 
          class="hero-video" 
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
          "
          autoplay="${data.heroData.videoAutoplay || true}"
          loop="${data.heroData.videoLoop || true}"
          muted="${data.heroData.videoMuted || true}"
          controls="false"
          playsinline
          preload="auto"
          id="heroVideo"
        >
          <source src="${data.heroData.backgroundVideo.replace('/assets/', 'assets/')}" type="video/mp4">
          <source src="${data.heroData.backgroundVideo.replace('/assets/', 'assets/').replace('.mp4', '.webm')}" type="video/webm">
          <source src="${data.heroData.backgroundVideo.replace('/assets/', 'assets/').replace('.mp4', '.ogg')}" type="video/ogg">
          Ваш браузер не поддерживает видео.
        </video>
      ` : ''}
      ${data.heroData.backgroundType === 'gif' ? `
        <div class="gif-loading-overlay" id="gifLoadingOverlay">
          <div class="gif-loading-spinner"></div>
        </div>
        <img 
          class="hero-gif" 
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
          "
          src="${data.heroData.backgroundGif.replace('/assets/', 'assets/')}"
          alt="Hero background GIF"
          id="heroGif"
        />
      ` : ''}
      ${data.heroData.enableOverlay ? `
        <div class="hero-overlay" style="
          background: linear-gradient(rgba(0,0,0,${data.heroData.overlayOpacity / 100 || 0.5}), rgba(0,0,0,${data.heroData.overlayOpacity / 100 || 0.5}));
          backdrop-filter: ${data.heroData.enableBlur ? `blur(${data.heroData.blurAmount || 0.1}px)` : 'none'};
        "></div>
      ` : ''}
      <div class="hero-content">
        <div class="hero-text-wrapper" style="
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(0.1px);
          padding: 2rem 3rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 800px;
          margin: 0 auto;
        ">
          <h1 style="
            color: ${data.heroData.titleColor || '#ffffff'};
            text-shadow: 
              2px 2px 4px rgba(0, 0, 0, 0.9),
              -1px -1px 2px rgba(255, 255, 255, 0.8),
              1px 1px 2px rgba(255, 255, 255, 0.6),
              0 0 20px rgba(0, 0, 0, 0.5),
              0 0 40px rgba(255, 255, 255, 0.3);
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
            filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.8));
            margin-bottom: 1.5rem;
          ">${data.heroData.title || ''}</h1>
          <p style="
            color: ${data.heroData.subtitleColor || '#ffffff'};
            text-shadow: 
              1px 1px 3px rgba(0, 0, 0, 0.9),
              -1px -1px 1px rgba(255, 255, 255, 0.7),
              0 0 15px rgba(0, 0, 0, 0.5),
              0 0 25px rgba(255, 255, 255, 0.2);
            -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.2);
            filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.7));
            margin-bottom: 2rem;
          ">${data.heroData.subtitle || ''}</p>
          
          <div style="display: flex; gap: 1rem; justify-content: center; align-items: center;">
            ${data.heroData.buttonText ? `
              <button style="
                background-color: ${data.heroData.buttonColor || '#1976d2'};  
                color: ${data.heroData.buttonTextColor || '#ffffff'};
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
              ">${data.heroData.buttonText}</button>
            ` : ''}
            <a href="#contact" style="
              color: ${data.heroData.buttonTextColor || '#ffffff'};
              text-decoration: none;
              padding: 0.75rem 1.5rem;
              border: 2px solid ${data.heroData.buttonTextColor || '#ffffff'};
              border-radius: 6px;
              transition: all 0.3s ease;
              font-weight: 500;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(0.1px);
            ">${contactData.title || 'Contact Us'}</a>
          </div>
        </div>
      </div>
    </section>

    ${data.sectionsData.map(section => {
      // Get border colors from section cards for gradient
      const getBorderColors = () => {
        if (section.cards && section.cards.length > 0) {
          const firstCard = section.cards[0];
          const lastCard = section.cards[section.cards.length - 1];
          
          // Use card border color
          const startColor = firstCard.borderColor || '#1976d2';
          const endColor = lastCard.borderColor || '#64b5f6';

          return {
            start: startColor,
            end: endColor
          };
        }
        
        // If no cards, use default colors
        return {
          start: '#1976d2',
          end: '#64b5f6'
        };
      };

      const borderColors = getBorderColors();

      // Legacy block: if there are cards, render as before
      const cardsCount = (section.cards || []).length;
      let cardsClass = '';
      if (cardsCount === 2) cardsClass = 'cards-2';
      if (cardsCount === 3) cardsClass = 'cards-3';
      if (section.cardType === 'none') {
        // Check for images
        const hasImages = Array.isArray(section.images) && section.images.length > 0;
        const hasSingleImage = section.imagePath && !hasImages;
        
        // Get colors from section
        const bgColor = section.backgroundColor || '#ffffff';
        const titleColor = section.titleColor || '#1a237e';
        const descriptionColor = section.descriptionColor || '#455a64';
        const contentColor = section.contentColor || '#455a64';
        
                  // Prepare HTML for image gallery if there are multiple images
          let imagesHtml = '';
          if (hasImages) {
            if (section.images.length === 1) {
              // Single image from array
              const imgPath = typeof section.images[0] === 'string' 
                ? section.images[0].replace('/images/sections/', 'assets/images/')
                : (section.images[0].path || section.images[0].url || '').replace('/images/sections/', 'assets/images/');
              
              imagesHtml = `
                <div class="image-container" style="
                  float: right;
                  margin: 0 0 1rem 1.5rem;
                  width: 40%;
                  max-width: 300px;
                  height: 300px;
                  position: relative;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  transition: transform 0.3s ease;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                  <img 
                    src="${imgPath}" 
                    alt="${section.title || 'Section image'}"
                    style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 12px;
                      display: block;
                    "
                  >
                </div>
              `;
            } else {
              // Multiple images - create slider
              imagesHtml = `
                <div class="section-gallery" data-section-id="${section.id}" style="
                  float: right;
                  margin: 0 0 1rem 1.5rem;
                  width: 40%;
                  max-width: 300px;
                  height: 300px;
                  position: relative;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  transition: transform 0.3s ease;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                  ${section.images.map((img, index) => {
                    const imgPath = typeof img === 'string' 
                      ? img.replace('/images/sections/', 'assets/images/')
                      : (img.path || img.url || '').replace('/images/sections/', 'assets/images/');
                    
                    return `
                      <img 
                        src="${imgPath}" 
                        alt="${section.title || 'Section image'} ${index + 1}"
                        class="gallery-img"
                        data-index="${index}"
                        style="
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                          display: ${index === 0 ? 'block' : 'none'};
                          transition: opacity 0.5s ease;
                        "
                      >
                    `;
                  }).join('')}
                  
                  <!-- Gallery Navigation -->
                  <div style="
                    position: absolute;
                    bottom: 10px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    z-index: 2;
                  ">
                    ${section.images.map((_, index) => `
                      <span 
                        class="gallery-dot"
                        data-index="${index}"
                        style="
                          display: inline-block;
                          width: 8px;
                          height: 8px;
                          border-radius: 50%;
                          background-color: ${index === 0 ? '#ffffff' : 'rgba(255,255,255,0.5)'};
                          margin: 0 3px;
                          cursor: pointer;
                        "
                      ></span>
                    `).join('')}
                  </div>
                </div>
              `;
            }
          } else if (hasSingleImage) {
            // Single image from imagePath field
            imagesHtml = `
              <div class="image-container" style="
                float: right;
                margin: 0 0 1rem 1.5rem;
                width: 40%;
                max-width: 300px;
                height: 300px;
                position: relative;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: transform 0.3s ease;
              " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <img 
                  src="${section.imagePath.replace('/images/sections/', 'assets/images/')}" 
                  alt="${section.title || 'Section image'}"
                  style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 12px;
                    display: block;
                  "
                >
              </div>
            `;
        }
        
                 // Generate HTML for cards - each card with left colored border and effects
         const cardsHtml = (section.cards || []).map((card, index) => {
           const cardTitleColor = card.titleColor || titleColor;
           const cardContentColor = card.contentColor || contentColor;
           const cardBorderColor = card.borderColor || '#1976d2';
           
           return `
              <div class="service-block" style="
                padding: 1rem;
                margin-bottom: 1rem;
                border-left: 3px solid ${cardBorderColor};
                background: ${section.showBackground !== false ? 'rgba(255,255,255,0.05)' : 'transparent'};
                transition: all 0.3s ease;
                opacity: 0;
                --index: ${index};
                cursor: pointer;
                position: relative;
              " 
              onmouseover="this.style.transform='translateX(10px)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'"
              onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='none'"
              >
                <h3 style="
                  color: ${cardTitleColor};
                  font-size: 1.3rem;
                  font-weight: 600;
                  margin-bottom: 0.5rem;
                  font-family: 'Montserrat', sans-serif;
                  text-align: center;
                ">${card.title || ''}</h3>
                <p style="
                  color: ${cardContentColor};
                  font-size: 1rem;
                  line-height: 1.6;
                  margin: 0;
                  font-family: 'Roboto', sans-serif;
                  text-align: left;
                ">${card.content || card.text || ''}</p>
              </div>
           `;
        }).join('');
        
                  // Create structure as close as possible to preview
          return `
            <style>
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
              }
              
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              #${section.id} .service-block {
                animation: slideInLeft 0.5s ease-out forwards;
                animation-delay: calc(var(--index, 0) * 0.1s);
              }
              
              #${section.id} h2 {
                animation: slideUp 0.7s ease-out forwards;
              }
              
              #${section.id} > p {
                animation: slideUp 0.7s ease-out 0.2s forwards;
                opacity: 0;
                animation-fill-mode: forwards;
              }
              
              /* Media query for mobile devices */
              @media (max-width: 768px) {
                #${section.id} .image-container {
                  float: none !important;
                  margin: 0 auto 2rem auto !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 250px !important;
                }
                
                #${section.id} .section-gallery {
                  float: none !important;
                  margin: 0 auto 2rem auto !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 250px !important;
                }
              }
            </style>
            
            <section id="${section.id}" class="section section-nocards" style="
              padding: 4rem 0;
              position: relative;
              background: ${section.showBackground !== false ? bgColor : 'transparent'};
              border-radius: 20px;
              margin: 2rem auto;
              max-width: 1000px;
              box-shadow: ${section.showBackground !== false ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'};
              overflow: hidden;
              animation: fadeIn 0.5s ease-in-out;
            ">
              <!-- Top color bar -->
              <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #1976d2, #42a5f5);
                display: ${section.showBackground !== false ? 'block' : 'none'};
              "></div>
            
            <div class="container">
              <div class="section-content" style="
                position: relative;
                max-width: 1000px;
                margin: 0 auto;
                padding: 0 2rem;
              ">
                ${section.title ? `
                  <h2 style="
                    color: ${titleColor};
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    position: relative;
                  ">${section.title}</h2>
                ` : ''}
                
                ${section.description ? `
                  <p style="
                    color: ${descriptionColor};
                    font-size: 1.1rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    text-align: center;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                  ">${section.description}</p>
                ` : ''}
                
                <!-- Container with text and image -->
                <div class="with-image" style="
                  position: relative;
                  display: flow-root;
                ">
                  <!-- Floating image -->
                  ${imagesHtml}
                  
                  <!-- Cards -->
                  <div style="
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                  ">
                    ${cardsHtml}
                  </div>
                </div>
              </div>
            </div>
          </section>
        `;
      }
      return `
        <section id="${section.id}" class="section" 
          data-show-background="${section.showBackground !== false}"
          style="
            --border-start-color: ${borderColors.start};
            --border-end-color: ${borderColors.end};
            --section-background-color: ${section.backgroundColor || 'transparent'};
            position: relative;
            overflow: hidden;
            border-radius: 20px;
            color: ${section.contentColor || '#455a64'};
          "
        >
          <div class="section-container" style="position: relative; z-index: 2;">
            <div class="section-header">
              <h2 style="
                color: ${section.titleColor || '#1a237e'}; 
                text-align: center; 
                margin-bottom: 1rem;
                font-size: 2rem;
                font-weight: 600;
              ">${section.title || ''}</h2>
              ${section.description ? `
                <p style="
                  color: ${section.descriptionColor || '#455a64'}; 
                  text-align: center; 
                  margin-bottom: 1rem;
                  font-size: 1.1rem;
                  line-height: 1.6;
                ">${section.description}</p>
              ` : ''}
              ${(() => {
                // Проверяем наличие изображений
                const hasImages = Array.isArray(section.images) && section.images.length > 0;
                const hasSingleImage = section.imagePath && !hasImages;
                
                if (hasImages) {
                  if (section.images.length === 1) {
                    // Одно изображение из массива
                    const imgPath = typeof section.images[0] === 'string' 
                      ? section.images[0].replace('/images/sections/', 'assets/images/')
                      : (section.images[0].path || section.images[0].url || '').replace('/images/sections/', 'assets/images/');
                    
                    return `
                      <div class="section-image" style="
                        width: 100%;
                        margin: 2rem auto;
                        text-align: center;
                        max-width: 800px;
                        height: 500px;
                      ">
                        <img src="${imgPath}" alt="${section.title || 'Section image'}" style="
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                          border-radius: 12px;
                          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                          transition: transform 0.3s ease;
                        ">
                      </div>
                    `;
                  } else {
                    // Несколько изображений - делаем слайдер
                    return `
                      <div class="section-gallery" data-section-id="${section.id}" style="
                        width: 100%;
                        margin: 2rem auto;
                        text-align: center;
                        max-width: 800px;
                        height: 500px;
                        position: relative;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                      ">
                        ${section.images.map((img, index) => {
                          const imgPath = typeof img === 'string' 
                            ? img.replace('/images/sections/', 'assets/images/')
                            : (img.path || img.url || '').replace('/images/sections/', 'assets/images/');
                          
                          return `
                            <img 
                              src="${imgPath}" 
                              alt="${section.title || 'Section image'} ${index + 1}"
                              class="gallery-img"
                              data-index="${index}"
                              style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                display: ${index === 0 ? 'block' : 'none'};
                                transition: opacity 0.5s ease;
                              "
                            >
                          `;
                        }).join('')}
                        
                                        <!-- Gallery Navigation -->
                <div style="
                          position: absolute;
                          bottom: 10px;
                          left: 0;
                          right: 0;
                          text-align: center;
                          z-index: 2;
                        ">
                          ${section.images.map((_, index) => `
                            <span 
                              class="gallery-dot"
                              data-index="${index}"
                              style="
                                display: inline-block;
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background-color: ${index === 0 ? '#ffffff' : 'rgba(255,255,255,0.5)'};
                                margin: 0 5px;
                                cursor: pointer;
                              "
                            ></span>
                          `).join('')}
                        </div>
                      </div>
                    `;
                  }
                } else if (hasSingleImage) {
                  // Одно изображение из поля imagePath
                  return `
                    <div class="section-image" style="
                      width: 100%;
                      margin: 2rem auto;
                      text-align: center;
                      max-width: 800px;
                      height: 500px;
                    ">
                      <img src="${section.imagePath.replace('/images/sections/', 'assets/images/')}" alt="${section.title || 'Section image'}" style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        transition: transform 0.3s ease;
                      ">
                    </div>
                  `;
                }
                
                return '';
              })()}
            </div>
            <div class="cards-container${cardsClass ? ' ' + cardsClass : ''}">
              ${(section.cards || []).map(card => `
                <div class="card ${section.cardType}" data-card-id="${card.id}" data-card-type="${section.cardType}" data-bg-type="${card.backgroundType}"
                  style="${card.backgroundType === 'solid' ? `background-color: ${card.backgroundColor || '#ffffff'};` : ''}
                  ${card.backgroundType === 'gradient' ? `background: linear-gradient(${card.gradientDirection || 'to right'}, ${card.gradientColor1 || '#ffffff'}, ${card.gradientColor2 || '#f5f5f5'});` : ''}
                  border: 3px solid ${card.borderColor || '#e0e0e0'};
                  border-radius: ${card.style?.borderRadius || '12px'};
                  ${card.style?.shadow ? `box-shadow: ${card.style.shadow};` : ''}
                  position: relative;
                  z-index: 2;
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                  padding: 1.5rem;
                  transition: all 0.3s ease-in-out;">
                  <h3 style="
                    color: ${card.titleColor || section.titleColor || '#1a237e'}; 
                    margin-bottom: 0.7rem;
                    font-size: 1.5rem;
                    font-weight: 600;
                    transition: color 0.3s ease-in-out;
                    text-align: center;
                  ">${card.title || ''}</h3>
                  <p style="
                    color: ${card.contentColor || section.contentColor || '#455a64'}; 
                    font-size: 1rem;
                    line-height: 1.6;
                    transition: color 0.3s ease-in-out;
                    text-align: left;
                  ">${card.content || ''}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;
    }).join('')}

    <section id="contact" class="section"
      style="
        padding: 4rem 0;
        position: relative;
        z-index: 2;
        border-radius: 20px;
        overflow: hidden;
        ${contactData.showBackground !== false && contactData.backgroundType === 'gradient' ? 
          `background: linear-gradient(${contactData.gradientDirection || 'to bottom'}, ${contactData.gradientColor1 || '#ffffff'}, ${contactData.gradientColor2 || '#f5f5f5'});` :
          contactData.showBackground !== false && contactData.backgroundColor ? 
          `background-color: ${contactData.backgroundColor};` : ''}
      ">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 3rem;">
          <h2 style="
            color: ${contactData.titleColor || '#000000'};
            font-size: 2.5rem;
            margin-bottom: 1rem;
            position: relative;
            display: inline-block;
          ">
            ${contactData.title || 'Contact Us'}
            <span style="
              content: '';
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              width: 50px;
              height: 3px;
              background-color: ${contactData.titleColor || '#000000'};
            "></span>
          </h2>
          <p style="
            color: ${contactData.descriptionColor || '#666666'};
            font-size: 1.1rem;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
          ">
            ${contactData.description || 'Please leave your contact details and we will get back to you as soon as possible'}
          </p>
        </div>
        <div class="contact-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 1140px; margin: 0 auto; padding: 0 20px;">
          <div class="contact-form" style="
            border: 1px solid ${contactData.formBorderColor || '#1976d2'};
            padding: 2.5rem;
            border-radius: 8px;
            background-color: ${contactData.formBackgroundColor || '#ffffff'};
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          ">
            <form 
              id="contactForm" 
              method="POST"
              onsubmit="submitForm(event)"
            >
              <input type="hidden" name="_next" value="merci.html" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_subject" value="New message from website" />
              <input type="hidden" name="_language" id="formLanguage" value="en" />
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label for="name" style="color: ${contactData.labelColor || '#333'}; display: block; margin-bottom: 0.5rem; font-weight: 500;">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  class="form-control" 
                  placeholder="Enter your full name" 
                  style="
                    border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                    background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                    color: ${contactData.inputTextColor || '#333'};
                    padding: 0.85rem 1rem;
                    width: 100%;
                    border-radius: 6px;
                    font-size: 1rem;
                    box-sizing: border-box;
                    margin-bottom: 0;
                  " 
                  required
                >
              </div>
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label for="phone" style="color: ${contactData.labelColor || '#333'}; display: block; margin-bottom: 0.5rem; font-weight: 500;">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  class="form-control" 
                  placeholder="Enter your phone number with country code" 
                  style="
                    border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                    background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                    color: ${contactData.inputTextColor || '#333'};
                    padding: 0.85rem 1rem;
                    width: 100%;
                    border-radius: 6px;
                    font-size: 1rem;
                    box-sizing: border-box;
                    margin-bottom: 0;
                  " 
                  pattern="\\+?[0-9\\s-()]{7,}"
                  required
                >
              </div>
              <div class="form-group" style="margin-bottom: 2rem;">
                <label for="email" style="color: ${contactData.labelColor || '#333'}; display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="form-control" 
                  placeholder="Enter your email address" 
                  style="
                    border: 1px solid ${contactData.inputBorderColor || '#ddd'};
                    background-color: ${contactData.inputBackgroundColor || '#ffffff'};
                    color: ${contactData.inputTextColor || '#333'};
                    padding: 0.85rem 1rem;
                    width: 100%;
                    border-radius: 6px;
                    font-size: 1rem;
                    box-sizing: border-box;
                    margin-bottom: 0;
                  " 
                  required
                >
              </div>
              <button 
                type="submit" 
                class="submit-btn" 
                style="
                  background-color: ${contactData.buttonColor || '#1976d2'};
                  color: ${contactData.buttonTextColor || '#ffffff'};
                  border: none;
                  padding: 0.9rem 1.5rem;
                  border-radius: 6px;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  font-weight: 500;
                  width: 100%;
                  font-size: 1rem;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                "
              >
                Send Message
              </button>
            </form>
            <script>
              document.addEventListener('DOMContentLoaded', function() {
                const form = document.getElementById('contactForm');
                const inputs = form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]');
                
                // Language logic removed
                
                // Load saved data
                try {
                  const savedData = localStorage.getItem('contactFormData');
                  if (savedData) {
                    const data = JSON.parse(savedData);
                    if (data) {
                      inputs.forEach(input => {
                        if (data[input.name]) {
                          input.value = data[input.name];
                        }
                      });
                    }
                  }
                } catch (error) {
                  console.error('Error loading saved data:', error);
                }

                // Save data on input
                inputs.forEach(input => {
                  input.addEventListener('input', function() {
                    try {
                      const formData = {};
                      inputs.forEach(inp => {
                        formData[inp.name] = inp.value;
                      });
                      localStorage.setItem('contactFormData', JSON.stringify(formData));
                    } catch (error) {
                      console.error('Error saving data:', error);
                    }
                  });
                });
              });
              
              // Form submission function with forced redirect
              async function submitForm(event) {
                event.preventDefault();
                
                const form = event.target;
                const formData = new FormData(form);
                
                try {
                  // Clear localStorage
                  localStorage.removeItem('contactFormData');
                  
                  // Send form data to Formspree
const response = await fetch('https://formspree.io/f/mqalqbeo', {
                    method: 'POST',
                    body: formData,
                    headers: {
                      'Accept': 'application/json'
                    }
                  }).finally(() => {
                    // Always redirect to merci.html
                    window.location.href = 'merci.html';
                  });
                } catch (error) {
                  console.error('Error sending form:', error);
                  // Even on error, redirect to merci.html
                  window.location.href = 'merci.html';
                }
                
                return false;
              }
            </script>
          </div>
          <div class="contact-info" style="
            border: 1px solid ${contactData.infoBorderColor || '#1976d2'};
            border-radius: 8px;
            background-color: ${contactData.infoBackgroundColor || '#ffffff'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          ">
            <div class="company-info" style="
              padding: 2rem;
              border-bottom: 1px solid ${contactData.infoBorderColor || '#1976d2'};
            ">
              <h3 style="
                color: ${contactData.infoTitleColor || '#333'};
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
                text-align: center;
              ">${contactData.companyName || 'Our Company'}</h3>
              <div class="contact-details">
                ${contactData.address ? `
                  <p style="color: ${contactData.infoTextColor || '#333'}; margin-bottom: 1rem;">
                    <i class="fas fa-map-marker-alt" style="color: ${contactData.iconColor || '#1976d2'}; margin-right: 0.5rem;"></i>
                    ${contactData.address}
                  </p>
                ` : ''}
                ${contactData.phone ? `
                  <p style="color: ${contactData.infoTextColor || '#333'}; margin-bottom: 1rem;">
                    <i class="fas fa-phone" style="color: ${contactData.iconColor || '#1976d2'}; margin-right: 0.5rem;"></i>
                    ${contactData.phone}
                  </p>
                ` : ''}
                ${contactData.email ? `
                  <p style="color: ${contactData.infoTextColor || '#333'}; margin-bottom: 1rem;">
                    <i class="fas fa-envelope" style="color: ${contactData.iconColor || '#1976d2'}; margin-right: 0.5rem;"></i>
                    ${contactData.email}
                  </p>
                  <div class="contact-domain" style="color: ${contactData.infoTextColor || '#333'}; opacity: 0.8; font-size: 0.9rem; margin-top: 4px; margin-left: 1.5rem; display: none;"></div>
                ` : ''}
              </div>
            </div>
            <div class="contact-map" style="height: 300px;">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contactData.address || '')}"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer style="
    background-color: ${data.footerData.backgroundColor || '#1a1a1a'};
    color: ${data.footerData.textColor || '#fff'};
    padding: 3rem 0;
    position: relative;
    z-index: 1;
  ">
    <div style="
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    ">
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      ">
        <div style="
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 1rem;
            font-size: 1.2rem;
          ">${data.contactData.companyName || 'Company Name'}</h3>
          <p style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          ">
            <i class="fas fa-map-marker-alt" style="color: ${data.footerData.iconColor || '#fff'}"></i>
            ${data.contactData.address || 'Address'}
          </p>
          <p style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          ">
            <i class="fas fa-phone" style="color: ${data.footerData.iconColor || '#fff'}"></i>
            ${data.contactData.phone || 'Phone'}
          </p>
          <p style="
            color: ${data.footerData.textColor || '#fff'};
            display: flex;
            align-items: center;
            gap: 0.5rem;
          ">
            <i class="fas fa-envelope" style="color: ${data.footerData.iconColor || '#fff'}"></i>
            ${data.contactData.email || 'Email'}
          </p>
          <div class="footer-domain" style="color: ${data.footerData.textColor || '#fff'}; opacity: 0.8; font-size: 0.9rem; margin-top: 4px; margin-left: 1.5rem; display: none;"></div>
        </div>

        <div style="
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 1rem;
            font-size: 1.2rem;
          ">Menu</h3>
          <div style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          ">
            ${data.headerData.menuItems.map(item => `
              <a href="#${item.id}" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
                padding: 0.25rem 0;
              ">${item.text}</a>
            `).join('')}
            <a href="#contact" style="
              color: ${data.footerData.textColor || '#fff'};
              text-decoration: none;
              transition: color 0.3s;
              padding: 0.25rem 0;
            ">${data.contactData.title || 'Contact Us'}</a>
          </div>
        </div>

        <div style="
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="
            color: ${data.footerData.textColor || '#fff'};
            margin-bottom: 1rem;
            font-size: 1.2rem;
          ">Legal Information</h3>
          <ul style="
            list-style: none;
            padding: 0;
            margin: 0;
          ">
            <li style="margin-bottom: 0.5rem;">
              <a href="privacy-policy.html" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
              ">${data.legalDocuments?.privacyPolicy?.title || 'Privacy Policy'}</a>
            </li>
            <li style="margin-bottom: 0.5rem;">
              <a href="terms-of-service.html" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
              ">${data.legalDocuments?.termsOfService?.title || 'Terms of Service'}</a>
            </li>
            <li>
              <a href="cookie-policy.html" style="
                color: ${data.footerData.textColor || '#fff'};
                text-decoration: none;
                transition: color 0.3s;
              ">${data.legalDocuments?.cookiePolicy?.title || 'Cookie Policy'}</a>
            </li>
          </ul>
        </div>
      </div>

      <div style="
        text-align: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      ">
        <p style="
          color: ${data.footerData.textColor || '#fff'};
          font-size: 0.9rem;
        ">
          © ${new Date().getFullYear()} ${data.contactData.companyName || 'Company Name'}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>

  <script src="assets/js/script.js"></script>

  <!-- Cookie consent notification -->
  <div id="cookieConsent" style="
    position: fixed;
    left: 20px;
    bottom: 20px;
    background: rgba(30, 30, 30, 0.97);
    color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    padding: 1.2rem 1.5rem;
    z-index: 9999;
    display: none;
    min-width: 280px;
    max-width: 350px;
    font-size: 1rem;
    animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) both;
  ">
    <div style="display: flex; align-items: flex-start; gap: 1rem;">
      <div style="flex:1;">
        <strong>We use cookies</strong><br>
        This website uses cookies to ensure you get the best experience on our website. <a href="cookie-policy.html" style="color:#90caf9;text-decoration:underline;">Learn more</a>.
      </div>
      <button id="cookieAcceptBtn" style="margin-left: 8px; background: #1976d2; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.1rem; font-weight: 500; cursor: pointer; transition: background 0.2s;">Accept</button>
    </div>
  </div>

  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    #cookieConsent a:hover { color: #fff; text-decoration: underline; }
    #cookieAcceptBtn:hover { background: #1565c0; }
  </style>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var consent = localStorage.getItem('cookieConsent');
      var consentBox = document.getElementById('cookieConsent');
      var acceptBtn = document.getElementById('cookieAcceptBtn');
      if (!consent && consentBox) {
        consentBox.style.display = 'block';
      }
      if (acceptBtn) {
        acceptBtn.onclick = function() {
          localStorage.setItem('cookieConsent', 'accepted');
          if (consentBox) consentBox.style.display = 'none';
        };
      }
    });
  </script>

  ${data.liveChatData?.enabled ? generateLiveChatHTML(data.headerData.siteName || 'Наш сайт', data.headerData.language || 'ru', data.liveChatData) : ''}

  <script>
    ${data.liveChatData?.enabled ? generateLiveChatJS(data.headerData.siteName || 'Наш сайт', data.headerData.language || 'ru', data.liveChatData) : ''}
  </script>

  </body>
</html>`;
  };

  // Генерация стилей для бегущей строки
  const getRunningLineTextStyles = (runningLineData) => {
    if (!runningLineData) return '';
    
    const { textStyle, textColor, backgroundColor } = runningLineData;
    
    const adjustColor = (color, amount) => {
      const usePound = color[0] === '#';
      const col = usePound ? color.slice(1) : color;
      const num = parseInt(col, 16);
      let r = (num >> 16) + amount;
      let g = (num >> 8 & 0x00FF) + amount;
      let b = (num & 0x0000FF) + amount;
      r = r > 255 ? 255 : r < 0 ? 0 : r;
      g = g > 255 ? 255 : g < 0 ? 0 : g;
      b = b > 255 ? 255 : b < 0 ? 0 : b;
      return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
    };

    // Функция для получения яркости цвета (0-255)
    const getBrightness = (color) => {
      const usePound = color[0] === '#';
      const col = usePound ? color.slice(1) : color;
      const num = parseInt(col, 16);
      const r = (num >> 16);
      const g = (num >> 8 & 0x00FF);
      const b = (num & 0x0000FF);
      return (r * 299 + g * 587 + b * 114) / 1000;
    };

    // Функция для создания контрастного цвета тени для 3D эффекта
    const get3DShadowColor = (textColor, backgroundColor) => {
      const textBrightness = getBrightness(textColor);
      const bgBrightness = getBrightness(backgroundColor);
      
      // Если текст светлый, делаем тень темнее
      if (textBrightness > 128) {
        return adjustColor(textColor, -80); // Темнее
      } else {
        // Если текст темный, делаем тень светлее
        return adjustColor(textColor, 60); // Светлее
      }
    };

    // Функция для создания контрастной обводки
    const getContrastOutline = (textColor, backgroundColor) => {
      const textBrightness = getBrightness(textColor);
      const bgBrightness = getBrightness(backgroundColor);
      
      // Если разница яркости небольшая, используем черную или белую обводку
      if (Math.abs(textBrightness - bgBrightness) < 100) {
        return textBrightness > 128 ? '#000000' : '#ffffff';
      }
      
      // Иначе используем противоположный цвет
      return textBrightness > bgBrightness ? '#000000' : '#ffffff';
    };
    
    switch (textStyle) {
      case 'shadow':
        return 'text-shadow: 2px 2px 4px rgba(0,0,0,0.7);';
      case 'outline':
        const outlineColor = getContrastOutline(textColor, backgroundColor);
        return `text-shadow: 
          -1px -1px 0 ${outlineColor},
          1px -1px 0 ${outlineColor},
          -1px 1px 0 ${outlineColor},
          1px 1px 0 ${outlineColor};`;
      case 'glow':
        return `
          text-shadow: 0 0 10px ${textColor}, 0 0 20px ${textColor}, 0 0 30px ${textColor};
          filter: brightness(1.1);
        `;
      case '3d':
        const shadowColor = get3DShadowColor(textColor, backgroundColor);
        const outlineColor3d = getContrastOutline(textColor, backgroundColor);
        return `text-shadow: 
          -1px -1px 0 ${outlineColor3d},
          1px -1px 0 ${outlineColor3d},
          -1px 1px 0 ${outlineColor3d},
          1px 1px 0 ${outlineColor3d},
          1px 1px 0 ${shadowColor},
          2px 2px 0 ${shadowColor},
          3px 3px 0 ${shadowColor},
          4px 4px 0 ${shadowColor},
          5px 5px 0 ${shadowColor};`;
      case '3d-classic':
        return `text-shadow: 
          1px 1px 0 #ccc,
          2px 2px 0 #ccc,
          3px 3px 0 #ccc,
          4px 4px 0 #ccc,
          5px 5px 0 #ccc;`;
      case '3d-bold':
        const boldShadow = adjustColor(textColor, -100);
        return `text-shadow: 
          -2px -2px 0 #000,
          2px -2px 0 #000,
          -2px 2px 0 #000,
          2px 2px 0 #000,
          2px 2px 0 ${boldShadow},
          4px 4px 0 ${boldShadow},
          6px 6px 0 ${boldShadow};`;
      case '3d-neon':
        return `text-shadow: 
          0 0 5px ${textColor},
          0 0 10px ${textColor},
          1px 1px 0 ${adjustColor(textColor, -50)},
          2px 2px 0 ${adjustColor(textColor, -50)},
          3px 3px 0 ${adjustColor(textColor, -50)};`;
      case 'gradient':
        return `
          background: linear-gradient(45deg, ${textColor}, ${adjustColor(textColor, 50)});
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;
      default:
        return '';
    }
  };

  const generateCSS = (data = {}) => {
          const runningLineSpeed = data?.headerData?.runningLine?.speed || 25;
    return `
      /* Base styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Roboto', sans-serif;
      }

      /* Styles for sections without cards */
      .section-nocards {
        background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
        border-radius: 40px;
        padding: 5rem 3rem;
        margin: 4rem auto;
        max-width: 1400px;
        box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        position: relative;
        overflow: hidden;
      }

      .section-nocards::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 8px;
        background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
      }

      .section-nocards h2 {
        font-size: 3rem;
        font-weight: 900;
        text-align: center;
        margin-bottom: 3rem;
        background: linear-gradient(45deg, #2C3E50, #3498DB);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-transform: uppercase;
        letter-spacing: 3px;
        font-family: "Montserrat", sans-serif;
        text-shadow: 3px 3px 6px rgba(0,0,0,0.2);
      }

      .section-nocards p {
        font-size: 1.8rem;
        text-align: center;
        margin-bottom: 5rem;
        color: #34495E;
        font-family: "Playfair Display", serif;
        font-style: italic;
        line-height: 1.8;
        max-width: 800px;
        margin: 0 auto 5rem;
        padding: 0 1.5rem;
      }

      /* Styles for blocks in sections without cards */
      .section-nocards .service-block {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 30px;
        padding: 4rem;
        box-shadow: 0 15px 45px rgba(0,0,0,0.08);
        border: 2px solid rgba(0,0,0,0.08);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateY(0);
        margin-bottom: 4rem;
      }

      .section-nocards .service-block:hover {
        transform: translateY(-20px);
        box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        border-color: #4ECDC4;
        border-width: 3px;
      }

      .section-nocards .service-block h3 {
        font-size: 2.8rem;
        font-weight: 800;
        margin-bottom: 2.5rem;
        color: #2C3E50;
        font-family: "Montserrat", sans-serif;
        border-bottom: 4px solid #4ECDC4;
        padding-bottom: 1.5rem;
      }

      .section-nocards .service-block p {
        font-size: 1.5rem;
        line-height: 2;
        color: #34495E;
        font-family: "Playfair Display", serif;
        white-space: pre-wrap;
        text-align: left;
        margin: 0;
      }

      /* Styles for sections without cards with images */
      .section-nocards.with-image {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 4rem;
      }

      .section-nocards.with-image .content {
        flex: 1;
      }

      .section-nocards.with-image .image-container {
        flex: 0 0 40%;
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        transition: all 0.4s ease;
      }

      .section-nocards.with-image .image-container:hover {
        transform: translateY(-10px);
        box-shadow: 0 30px 60px rgba(0,0,0,0.2);
      }

      .section-nocards.with-image .image-container img {
        width: 100%;
        height: auto;
        display: block;
        transition: transform 0.4s ease;
      }

      .section-nocards.with-image .image-container:hover img {
        transform: scale(1.05);
      }

      /* Animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .section-nocards .service-block {
        animation: fadeInUp 0.7s ease-out forwards;
      }

      /* Responsiveness */
      @media (max-width: 768px) {
        .section-nocards {
          padding: 3rem 1.5rem;
          margin: 2rem auto;
          border-radius: 20px;
        }

        .section-nocards h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .section-nocards p {
          font-size: 1.2rem;
          margin-bottom: 3rem;
        }

        .section-nocards .service-block {
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .section-nocards .service-block h3 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }

        .section-nocards .service-block p {
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .section-nocards.with-image {
          flex-direction: column;
        }

        .section-nocards.with-image .image-container {
          flex: 0 0 100%;
          margin-bottom: 2rem;
        }
      }

      /* Running Line Styles */
      .running-line-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1200;
        overflow: hidden;
        height: auto;
        min-height: ${parseInt(data?.headerData?.runningLine?.padding || '6') * 4 + 20}px;
        display: flex;
        align-items: center;
      }

      .running-line {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        display: flex;
        align-items: center;
        min-height: ${parseInt(data?.headerData?.runningLine?.padding || '6') * 4 + 20}px;
        padding: ${data?.headerData?.runningLine?.padding || '6'}px 0;
      }

      .running-line-text {
        display: inline-block;
        animation-name: moveText;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-duration: ${runningLineSpeed}s;
        white-space: nowrap;
        font-size: ${data?.headerData?.runningLine?.fontSize || '20px'};
        font-weight: ${data?.headerData?.runningLine?.fontWeight || 'bold'};
        font-family: ${data?.headerData?.runningLine?.fontFamily || 'system-ui, -apple-system, sans-serif'};
        line-height: ${data?.headerData?.runningLine?.lineHeight || '1.2'};
        color: ${data?.headerData?.runningLine?.textColor || '#ffffff'};
        padding: ${data?.headerData?.runningLine?.padding || '4'}px 0;
        transition: all 0.3s ease;
        ${getRunningLineTextStyles(data?.headerData?.runningLine)}
      }

      .running-line-container:hover .running-line-text {
        animation-play-state: paused !important;
      }
      
      .running-line-text:hover {
        ${data?.headerData?.runningLine?.textStyle === 'glow' || data?.headerData?.runningLine?.textStyle === '3d-neon' ? 'transform: scale(1.02); filter: brightness(1.2);' : ''}
      }

      @keyframes moveText {
        0% {
          transform: translateX(100vw);
        }
        100% {
          transform: translateX(-100%);
        }
      }

      /* Adaptive styles for running line */
      @media (max-width: 768px) {
        .running-line-container {
          min-height: ${Math.max(parseInt(data?.headerData?.runningLine?.padding || '4') * 3 + 18, 28)}px;
        }
        
        .running-line {
          min-height: ${Math.max(parseInt(data?.headerData?.runningLine?.padding || '4') * 3 + 18, 28)}px;
          padding: ${Math.max(parseInt(data?.headerData?.runningLine?.padding || '4') - 2, 2)}px 0;
        }
        
        .running-line-text {
          font-size: ${Math.max(parseInt(data?.headerData?.runningLine?.fontSize || '20') - 2, 12)}px;
          animation-duration: ${Math.max(runningLineSpeed * 0.9, 18)}s !important;
        }
      }

      @media (max-width: 480px) {
        .running-line-container {
          min-height: ${Math.max(parseInt(data?.headerData?.runningLine?.padding || '4') * 2 + 16, 26)}px;
        }
        
        .running-line {
          min-height: ${Math.max(parseInt(data?.headerData?.runningLine?.padding || '4') * 2 + 16, 26)}px;
          padding: ${Math.max(parseInt(data?.headerData?.runningLine?.padding || '4') - 4, 1)}px 0;
        }
        
        .running-line-text {
          font-size: ${Math.max(parseInt(data?.headerData?.runningLine?.fontSize || '20') - 4, 10)}px;
          animation-duration: ${Math.max(runningLineSpeed * 0.8, 16)}s !important;
        }
      }

      /* Other styles */
      header {
        position: fixed;
        top: ${parseInt(data?.headerData?.runningLine?.padding || '4') * 4 + 20}px;
        left: 0;
        right: 0;
        z-index: 1000;
      }

      nav {
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
      }

      .logo {
        font-size: 1.5rem;
        font-weight: 700;
        text-decoration: none;
        white-space: nowrap;
        margin-right: 2rem;
      }

      .domain {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.9rem;
        font-weight: normal;
        opacity: 0.8;
        white-space: nowrap;
      }

      .nav-menu {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        flex-wrap: nowrap;
      }

      .nav-menu li {
        margin-left: 2rem;
        white-space: nowrap;
      }

      .nav-menu a {
        text-decoration: none;
        position: relative;
        white-space: nowrap;
      }

      .nav-menu a::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: currentColor;
        transition: width 0.3s ease;
      }

      .nav-menu a:hover::after {
        width: 100%;
      }

      .menu-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
      }

      .menu-toggle span {
        display: block;
        width: 25px;
        height: 3px;
        background-color: currentColor;
        margin: 5px 0;
        transition: all 0.3s ease;
      }

      @media (max-width: 768px) {
        header {
          top: ${Math.max(parseInt(data?.headerData?.runningLine?.padding || '4') * 3 + 18, 28)}px;
        }
        
        .menu-toggle {
          display: block;
          color: inherit;
          z-index: 1002;
          position: relative;
        }

        .nav-menu {
          display: none !important;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--menu-bg-color, #fff);
          padding: 1rem 0;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 1001;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .nav-menu.active {
          display: flex !important;
        }

        .nav-menu li {
          margin: 0.5rem 0;
          width: 100%;
          text-align: center;
        }

        .nav-menu a {
          display: block;
          padding: 0.75rem 1rem;
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--menu-link-color, #1976d2) !important;
          background: transparent;
          transition: color 0.3s;
        }

        .nav-menu a::after {
          display: none;
        }

        .logo {
          font-size: 1.1rem;
          margin-right: 1rem;
          white-space: nowrap;
        }
      }

      @media (max-width: 480px) {
        header {
          top: 28px;
        }
        
        .nav-container {
          padding: 0 0.5rem;
        }

        .logo {
          font-size: 1rem;
        }

        .nav-menu a {
          font-size: 0.9rem;
        }
      }

      body {
        line-height: 1.6;
        color: #333;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        margin: 0;
        padding: 0;
        width: 100%;
                padding-top: ${data.headerData.runningLine?.enabled ? `${parseInt(data?.headerData?.runningLine?.padding || '4') * 4 + 90}px` : '100px'};
      }

      @media (max-width: 768px) {
        body {
          padding-top: ${data.headerData.runningLine?.enabled ? `${Math.max(parseInt(data?.headerData?.runningLine?.padding || '4') * 3 + 18, 28) + 75}px` : '95px'};
        }
      }

      @media (max-width: 480px) {
        body {
          padding-top: ${data.headerData.runningLine?.enabled ? `${Math.max(parseInt(data?.headerData?.runningLine?.padding || '4') * 2 + 16, 26) + 70}px` : '90px'};
        }
      }
      
      /* Styles for image gallery */
      .section-gallery {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      .gallery-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.5s ease;
      }
      
      .gallery-dot {
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      
      /* Styles for images inside sections with text wrapping */
      section p + .section-gallery,
      section h2 + .section-gallery {
        margin-top: 1rem;
        margin-bottom: 1rem;
      }

      /* Styles for section borders */
      section {
        position: relative;
        padding: 6rem 0;
        margin: 2rem 0;
        overflow: hidden;
      }

      section:first-child {
        margin-top: 0;
      }

      section:last-child {
        margin-bottom: 0;
      }

      section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 4px solid transparent;
        border-radius: 20px;
        background: linear-gradient(45deg, var(--border-start-color, #1976d2), var(--border-end-color, #64b5f6)) border-box;
        -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        z-index: 1;
        transition: all 0.3s ease-in-out;
        animation: borderPulse 3s infinite, glowPulse 3s infinite;
        pointer-events: none;
      }

      section:hover::before {
        border: 5px solid transparent;
        box-shadow: 0 0 25px 15px var(--border-start-color, #1976d2);
        animation: none;
      }

      @keyframes borderPulse {
        0% {
          border-width: 4px;
          box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
        }
        50% {
          border-width: 5px;
          box-shadow: 0 0 20px 10px rgba(25, 118, 210, 0.2);
        }
        100% {
          border-width: 4px;
          box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
        }
      }

      @keyframes glowPulse {
        0% {
          box-shadow: 0 0 5px 0 rgba(25, 118, 210, 0.4);
        }
        50% {
          box-shadow: 0 0 20px 10px rgba(25, 118, 210, 0.2);
        }
        100% {
          box-shadow: 0 0 5px 0 rgba(25, 118, 210, 0.4);
        }
      }

      .site-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }

      main {
        flex: 1;
        padding-top: 60px;
        width: 100%;
        overflow-x: hidden;
      }

      .hero {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0 2rem;
        position: relative;
        overflow: hidden;
        animation: pageOpen 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: 0s;
        opacity: 0;
        /* Убираем рамку только с hero секции */
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }

      /* Убираем рамки со всех элементов внутри hero */
      .hero * {
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }

      /* Максимальный приоритет для удаления рамок hero */
      .hero,
      .hero::before,
      .hero::after,
      .hero *,
      .hero *::before,
      .hero *::after {
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        -webkit-border: none !important;
        -moz-border: none !important;
        -webkit-box-shadow: none !important;
        -moz-box-shadow: none !important;
      }

      /* Плавное появление фонового изображения */
      .hero-bg-animation {
        transition: opacity 0.8s ease-out;
      }

      .hero {
        position: relative;
        overflow: hidden;
      }

      .hero-bg-animation {
        position: absolute;
        top: -5%;
        left: -5%;
        width: 110%;
        height: 110%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: -1;
        /* Плавная анимация без дублирования */
        animation: heroBackgroundZoom 20s ease-out infinite;
        animation-delay: 0s;
        opacity: 1;
        animation-fill-mode: forwards;
      }

      @keyframes heroBackgroundZoom {
        0% { 
          transform: scale(1);
          opacity: 0;
        }
        20% {
          opacity: 1;
        }
        50% { 
          transform: scale(1.02);
          opacity: 1;
        }
        100% { 
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes zoomIn {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.1);
        }
      }

      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        animation: fadeIn 1s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .hero-content {
        max-width: 800px;
        z-index: 2;
        position: relative;
        animation: slideUp 1s ease-out;
        animation-delay: 0.8s;
        opacity: 0;
        animation-fill-mode: forwards;
      }

      @keyframes slideUp {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes pageOpen {
        from {
          opacity: 0;
          filter: blur(10px);
          transform: scale(0.98);
        }
        to {
          opacity: 1;
          filter: blur(0px);
          transform: scale(1);
        }
      }

      .hero h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        line-height: 1.1;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        animation: none !important;
      }

      .hero p {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        line-height: 1.3;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        animation: none !important;
      }

      .hero button {
        padding: 1rem 2rem;
        font-size: 1.1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        animation: none !important;
      }

      .hero button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }

      /* Полностью скрываем элементы управления видео */
      .hero-video::-webkit-media-controls,
      .hero-video::-webkit-media-controls-panel,
      .hero-video::-webkit-media-controls-play-button,
      .hero-video::-webkit-media-controls-start-playback-button,
      .hero-video::-webkit-media-controls-timeline,
      .hero-video::-webkit-media-controls-current-time-display,
      .hero-video::-webkit-media-controls-time-remaining-display,
      .hero-video::-webkit-media-controls-mute-button,
      .hero-video::-webkit-media-controls-volume-slider,
      .hero-video::-webkit-media-controls-fullscreen-button,
      .hero-video::-webkit-media-controls-enclosure,
      .hero-video::-webkit-media-controls-overlay-play-button,
      .hero-video::-webkit-media-controls-rewind-button,
      .hero-video::-webkit-media-controls-return-to-realtime-button,
      .hero-video::-webkit-media-controls-seek-back-button,
      .hero-video::-webkit-media-controls-seek-forward-button,
      .hero-video::-webkit-media-controls-picture-in-picture-button,
      .hero-video::-moz-media-controls,
      .hero-video::-ms-media-controls {
        display: none !important;
      }

      /* Дополнительные правила для полного скрытия */
      .hero-video {
        pointer-events: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .hero-video::-webkit-media-controls-overlay {
        display: none !important;
      }

      /* Предотвращаем появление элементов управления при скроллинге */
      .hero-video:focus {
        outline: none !important;
      }
      
      .hero-video:active {
        pointer-events: none !important;
      }
      
      /* Скрываем все возможные элементы управления */
      .hero-video * {
        pointer-events: none !important;
      }

      .section {
        padding: 6rem 1rem;
        width: 100%;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        background-color: var(--section-background-color, transparent);
        z-index: 1;
        animation: fadeInUp 0.8s ease-out forwards;
        animation-delay: 1.2s;
        opacity: 0;
        animation-fill-mode: forwards;
      }

      .section[data-show-background="false"] {
        background-color: transparent !important;
        background-image: none !important;
      }

      .section[data-show-background="false"] .section-background-blur,
      .section[data-show-background="false"] .section-overlay {
        display: none !important;
      }

      .section-background-blur {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
        background-position: center;
        z-index: 0;
        animation: zoomIn 20s ease-in-out infinite alternate;
      }

      .section-container {
        position: relative;
        z-index: 2;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .section-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .section-header h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        position: relative;
      }

      .section-header h2::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 3px;
        background-color: #1976d2;
        transition: width 0.3s ease-in-out;
      }

      .section-header h2:hover::after {
        width: 100px;
      }

      .section-header p {
        font-size: 1.2rem;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
      }

      .about-section {
        display: flex;
        align-items: flex-start;
        gap: 2rem;
        padding: 2rem;
        position: relative;
        border-radius: 16px;
        background: linear-gradient(145deg, #ffffff, #f5f5f5);
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }

      .about-section::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 16px;
        padding: 2px;
        background: linear-gradient(45deg, #1976d2, #42a5f5);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
      }

      .about-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-left: 1rem;
        text-align: left;
        position: relative;
      }

      .about-content::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(to bottom, #1976d2, #42a5f5);
        border-radius: 2px;
      }

      .about-content h2 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-align: left;
        position: relative;
      }

      .about-content h2::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 60px;
        height: 4px;
        background: linear-gradient(to right, #1976d2, #42a5f5);
        border-radius: 2px;
      }

      .about-content p {
        font-size: 1.1rem;
        line-height: 1.6;
        text-align: left;
      }

      .section-image {
        width: 100%;
        margin: 2rem auto;
        text-align: center;
        max-width: 800px;
      }

      .section-image img {
        width: 100%;
        height: auto;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: transform 0.3s ease;
      }

      .section-image img:hover {
        transform: scale(1.02);
      }

      @media (max-width: 768px) {
        .about-section {
          flex-direction: column;
        }
        
        .about-content {
          padding-left: 0;
          padding-top: 1rem;
        }
      }

      .section h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        text-align: center;
        position: relative;
      }

      .section h2::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 3px;
        background-color: #1976d2;
        transition: width 0.3s ease-in-out;
      }

      .section h2:hover::after {
        width: 100px;
      }

      .section p {
        font-size: 1.1rem;
        margin-bottom: 3rem;
        text-align: center;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }

      /* Container for cards */
      .cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        padding: 1rem;
        position: relative;
        z-index: 2;
        pointer-events: auto;
      }

      @media (max-width: 1024px) {
        .cards-container {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .cards-container {
          grid-template-columns: 1fr;
        }
      }

      /* Basic card styles with animations */
      .card {
        transition: all 0.3s ease-in-out;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        width: 100%;
        max-width: 280px;
        border-radius: 12px;
        overflow: hidden;
        height: 100%;
        margin: 1rem;
        position: relative;
        z-index: 2;
      }

      /* Card headings and text */
      .card-title {
        color: #1a237e;
        margin-bottom: 0.7rem;
        font-size: 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease-in-out;
      }

      .card-text {
        color: #455a64;
        font-size: 1rem;
        line-height: 1.6;
        transition: all 0.3s ease-in-out;
      }

      /* Simple Card */
      .card.simple {
        background-color: transparent;
        border: 3px solid #e0e0e0;
      }

      .card.simple:hover {
        transform: scale(1.2);
        z-index: 3;
      }

      /* Elevated Card */
      .card.elevated {
        background-color: #ffffff;
        border: 3px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .card.elevated:hover {
        transform: rotate(3deg) scale(1.05);
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        z-index: 3;
      }

      .card.elevated:hover .card-title {
        color: #1976d2;
        transform: translateX(4px);
      }

      /* Outlined Card */
      .card.outlined {
        background: linear-gradient(to right, #e8f5e9, #c8e6c9);
        border: 3px solid #e0e0e0;
      }

      .card.outlined:hover {
        transform: skew(-5deg) translateY(-5px);
        border-color: #1976d2;
        z-index: 3;
      }

      .card.outlined:hover .card-title {
        color: #1976d2;
      }

      /* Accent Card */
      .card.accent {
        background-color: #ffffff;
        border: 3px solid #e0e0e0;
        position: relative;
      }

      .card.accent::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(to bottom, #1976d2, #42a5f5);
        transition: width 0.3s ease-in-out;
        z-index: 1;
      }

      .card.accent:hover {
        transform: translateX(10px) translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3;
      }

      .card.accent:hover::before {
        width: 6px;
      }

      .card.accent:hover .card-title {
        color: #1976d2;
      }

      /* Gradient Card */
      .card.gradient {
        background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
        border: 3px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.3s ease-in-out;
        position: relative;
        z-index: 2;
      }

      .card.gradient:hover {
        transform: scale(1.2);
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        z-index: 3;
      }

      .card.gradient:hover h3 {
        color: #1976d2;
      }

      .card.gradient:hover p {
        color: #455a64;
      }

      /* Container for sections */
      .section-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }

      /* Section heading */
      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      .section-header h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        position: relative;
        display: inline-block;
      }

      .section-header p {
        font-size: 1.2rem;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
      }

      @media (max-width: 768px) {
        .contact-grid {
          grid-template-columns: 1fr !important;
          gap: 1.5rem !important;
        }
      }

      .section-image img:hover {
        transform: scale(1.02);
      }

      .image-upload-control {
        margin-top: 1rem;
        display: flex;
        justify-content: flex-start;
      }



      @keyframes fadeInSection {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .upload-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .upload-button:hover {
        background-color: #1565c0;
      }

      .upload-button i {
        font-size: 1.2rem;
      }

      @media (max-width: 768px) {
        .nav-container {
          padding: 0 0.5rem;
        }

        .logo {
          font-size: 1rem;
        }

        .nav-menu a {
          font-size: 0.9rem;
        }
      }

      .cards-container.cards-2 {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
      }
      .cards-container.cards-3 {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
      }
      
      @media (max-width: 1024px) {
        .cards-container.cards-2,
        .cards-container.cards-3 {
          grid-template-columns: 1fr;
        }
      }
      
      .cards-container.cards-2 .card,
      .cards-container.cards-3 .card {
        max-width: 100%;
        width: 100%;
      }

      .card, .section-image img, .about-image img {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1);
      }
      .card.animate-on-scroll, .section-image img.animate-on-scroll, .about-image img.animate-on-scroll {
        opacity: 1;
        transform: translateY(0);
      }

      .about-section::before, .about-content::before {
        display: none !important;
      }

      @media (max-width: 1024px) {
        .no-card-section {
          flex-direction: column;
          align-items: center;
        }
        
        .no-card-section .about-image {
          min-width: 100%;
          max-width: 500px;
          margin: 0 auto 2rem auto;
          order: -1;
        }
        
        .no-card-section .about-content {
          width: 100%;
          text-align: center;
        }
        
        .no-card-section .about-content h2,
        .no-card-section .about-content p,
        .no-card-section .about-content div {
          text-align: center !important;
        }
        
        .no-card-section .about-content div br {
          display: none;
        }
        
        .no-card-section .about-content div strong {
          display: block;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
      }

      /* Styles for text in sections */
      .section h2 {
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.01562em;
        text-transform: none;
        margin-bottom: 1.5rem;
        text-align: center;
        color: inherit;
        word-wrap: break-word;
      }

      .section p {
        font-size: 1.25rem;
        font-weight: 400;
        line-height: 1.5;
        letter-spacing: 0.00938em;
        text-align: center;
        margin-bottom: 2rem;
        color: inherit;
        max-width: 100%;
        word-wrap: break-word;
      }

      @media (max-width: 600px) {
        .section h2 {
          font-size: 2rem;
        }
        .section p {
          font-size: 1rem;
        }
      }

      @media (max-width: 960px) {
        .section h2 {
          font-size: 2.25rem;
        }
        .section p {
          font-size: 1.1rem;
        }
      }
    `;
  };

  const generateJS = () => {
    return `
      document.addEventListener('DOMContentLoaded', function() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
          menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
          });

          // Close menu when clicking a link
          const navLinks = navMenu.querySelectorAll('a');
          navLinks.forEach(link => {
            link.addEventListener('click', () => {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            });
          });

          // Close menu when clicking outside
          document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            }
          });
        }

        // Smooth scroll to anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });

        // Form submission handler
        window.handleSubmit = function(event) {
          event.preventDefault();
          const form = document.getElementById('contactForm');
          const formData = new FormData(form);
          
          // Send form data
          fetch('https://formspree.io/f/mqalqbeo', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          }).finally(() => {
            // Always redirect to merci.html
            window.location.href = 'merci.html';
          });
        };

        // Cards and images scroll animation
        const animatedEls = document.querySelectorAll('.card, .section-image img, .about-image img');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-on-scroll');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        animatedEls.forEach(el => observer.observe(el));
        
        // Initialize automatic image slideshows
        initImageGalleries();
        
        // Auto-detect and display current domain
        autoDisplayDomain();
        
        // Also call with delay for reliability
        setTimeout(autoDisplayDomain, 100);
      });
      
      // Function to initialize all image galleries on the page
      function initImageGalleries() {
        const galleries = document.querySelectorAll('.section-gallery');
        
        galleries.forEach(gallery => {
          const images = gallery.querySelectorAll('.gallery-img');
          const dots = gallery.querySelectorAll('.gallery-dot');
          let currentIndex = 0;
          let interval = null;
          
          // If there are less than 2 images, do nothing
          if (images.length < 2) return;
          
          // Function to switch slides
          function showSlide(index) {
                          // Hide all images
            images.forEach(img => img.style.display = 'none');
            
                          // Reset active dots
            dots.forEach(dot => dot.style.backgroundColor = 'rgba(255,255,255,0.5)');
            
                          // Show selected image
            if (images[index]) {
              images[index].style.display = 'block';
            }
            
                          // Update active dot
            if (dots[index]) {
              dots[index].style.backgroundColor = '#ffffff';
            }
            
            currentIndex = index;
          }
          
          // Set handlers for navigation dots
          dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
              clearInterval(interval); // Stop auto-scroll on manual switch
              showSlide(index);
                              startAutoScroll(); // Restart auto-scroll
            });
          });
          
          // Function to start auto-scroll
          function startAutoScroll() {
                          // Clear previous interval if it exists
            if (interval) {
              clearInterval(interval);
            }
            
                          // Set new interval
            interval = setInterval(() => {
              const nextIndex = (currentIndex + 1) % images.length;
              showSlide(nextIndex);
            }, 3000); // 3 seconds interval between slides
          }
          
          // Add handlers to stop auto-scroll on hover
          gallery.addEventListener('mouseenter', () => {
            clearInterval(interval);
          });
          
          gallery.addEventListener('mouseleave', () => {
            startAutoScroll();
          });
          
          // Start auto-scroll on load
          startAutoScroll();
          
          // Add swipe on mobile devices
          let touchStartX = 0;
          let touchEndX = 0;
          
          gallery.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
          }, false);
          
          gallery.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
          }, false);
          
          function handleSwipe() {
            if (touchEndX < touchStartX) {
              // Swipe left - next slide
              clearInterval(interval);
              showSlide((currentIndex + 1) % images.length);
              startAutoScroll();
            } else if (touchEndX > touchStartX) {
              // Swipe right - previous slide
              clearInterval(interval);
              showSlide((currentIndex - 1 + images.length) % images.length);
              startAutoScroll();
            }
          }
        });
      }
      
      // Function to automatically detect and display current domain
      function autoDisplayDomain() {
        // Get current domain from browser
        const currentDomain = window.location.hostname;
        console.log('Current domain detected:', currentDomain);
        
        // Skip if localhost or IP address
        if (currentDomain === 'localhost' || 
            currentDomain === '127.0.0.1' || 
            currentDomain.includes('192.168.') ||
            currentDomain.includes('10.0.') ||
            /^\d+\.\d+\.\d+\.\d+$/.test(currentDomain)) {
          console.log('Skipping domain display for localhost/IP');
          return;
        }
        
        console.log('Auto-displaying domain:', currentDomain);
        
        // Find domain display element in header
        const domainElement = document.querySelector('.domain, .site-domain');
        
        if (domainElement) {
          // Update existing domain element
          domainElement.textContent = currentDomain;
          domainElement.style.display = 'block';
          console.log('Updated header domain element');
        } else {
          // Create new domain element if it doesn't exist
          const sitebranding = document.querySelector('.site-branding');
          if (sitebranding) {
            const domainDiv = document.createElement('div');
            domainDiv.className = 'domain';
            domainDiv.textContent = currentDomain;
            domainDiv.style.cssText = 'color: inherit; opacity: 0.8; font-size: 0.9rem; margin-top: 4px;';
            sitebranding.appendChild(domainDiv);
            console.log('Created new header domain element');
          }
        }
        
        // Update contact domain elements
        const allContactDomainElements = document.querySelectorAll('.contact-domain');
        console.log('Found contact domain elements:', allContactDomainElements.length);
        
        allContactDomainElements.forEach((domainElement, index) => {
          const oldText = domainElement.textContent;
          domainElement.textContent = currentDomain;
          domainElement.style.display = 'block'; // Show the element like in header
          console.log('Updated contact domain element', index + 1, 'from:', oldText, 'to:', currentDomain);
        });
        
        // Update footer domain elements
        const allFooterDomainElements = document.querySelectorAll('.footer-domain');
        console.log('Found footer domain elements:', allFooterDomainElements.length);
        
        allFooterDomainElements.forEach((domainElement, index) => {
          const oldText = domainElement.textContent;
          domainElement.textContent = currentDomain;
          domainElement.style.display = 'block'; // Show the element like in header
          console.log('Updated footer domain element', index + 1, 'from:', oldText, 'to:', currentDomain);
        });
        
        // Update any other domain references on the page
        const domainPlaceholders = document.querySelectorAll('[data-auto-domain]');
        domainPlaceholders.forEach(element => {
          element.textContent = currentDomain;
        });
        
        // Update contact email if it contains placeholder domain
        const emailElements = document.querySelectorAll('a[href*="@"], [data-email]');
        emailElements.forEach(element => {
          const href = element.getAttribute('href') || '';
          const text = element.textContent || '';
          
          if (href.includes('@example.com') || text.includes('@example.com')) {
            const newHref = href.replace('@example.com', \`@\${currentDomain}\`);
            const newText = text.replace('@example.com', \`@\${currentDomain}\`);
            
            if (href !== newHref) element.setAttribute('href', newHref);
            if (text !== newText) element.textContent = newText;
          }
        });
      }
      
      // Мгновенное появление hero секции
      document.addEventListener('DOMContentLoaded', function() {
        const hero = document.querySelector('.hero');
        if (hero) {
          hero.style.opacity = '1';
          
          // Принудительно убираем рамки с hero секции
          hero.style.border = 'none';
          hero.style.outline = 'none';
          hero.style.boxShadow = 'none';
          
          // Убираем рамки со всех дочерних элементов
          const allElements = hero.querySelectorAll('*');
          allElements.forEach(element => {
            if (element.style) {
              element.style.border = 'none';
              element.style.outline = 'none';
              element.style.boxShadow = 'none';
            }
          });
        }
      });

      // Мгновенное появление контента
      document.addEventListener('DOMContentLoaded', function() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
          heroContent.style.opacity = '1';
        }
      });

      // Быстрое появление секций
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
          const sections = document.querySelectorAll('.section');
          sections.forEach((section, index) => {
            setTimeout(() => {
              section.style.opacity = '1';
            }, index * 50);
          });
        }, 100);
      });

      // Force hide video controls and remove borders on scroll
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const heroVideo = document.getElementById('heroVideo');
          if (heroVideo) {
            // Принудительно скрываем все элементы управления
            const controls = heroVideo.querySelectorAll('*');
            controls.forEach(control => {
              if (control.style) {
                control.style.pointerEvents = 'none';
                control.style.userSelect = 'none';
              }
            });
          }
          
          // Постоянно убираем рамки с hero секции
          const hero = document.querySelector('.hero');
          if (hero) {
            hero.style.border = 'none';
            hero.style.outline = 'none';
            hero.style.boxShadow = 'none';
            
            const allElements = hero.querySelectorAll('*');
            allElements.forEach(element => {
              if (element.style) {
                element.style.border = 'none';
                element.style.outline = 'none';
                element.style.boxShadow = 'none';
              }
            });
          }
        }, 100);
      });

      // Initialize video and GIF preloading
      initializeVideoPreloading();
      
      function initializeVideoPreloading() {
        const heroVideo = document.getElementById('heroVideo');
        const heroGif = document.getElementById('heroGif');
        const videoLoadingOverlay = document.getElementById('videoLoadingOverlay');
        const gifLoadingOverlay = document.getElementById('gifLoadingOverlay');
        
        // Initialize video preloading
        if (heroVideo && videoLoadingOverlay) {
          videoLoadingOverlay.classList.remove('hidden');
          heroVideo.classList.add('loading');
          
          heroVideo.addEventListener('canplay', function() {
            heroVideo.classList.remove('loading');
            heroVideo.classList.add('loaded');
            setTimeout(() => {
              videoLoadingOverlay.classList.add('hidden');
            }, 500);
          });
          
          heroVideo.addEventListener('error', function() {
            videoLoadingOverlay.classList.add('hidden');
            heroVideo.classList.remove('loading');
          });
          
          // Force video to start loading
          heroVideo.load();
        }
        
        // Initialize GIF preloading
        if (heroGif && gifLoadingOverlay) {
          gifLoadingOverlay.classList.remove('hidden');
          heroGif.classList.add('loading');
          
          heroGif.addEventListener('load', function() {
            heroGif.classList.remove('loading');
            heroGif.classList.add('loaded');
            setTimeout(() => {
              gifLoadingOverlay.classList.add('hidden');
            }, 500);
          });
          
          heroGif.addEventListener('error', function() {
            gifLoadingOverlay.classList.add('hidden');
            heroGif.classList.remove('loading');
          });
          
          // Force GIF to start loading
          heroGif.src = heroGif.src;
        }
      }
    `;
  };

  const generateSitemap = (siteData) => {
    const domain = siteData.headerData.domain || 'example.com';
    const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    const currentDate = new Date().toISOString().replace('Z', '+00:00');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/index.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/merci.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-of-service.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookie-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>`;
  };

  const generateSafeFileName = (siteData) => {
    let fileName = '';
    
    // Приоритет: домен, затем название сайта
    if (siteData.headerData.domain && siteData.headerData.domain.trim()) {
      fileName = siteData.headerData.domain.trim();
      // Убираем протокол если есть
      fileName = fileName.replace(/^https?:\/\//, '');
      // Убираем www. если есть
      fileName = fileName.replace(/^www\./, '');
    } else if (siteData.headerData.siteName && siteData.headerData.siteName.trim()) {
      fileName = siteData.headerData.siteName.trim();
    } else {
      fileName = 'site';
    }
    
    // Заменяем недопустимые символы для имени файла
    fileName = fileName
      .replace(/[<>:"/\\|?*]/g, '') // Убираем недопустимые символы Windows
      .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
      .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\-\.]/g, '') // Оставляем только буквы (включая кириллицу), цифры, дефисы и точки
      .replace(/--+/g, '-') // Убираем множественные дефисы
      .replace(/^-+|-+$/g, ''); // Убираем дефисы в начале и конце
    
    return fileName || 'site';
  };

  const generateSitemapPHP = (siteData) => {
    const domain = siteData.headerData.domain || 'example.com';
    const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    const currentDate = new Date().toISOString().replace('Z', '+00:00');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/index.php</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/merci.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-of-service.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookie-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>`;
  };

  const handleDownloadSite = async () => {
    try {
      const zip = new JSZip();
      
      // Create main folders
      const assetsFolder = zip.folder('assets');
      const cssFolder = assetsFolder.folder('css');
      const jsFolder = assetsFolder.folder('js');
      const imagesFolder = assetsFolder.folder('images');
      const videosFolder = assetsFolder.folder('videos');

      // Add merci.html to root with language settings
      const merciResponse = await fetch('/merci.html');
      let merciContent = await merciResponse.text();
      
      // Apply language settings from configuration
      const language = headerData?.language || 'ru';
      merciContent = merciContent.replace(
        /<html[^>]*>/,
        `<html lang="${language}">`
      );
      
      // Replace default values with values from edit fields
      const thankYouMessage = contactData?.thankYouMessage || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.';
      const closeButtonText = contactData?.closeButtonText || 'Закрыть';
      
      merciContent = merciContent.replace(
        'const message = urlParams.get(\'message\') || \'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.\';',
        `const message = urlParams.get('message') || '${thankYouMessage.replace(/'/g, "\\'")}';`
      );
      
      merciContent = merciContent.replace(
        'const closeButtonText = urlParams.get(\'closeButtonText\') || \'Закрыть\';',
        `const closeButtonText = urlParams.get('closeButtonText') || '${closeButtonText.replace(/'/g, "\\'")}';`
      );
      
      zip.file('merci.html', merciContent);

      // Convert sections from object to array if needed
      const sectionsArray = Object.entries(sectionsData).map(([id, section]) => ({
        ...section,
        id: id,
        title: section.title || '',
        description: section.description || '',
        titleColor: section.titleColor || '#000000',
        descriptionColor: section.descriptionColor || '#666666',
        cards: section.cards || []
      }));

      // Prepare data for HTML generation
      const siteData = {
        headerData: {
          ...headerData,
          siteName: headerData.siteName || 'My Site',
          title: headerData.title || headerData.siteName || 'My Site',
          domain: headerData.domain || '',
          description: headerData.description || 'Our site offers the best solutions',
          menuItems: headerData.menuItems || [],
          siteBackgroundImage: headerData.siteBackgroundType === 'image' ? 'assets/images/fon.jpg' : '',
          language: headerData.language || 'ru',
          runningLine: {
            ...headerData.runningLine,
            enabled: headerData.runningLine?.enabled || false,
            text: headerData.runningLine?.text || '',
            speed: headerData.runningLine?.speed || 25,
            backgroundColor: headerData.runningLine?.backgroundColor || '#1976d2',
            textColor: headerData.runningLine?.textColor || '#ffffff',
            fontSize: headerData.runningLine?.fontSize || '20px',
            fontWeight: headerData.runningLine?.fontWeight || 'bold',
            fontFamily: headerData.runningLine?.fontFamily || 'system-ui, -apple-system, sans-serif',
            textStyle: headerData.runningLine?.textStyle || 'normal',
            lineHeight: headerData.runningLine?.lineHeight || '1.2',
            padding: headerData.runningLine?.padding || '4'
          }
        },
        heroData: {
          ...heroData,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          buttonText: heroData.buttonText || '',
          backgroundImage: heroData.backgroundImage ? 'assets/images/' + heroData.backgroundImage.split('/').pop() : '',
          backgroundGif: heroData.backgroundGif ? 'assets/images/' + heroData.backgroundGif.split('/').pop() : ''
        },
        sectionsData: sectionsArray,
        contactData: {
          ...contactData,
          title: contactData.title || 'Contact',
          description: contactData.description || ''
        },
        footerData: {
          ...footerData,
          title: footerData.title || 'About Us',
          description: footerData.description || '',
          contacts: footerData.contacts || '',
          copyright: footerData.copyright || '© 2024 All rights reserved',
          backgroundColor: footerData.backgroundColor || '#333',
          textColor: footerData.textColor || '#fff'
        },
        legalDocuments: {
          privacyPolicy: {
            title: legalDocuments?.privacyPolicy?.title || '',
            content: (legalDocuments?.privacyPolicy?.content || '').toString()
          },
          termsOfService: {
            title: legalDocuments?.termsOfService?.title || '',
            content: (legalDocuments?.termsOfService?.content || '').toString()
          },
          cookiePolicy: {
            title: legalDocuments?.cookiePolicy?.title || '',
            content: (legalDocuments?.cookiePolicy?.content || '').toString()
          }
        },
        liveChatData: {
          ...liveChatData,
          enabled: liveChatData.enabled || false,
          apiKey: liveChatData.apiKey || '',
          selectedResponses: liveChatData.selectedResponses || '',
          allTranslations: liveChatData.allTranslations || ''
        }
      };

      console.log('🚀 handleDownloadSite - siteData:', siteData);
      console.log('🚀 handleDownloadSite - siteData.liveChatData:', siteData.liveChatData);

      // Process and add chat operator photo if live chat is enabled
      if (siteData.liveChatData?.enabled) {
        let photoProcessed = false;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (!photoProcessed && retryCount < maxRetries) {
          try {
            console.log(`🎭 Processing chat operator photo... (attempt ${retryCount + 1}/${maxRetries})`);
            const response = await fetch('/api/process-chat-photo', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            
            if (response.ok) {
              const photoBlob = await response.blob();
              const originalFile = response.headers.get('X-Original-File');
              const photoSize = response.headers.get('X-Photo-Size');
              
              if (photoBlob && photoBlob.size > 0) {
                imagesFolder.file('operator.jpg', photoBlob);
                console.log(`✅ Chat operator photo added to export: ${originalFile} (${photoSize} bytes)`);
                photoProcessed = true;
              } else {
                console.warn(`⚠️ Photo blob is empty or invalid (attempt ${retryCount + 1})`);
                retryCount++;
                if (retryCount < maxRetries) {
                  console.log('🔄 Retrying in 1 second...');
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }
            } else {
              console.warn(`⚠️ Could not process chat operator photo (attempt ${retryCount + 1}):`, response.status);
              retryCount++;
              if (retryCount < maxRetries) {
                console.log('🔄 Retrying in 1 second...');
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          } catch (error) {
            console.error(`❌ Error processing chat operator photo (attempt ${retryCount + 1}):`, error);
            retryCount++;
            if (retryCount < maxRetries) {
              console.log('🔄 Retrying in 1 second...');
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        if (!photoProcessed) {
          console.error('❌ Failed to process chat operator photo after all retries');
          // Photo processing failed - logged to console
        }

        // Add chat open sound
        try {
          console.log('🔊 Adding chat open sound...');
          
          // Try to fetch the sound file from different sources
          const possiblePaths = [
            '/api/get-sound-file',  // API endpoint (приоритет)
            '/1.mp3', 
            './1.mp3', 
            './public/1.mp3', 
            '/public/1.mp3'
          ];
          let soundResponse = null;
          let successPath = null;
          
          for (const path of possiblePaths) {
            try {
              console.log('🔄 Trying sound path:', path);
              soundResponse = await fetch(path);
              console.log('📡 Sound response for', path, ':', soundResponse.status, soundResponse.statusText);
              
              if (soundResponse.ok) {
                successPath = path;
                console.log('✅ Found sound file at:', successPath);
                
                // Дополнительная информация для API endpoint
                if (path === '/api/get-sound-file') {
                  const fileSize = soundResponse.headers.get('X-File-Size');
                  console.log('📊 API endpoint info - Size:', fileSize, 'bytes');
                }
                
                break;
              }
            } catch (error) {
              console.log('❌ Error fetching sound from', path, ':', error.message);
            }
          }
          
          if (soundResponse && soundResponse.ok) {
            console.log('✅ Successfully fetched sound file');
            const soundBlob = await soundResponse.blob();
            console.log('📦 Sound blob size:', soundBlob.size, 'bytes');
            const soundBuffer = await soundBlob.arrayBuffer();
            console.log('🔄 Converting to ArrayBuffer, size:', soundBuffer.byteLength, 'bytes');
            
            // Add only OGG format
            assetsFolder.file('chat-open.ogg', soundBuffer);
            
            console.log('✅ Chat open sound added to export as OGG format');
            console.log(`📊 Final sound file size: ${soundBuffer.byteLength} bytes`);
            console.log('📁 File added to assets/: chat-open.ogg');
          } else {
            console.warn('⚠️ Could not load chat sound file from any path');
            console.warn('📝 Tried paths:', possiblePaths);
            console.warn('🔧 Creating instruction file instead');
            
            // Sound file not found - logged to console
          }
        } catch (error) {
          console.error('❌ Error processing chat sound:', error);
          // Sound processing error - logged to console
        }
      }

      // Add HTML file
      const htmlContent = generateHTML(siteData);
      zip.file('index.html', htmlContent);

      // Add CSS file
      const cssContent = generateCSS(siteData);
      cssFolder.file('styles.css', cssContent);
      
      // Add JS file
      const jsContent = generateJS();
      jsFolder.file('script.js', jsContent);

      // Add legal documents
      const legalDocs = [
        {
          id: 'privacy-policy',
          title: siteData.legalDocuments.privacyPolicy.title,
          content: siteData.legalDocuments.privacyPolicy.content
        },
        {
          id: 'terms-of-service',
          title: siteData.legalDocuments.termsOfService.title,
          content: siteData.legalDocuments.termsOfService.content
        },
        {
          id: 'cookie-policy',
          title: siteData.legalDocuments.cookiePolicy.title,
          content: siteData.legalDocuments.cookiePolicy.content
        }
      ];

      legalDocs.forEach(doc => {
        // Обработка контента: первая строка будет отцентрирована и выделена
        const contentLines = doc.content.split('\n');
        const firstLine = contentLines[0] ? `<h1>${contentLines[0]}</h1>` : '';
        const remainingContent = contentLines.slice(1).join('\n');
        
        // Улучшенная обработка текста для выделения заголовков разделов и форматирования
        let processedContent = firstLine;
        
        // Шаблоны для определения заголовков разделов
        const sectionHeaderPattern = /^\d+\.\s+(.+)/;  // Для формата: "1. Раздел"
        const sectionHeaderPattern2 = /^([IVX]+)\.\s+(.+)/; // Для римских цифр: "I. Раздел"
        const sectionHeaderPattern3 = /^([А-ЯA-Z][\wа-яА-Я\s]{2,}):$/; // Для ЗАГОЛОВКОВ ПРОПИСНЫМИ
        
        // Разбиваем текст на абзацы
        const paragraphs = remainingContent.split('\n');
        
        // Обрабатываем каждый абзац
        paragraphs.forEach(paragraph => {
          paragraph = paragraph.trim();
          
          if (!paragraph) {
            // Пустые строки превращаем в разделители
            processedContent += '<br>';
            return;
          }
          
          // Проверяем, является ли строка заголовком раздела
          const match1 = paragraph.match(sectionHeaderPattern);
          const match2 = paragraph.match(sectionHeaderPattern2);
          const match3 = paragraph.match(sectionHeaderPattern3);
          
          if (match1) {
            // Формат "1. Заголовок"
            processedContent += `<h2>${paragraph}</h2>`;
          } else if (match2) {
            // Формат "I. Заголовок"
            processedContent += `<h2>${paragraph}</h2>`;
          } else if (match3) {
            // Формат "ЗАГОЛОВОК:"
            processedContent += `<h2>${paragraph}</h2>`;
          } else if (/^\d+\.\d+\./.test(paragraph)) {
            // Подразделы вида "1.1. Подраздел"
            processedContent += `<h3>${paragraph}</h3>`;
          } else if (paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
            // Маркированные списки
            if (!processedContent.endsWith('</ul>') && !processedContent.endsWith('<ul>')) {
              processedContent += '<ul>';
            }
            processedContent += `<li>${paragraph.substring(1).trim()}</li>`;
            
            // Проверяем, нужно ли закрыть список
            if (paragraphs.indexOf(paragraph) === paragraphs.length - 1 || 
                !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('•') &&
                !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('-') &&
                !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('*')) {
              processedContent += '</ul>';
            }
          } else {
            // Обычные параграфы
            if (paragraph.length > 0) {
              // Выделяем важные термины жирным
              paragraph = paragraph
                .replace(/«([^»]+)»/g, '«<strong>$1</strong>»')
                .replace(/"([^"]+)"/g, '"<strong>$1</strong>"');
                
              processedContent += `<p>${paragraph}</p>`;
            }
          }
        });
        
        // Дополнительная обработка для улучшения читабельности
        processedContent = processedContent
          .replace(/(\d+\.\d+\.\d+\.)/g, '<strong>$1</strong>') // Выделяем номера подразделов
          .replace(/([А-ЯA-Z]{2,})/g, '<strong>$1</strong>') // Выделяем слова ПРОПИСНЫМИ
          .replace(/(ФЗ [№"]\d+[^<]*?[»"])/g, '<strong>$1</strong>') // Выделяем упоминания законов
          .replace(/([0-9]+\s*(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s*[0-9]{4})/gi, '<em>$1</em>'); // Выделяем даты

        const htmlContent = `
<!DOCTYPE html>
<html lang="${siteData.headerData.language || 'ru'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title}</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.8;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            font-size: 18px;
            color: #333;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            color: #333;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }
        h2 {
            color: #333;
            font-size: 26px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h3 {
            color: #444;
            font-size: 22px;
                  font-weight: 500;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .content {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
            text-align: left;
        }
        p {
            margin-bottom: 20px;
            text-align: left;
            font-size: 18px;
            line-height: 1.8;
        }
        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        li {
            margin-bottom: 10px;
            font-size: 18px;
        }
        strong {
            font-weight: 600;
        }
        .date {
            text-align: right;
            margin-top: 30px;
            color: #666;
            font-style: italic;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 40px;
            border-left: 4px solid #4285f4;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px;
                font-size: 16px;
            }
            .content {
                padding: 25px;
            }
            h1 {
                font-size: 28px;
            }
            h2 {
                font-size: 22px;
            }
            h3 {
                font-size: 18px;
            }
            p, li {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="content">
        ${processedContent}
        <div class="date">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
</body>
</html>`;

        zip.file(`${doc.id}.html`, htmlContent);
      });

      // Add robots.txt to the archive (unchanged from root directory)
      try {
        const robotsResponse = await fetch('/robots.txt');
        const robotsContent = await robotsResponse.text();
        zip.file('robots.txt', robotsContent);
        console.log('robots.txt successfully added to zip');
      } catch (error) {
        console.warn('Could not fetch robots.txt, using default content');
        zip.file('robots.txt', 'User-agent: *\nDisallow:');
      }

      // Add sitemap.xml to the archive (dynamically generated with domain from settings)
      try {
        const sitemapContent = generateSitemap(siteData);
        zip.file('sitemap.xml', sitemapContent);
        console.log('sitemap.xml successfully added to zip with domain:', siteData.headerData.domain);
      } catch (error) {
        console.error('Error generating sitemap.xml:', error);
      }

      // Add update-sitemap.php to site root
      try {
        const updateSitemapResponse = await fetch('/assets/js/update-sitemap.php');
        const updateSitemapContent = await updateSitemapResponse.text();
        zip.file('update-sitemap.php', updateSitemapContent);
        console.log('update-sitemap.php successfully added to site root');
      } catch (error) {
        console.warn('Could not fetch update-sitemap.php, using default content');
        // Fallback content if file is not found
        const defaultContent = `<?php
/**
 * Автоматическое обновление домена в sitemap.xml
 * Запустите этот скрипт один раз после размещения сайта на новом домене
 */

// Определяем текущий домен
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$currentDomain = $protocol . $_SERVER['HTTP_HOST'];

// Путь к файлу sitemap.xml
$sitemapFile = 'sitemap.xml';

// Проверяем, существует ли файл
if (!file_exists($sitemapFile)) {
    die("❌ Файл sitemap.xml не найден!");
}

// Читаем содержимое файла
$sitemapContent = file_get_contents($sitemapFile);

if ($sitemapContent === false) {
    die("❌ Не удалось прочитать файл sitemap.xml!");
}

// Заменяем все вхождения example.com на текущий домен
$updatedContent = str_replace('https://example.com', $currentDomain, $sitemapContent);
$updatedContent = str_replace('http://example.com', $currentDomain, $updatedContent);

// Обновляем дату последнего изменения на текущую
$currentDate = date('c');
$updatedContent = preg_replace(
    '/<lastmod>.*?<\\/lastmod>/',
    '<lastmod>' . $currentDate . '</lastmod>',
    $updatedContent
);

// Сохраняем обновленный файл
if (file_put_contents($sitemapFile, $updatedContent) !== false) {
    echo "✅ <strong>Успешно!</strong><br>";
    echo "📍 Домен обновлен на: <strong>" . htmlspecialchars($currentDomain) . "</strong><br>";
    echo "📅 Дата обновления: " . date('d.m.Y H:i:s') . "<br><br>";
    echo "🎯 <strong>Что дальше:</strong><br>";
    echo "1. Удалите этот файл (update-sitemap.php) с сервера<br>";
    echo "2. Загрузите обновленный sitemap.xml в Google Search Console<br>";
    echo "3. Проверьте работоспособность всех страниц<br>";
} else {
    echo "❌ Ошибка при сохранении файла sitemap.xml!";
}
?>`;
        zip.file('update-sitemap.php', defaultContent);
      }

      // Get hero image from cache only if background type is image
      if (heroData.backgroundImage && heroData.backgroundType === 'image') {
        try {
          const imageMetadata = JSON.parse(localStorage.getItem('heroImageMetadata') || '{}');
          if (imageMetadata.filename) {
            const blob = await imageCacheService.getImage(imageMetadata.filename);
            if (blob) {
              imagesFolder.file(imageMetadata.filename, blob);
              console.log('✅ Hero image successfully added to zip from cache');
            } else {
              console.warn('⚠️ Hero image not found in cache');
            }
          }
        } catch (error) {
          console.error('❌ Error getting hero image from cache:', error);
        }
      } else if (heroData.backgroundType === 'video') {
        // Skip hero image export for video
      } else if (heroData.backgroundType === 'gif') {
        // Skip hero image export for GIF
      }

      // Get about image from cache
      try {
        const aboutImageMetadata = JSON.parse(localStorage.getItem('aboutImageMetadata') || '{}');
        // Также проверим наличие метаданных для About.jpg с большой буквы (возможно осталось от предыдущей версии)
        const aboutImageMetadataOld = JSON.parse(localStorage.getItem('AboutImageMetadata') || '{}');
        
        // Пробуем сначала найти изображение с маленькой буквы
        if (aboutImageMetadata.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadata.filename);
          if (blob) {
            // Всегда сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image successfully added to zip from cache');
          } else {
            console.warn('About image (lowercase) not found in cache');
          }
        } 
        // Если не нашли с маленькой буквы, проверяем с большой буквы
        else if (aboutImageMetadataOld.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadataOld.filename);
          if (blob) {
            // Всё равно сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image (uppercase) converted to lowercase and added to zip');
          } else {
            console.warn('About image (uppercase) not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting hero image from cache:', error);
      }

      // Get section images from cache
      try {
        // Перебираем все пункты меню (секции)
        for (const item of headerData.menuItems) {
          const sectionId = item.id;
          const metadataKey = `section_${sectionId}_ImageMetadata`;
          console.log(`Проверка метаданных для секции ${sectionId}, ключ: ${metadataKey}`);
          
          try {
            const sectionImageMetadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
            console.log(`Метаданные для секции ${sectionId}:`, sectionImageMetadata);
            
            if (sectionImageMetadata.filename) {
              // Проверяем есть ли файл в кеше
              const blob = await imageCacheService.getImage(sectionImageMetadata.filename);
              
              if (blob) {
                console.log(`Изображение для секции ${sectionId} найдено в кеше:`, sectionImageMetadata.filename);
                imagesFolder.file(sectionImageMetadata.filename, blob);
                console.log(`Section ${sectionId} image successfully added to zip from cache`);
              } else {
                console.warn(`Изображение для секции ${sectionId} не найдено в кеше:`, sectionImageMetadata.filename);
                
                // Пытаемся загрузить изображение по URL
                if (sectionImageMetadata.originalPath) {
                  try {
                    const response = await fetch(sectionImageMetadata.originalPath);
                    if (response.ok) {
                      const blob = await response.blob();
                      imagesFolder.file(sectionImageMetadata.filename, blob);
                      console.log(`Section ${sectionId} image successfully fetched from URL and added to zip`);
                    }
                  } catch (fetchError) {
                    console.error(`Ошибка при загрузке изображения для секции ${sectionId}:`, fetchError);
                  }
                }
              }
            } else {
              console.warn(`Нет метаданных изображения для секции ${sectionId}:`);
            }
          } catch (parseError) {
            console.error(`Ошибка при разборе метаданных для секции ${sectionId}:`, parseError);
          }
        }
      } catch (error) {
        console.error('Error getting section images from cache:', error);
      }

      // Get advantages image from cache
      try {
        const advantagesImageMetadata = JSON.parse(localStorage.getItem('advantagesImageMetadata') || '{}');
        if (advantagesImageMetadata.filename) {
          const blob = await imageCacheService.getImage(advantagesImageMetadata.filename);
          if (blob) {
            imagesFolder.file(advantagesImageMetadata.filename, blob);
            console.log('Advantages image successfully added to zip from cache');
          } else {
            console.warn('Advantages image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting advantages image from cache:', error);
      }

      // Get site background image from cache
      try {
        const siteBackgroundMetadata = JSON.parse(localStorage.getItem('siteBackgroundMetadata') || '{}');
        if (siteBackgroundMetadata.filename) {
          const blob = await imageCacheService.getImage(siteBackgroundMetadata.filename);
          if (blob) {
            imagesFolder.file(siteBackgroundMetadata.filename, blob);
            console.log('Site background image successfully added to zip from cache');
          } else {
            console.warn('Site background image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting site background image from cache:', error);
      }

      // Add images from sections
      for (const section of sectionsArray) {
        // Обработка массива изображений
        if (Array.isArray(section.images) && section.images.length > 0) {
          for (const image of section.images) {
            try {
              let imageFilename = '';
              
              if (typeof image === 'string') {
                imageFilename = image.split('/').pop();
              } else if (image && (image.path || image.url)) {
                imageFilename = (image.path || image.url).split('/').pop();
              }
              
              if (!imageFilename) continue;
              
              // Пропускаем about.jpg и About.jpg, так как оно уже было добавлено ранее из aboutImageMetadata
              if (imageFilename.toLowerCase() === 'about.jpg') {
                console.log(`Skipping ${imageFilename} as it was already added`);
                continue;
              }
              
              const blob = await imageCacheService.getImage(imageFilename);
              if (blob) {
                imagesFolder.file(imageFilename, blob);
                console.log(`Section multi-image ${imageFilename} successfully added to zip from cache`);
              } else {
                console.warn(`Section multi-image ${imageFilename} not found in cache`);
              }
            } catch (error) {
              console.error(`Error getting section multi-image from cache:`, error);
            }
          }
        }
        
        // Обработка одиночных изображений
        if (section.backgroundImage || section.imagePath) {
          try {
            const imageFilename = (section.backgroundImage || section.imagePath).split('/').pop();
            // Пропускаем about.jpg и About.jpg, так как оно уже было добавлено ранее из aboutImageMetadata
            if (imageFilename.toLowerCase() === 'about.jpg') {
              console.log(`Skipping ${imageFilename} as it was already added`);
              continue;
            }
            const blob = await imageCacheService.getImage(imageFilename);
            if (blob) {
              imagesFolder.file(imageFilename, blob);
              console.log(`Section image ${imageFilename} successfully added to zip from cache`);
            } else {
              console.warn(`Section image ${imageFilename} not found in cache`);
            }
          } catch (error) {
            console.error(`Error getting section image from cache:`, error);
          }
        }
      }

      // Get favicon from cache
      try {
        const faviconMetadata = JSON.parse(localStorage.getItem('faviconMetadata') || '{}');
        if (faviconMetadata.filename) {
          const blob = await imageCacheService.getImage(faviconMetadata.filename);
          if (blob) {
            imagesFolder.file(faviconMetadata.filename, blob);
            console.log('Favicon successfully added to zip from cache');
          } else {
            console.warn('Favicon not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting favicon from cache:', error);
      }

      // Export videos from cache
      console.log('🎬 Starting video export from cache...');
      console.log('🔍 localStorage keys:', Object.keys(localStorage));
      console.log('🔍 heroVideoMetadata raw:', localStorage.getItem('heroVideoMetadata'));
      
      try {
        // Get hero video metadata
        const heroVideoMetadata = JSON.parse(localStorage.getItem('heroVideoMetadata') || '{}');
        console.log('🔍 Hero video metadata:', heroVideoMetadata);
        
        if (heroVideoMetadata.filename) {
          console.log('🔍 videoCacheService available:', typeof videoCacheService);
          console.log('🔍 videoCacheService methods:', Object.getOwnPropertyNames(videoCacheService));
          
          try {
            const videoFile = await videoCacheService.getVideo(heroVideoMetadata.filename);
            if (videoFile) {
              videosFolder.file(heroVideoMetadata.filename, videoFile);
              console.log(`✅ Hero video added to zip: ${heroVideoMetadata.filename} (${videoFile.size} bytes)`);
              console.log(`📁 Video added to: assets/videos/${heroVideoMetadata.filename}`);
              

              

            } else {
              console.warn('⚠️ Hero video not found in cache:', heroVideoMetadata.filename);
            }
          } catch (videoError) {
            console.error('❌ Error getting hero video from cache:', videoError);
          }
        } else {
          console.log('ℹ️ No hero video metadata found');
        }

        // Export all other videos from cache
        try {
          const allVideos = await videoCacheService.getAllVideos();
          console.log(`🔍 Found ${allVideos.length} videos in cache`);
          
          if (allVideos.length > 0) {
            console.log(`📹 Processing ${allVideos.length} videos...`);
            
            for (const video of allVideos) {
              try {
                const videoKey = video.key || video.name || 'unknown';
                const videoBlob = video.value || video.blob || video;
                
                if (videoBlob && videoBlob.size) {
                  // Skip hero video (already processed above)
                  if (videoKey === heroVideoMetadata.filename) {
                    console.log(`⏭️ Skipping hero video: ${videoKey}`);
                    continue;
                  }
                  
                  videosFolder.file(videoKey, videoBlob);
                  console.log(`✅ Additional video added: ${videoKey} (${videoBlob.size} bytes)`);
                  
                  // Also add to root assets for compatibility
                  assetsFolder.file(videoKey, videoBlob);
                  console.log(`✅ Additional video also added to assets root: ${videoKey}`);
                }
              } catch (videoError) {
                console.error(`❌ Error processing additional video ${video.key || 'unknown'}:`, videoError);
              }
            }
            
            // Videos exported successfully - no summary file needed
          } else {
            console.log('ℹ️ No additional videos found in cache');
          }
        } catch (error) {
          console.error('❌ Error processing additional videos:', error);
          // Error logged to console - no need for error file in export
        }
      } catch (error) {
        console.error('❌ Error during video export:', error);
        // Error logged to console - no need for error file in export
      }

      // Export GIF from cache
      try {
        // Get hero GIF metadata
        const heroGifMetadata = JSON.parse(localStorage.getItem('heroGifMetadata') || '{}');
        
        if (heroGifMetadata.filename && heroData.backgroundType === 'gif') {
          try {
            const gifFile = await imageCacheService.getImage(heroGifMetadata.filename);
            if (gifFile) {
              imagesFolder.file(heroGifMetadata.filename, gifFile);
            }
          } catch (gifError) {
            console.error('❌ Error getting hero GIF from cache:', gifError);
          }
        }
      } catch (error) {
        console.error('❌ Error during GIF export:', error);
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ 
        type: 'blob',
        mimeType: 'application/zip'
      });
      const fileName = generateSafeFileName(siteData);
      saveAs(content, `${fileName}.zip`);
    } catch (error) {
      console.error('Error during site download:', error);
      alert('Ошибка при скачивании сайта: ' + error.message);
    }
  };

  const handleDownloadPHP = async () => {
    try {
      const zip = new JSZip();
      
      // Create main folders
      const assetsFolder = zip.folder('assets');
      const cssFolder = assetsFolder.folder('css');
      const jsFolder = assetsFolder.folder('js');
      const imagesFolder = assetsFolder.folder('images');
      const videosFolder = assetsFolder.folder('videos');

      // Add merci.html to root with language settings
      const merciResponse = await fetch('/merci.html');
      let merciContent = await merciResponse.text();
      
      // Apply language settings from configuration
      const language = headerData?.language || 'ru';
      merciContent = merciContent.replace(
        /<html[^>]*>/,
        `<html lang="${language}">`
      );
      
      // Replace default values with values from edit fields
      const thankYouMessage = contactData?.thankYouMessage || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.';
      const closeButtonText = contactData?.closeButtonText || 'Закрыть';
      
      merciContent = merciContent.replace(
        'const message = urlParams.get(\'message\') || \'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.\';',
        `const message = urlParams.get('message') || '${thankYouMessage.replace(/'/g, "\\'")}';`
      );
      
      merciContent = merciContent.replace(
        'const closeButtonText = urlParams.get(\'closeButtonText\') || \'Закрыть\';',
        `const closeButtonText = urlParams.get('closeButtonText') || '${closeButtonText.replace(/'/g, "\\'")}';`
      );
      
      zip.file('merci.html', merciContent);

      // Convert sections from object to array if needed
      const sectionsArray = Object.entries(sectionsData).map(([id, section]) => ({
          ...section,
        id: id,
        title: section.title || '',
        description: section.description || '',
        titleColor: section.titleColor || '#000000',
        descriptionColor: section.descriptionColor || '#666666',
        cards: section.cards || []
      }));

      const siteData = {
        headerData: {
          ...headerData,
          siteName: headerData.siteName || 'Мой сайт',
          title: headerData.title || headerData.siteName || 'Мой сайт',
          description: headerData.description || 'Наш сайт предлагает лучшие решения',
          menuItems: headerData.menuItems || [],
          siteBackgroundImage: headerData.siteBackgroundType === 'image' ? 'assets/images/fon.jpg' : '',
          language: headerData.language || 'ru',
          runningLine: {
            ...headerData.runningLine,
            enabled: headerData.runningLine?.enabled || false,
            text: headerData.runningLine?.text || '',
            speed: headerData.runningLine?.speed || 25,
            backgroundColor: headerData.runningLine?.backgroundColor || '#1976d2',
            textColor: headerData.runningLine?.textColor || '#ffffff',
            fontSize: headerData.runningLine?.fontSize || '20px',
            fontWeight: headerData.runningLine?.fontWeight || 'bold',
            fontFamily: headerData.runningLine?.fontFamily || 'system-ui, -apple-system, sans-serif',
            textStyle: headerData.runningLine?.textStyle || 'normal',
            lineHeight: headerData.runningLine?.lineHeight || '1.2',
            padding: headerData.runningLine?.padding || '4'
          }
        },
        heroData: {
          ...heroData,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          buttonText: heroData.buttonText || '',
          backgroundImage: heroData.backgroundImage ? 'assets/images/' + heroData.backgroundImage.split('/').pop() : ''
        },
        sectionsData: sectionsArray,
        contactData: {
          ...contactData,
          title: contactData.title || 'Контакты',
          description: contactData.description || ''
        },
        footerData: {
          ...footerData,
          title: footerData.title || 'О нас',
          description: footerData.description || '',
          contacts: footerData.contacts || '',
          copyright: footerData.copyright || '© 2024 Все права защищены',
          backgroundColor: footerData.backgroundColor || '#333',
          textColor: footerData.textColor || '#fff'
        },
        legalDocuments: {
          privacyPolicy: {
            title: legalDocuments?.privacyPolicy?.title || '',
            content: (legalDocuments?.privacyPolicy?.content || '').toString()
          },
          termsOfService: {
            title: legalDocuments?.termsOfService?.title || '',
            content: (legalDocuments?.termsOfService?.content || '').toString()
          },
          cookiePolicy: {
            title: legalDocuments?.cookiePolicy?.title || '',
            content: (legalDocuments?.cookiePolicy?.content || '').toString()
          }
        },
        liveChatData: {
          ...liveChatData,
          enabled: liveChatData?.enabled || false,
          apiKey: liveChatData?.apiKey || '',
          selectedResponses: liveChatData?.selectedResponses || '',
          allTranslations: liveChatData?.allTranslations || ''
        }
      };

      console.log('Generating PHP site with data:', siteData);

      // Process and add chat operator photo if live chat is enabled
      if (siteData.liveChatData?.enabled) {
        let photoProcessed = false;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (!photoProcessed && retryCount < maxRetries) {
          try {
            console.log(`🎭 Processing chat operator photo for PHP... (attempt ${retryCount + 1}/${maxRetries})`);
            const response = await fetch('/api/process-chat-photo', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            
            if (response.ok) {
              const photoBlob = await response.blob();
              const originalFile = response.headers.get('X-Original-File');
              const photoSize = response.headers.get('X-Photo-Size');
              
              if (photoBlob && photoBlob.size > 0) {
                imagesFolder.file('operator.jpg', photoBlob);
                console.log(`✅ Chat operator photo added to PHP export: ${originalFile} (${photoSize} bytes)`);
                photoProcessed = true;
              } else {
                console.warn(`⚠️ Photo blob is empty or invalid for PHP (attempt ${retryCount + 1})`);
                retryCount++;
                if (retryCount < maxRetries) {
                  console.log('🔄 Retrying in 1 second...');
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }
            } else {
              console.warn(`⚠️ Could not process chat operator photo for PHP (attempt ${retryCount + 1}):`, response.status);
              retryCount++;
              if (retryCount < maxRetries) {
                console.log('🔄 Retrying in 1 second...');
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          } catch (error) {
            console.error(`❌ Error processing chat operator photo for PHP (attempt ${retryCount + 1}):`, error);
            retryCount++;
            if (retryCount < maxRetries) {
              console.log('🔄 Retrying in 1 second...');
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        if (!photoProcessed) {
          console.error('❌ Failed to process chat operator photo for PHP after all retries');
          // Photo processing failed for PHP - logged to console
        }

        // Add chat open sound for PHP
        try {
          console.log('🔊 Adding chat open sound for PHP...');
          
          // Try to fetch the sound file from different sources
          const possiblePaths = [
            '/api/get-sound-file',  // API endpoint (приоритет)
            '/1.mp3', 
            './1.mp3', 
            './public/1.mp3', 
            '/public/1.mp3'
          ];
          let soundResponse = null;
          let successPath = null;
          
          for (const path of possiblePaths) {
            try {
              console.log('🔄 Trying sound path for PHP:', path);
              soundResponse = await fetch(path);
              console.log('📡 Sound response for PHP', path, ':', soundResponse.status, soundResponse.statusText);
              
              if (soundResponse.ok) {
                successPath = path;
                console.log('✅ Found sound file for PHP at:', successPath);
                
                // Дополнительная информация для API endpoint
                if (path === '/api/get-sound-file') {
                  const fileSize = soundResponse.headers.get('X-File-Size');
                  console.log('📊 API endpoint info for PHP - Size:', fileSize, 'bytes');
                }
                
                break;
              }
            } catch (error) {
              console.log('❌ Error fetching sound for PHP from', path, ':', error.message);
            }
          }
          
          if (soundResponse && soundResponse.ok) {
            console.log('✅ Successfully fetched sound file for PHP');
            const soundBlob = await soundResponse.blob();
            console.log('📦 Sound blob size for PHP:', soundBlob.size, 'bytes');
            const soundBuffer = await soundBlob.arrayBuffer();
            console.log('🔄 Converting to ArrayBuffer for PHP, size:', soundBuffer.byteLength, 'bytes');
            
            // Add only OGG format
            assetsFolder.file('chat-open.ogg', soundBuffer);
            
            console.log('✅ Chat open sound added to PHP export as OGG format');
            console.log(`📊 Final sound file size for PHP: ${soundBuffer.byteLength} bytes`);
            console.log('📁 File added to PHP assets/: chat-open.ogg');
          } else {
            console.warn('⚠️ Could not load chat sound file for PHP from any path');
            console.warn('📝 Tried paths for PHP:', possiblePaths);
            console.warn('🔧 Creating instruction file for PHP instead');
            
            // Sound file not found for PHP - logged to console
          }
        } catch (error) {
          console.error('❌ Error processing chat sound for PHP:', error);
          // Add manual instruction file with error details
          // Sound processing error for PHP - logged to console
        }
      }

      const phpContent = generatePHP(siteData);
      zip.file('index.php', phpContent);

      // Add CSS file
      const cssContent = generateCSS(siteData);
      cssFolder.file('styles.css', cssContent);
      
      // Add JS file
      const jsContent = generateJS();
      jsFolder.file('script.js', jsContent);

      // Add legal documents
      const legalDocs = [
        {
          id: 'privacy-policy',
          type: 'privacyPolicy',
          title: siteData.legalDocuments?.privacyPolicy?.title || '',
          content: siteData.legalDocuments?.privacyPolicy?.content || ''
        },
        {
          id: 'terms-of-service',
          type: 'termsOfService',
          title: siteData.legalDocuments?.termsOfService?.title || '',
          content: siteData.legalDocuments?.termsOfService?.content || ''
        },
        {
          id: 'cookie-policy',
          type: 'cookiePolicy',
          title: siteData.legalDocuments?.cookiePolicy?.title || '',
          content: siteData.legalDocuments?.cookiePolicy?.content || ''
        }
      ];

      legalDocs.forEach(doc => {
        const processedContent = (doc.content || '')
          .replace(/(.{80})/g, '$1<br>')
          .replace(/\n/g, '<br>')
          .replace(/([.!?])\s+/g, '$1<br>')
          .replace(/([^.!?])\s+/g, '$1 ');

        const htmlContent = `
<!DOCTYPE html>
<html lang="${siteData.headerData.language || 'ru'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title}</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.8;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            font-size: 18px;
            color: #333;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            color: #333;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }
        h2 {
            color: #333;
            font-size: 26px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h3 {
            color: #444;
            font-size: 22px;
            font-weight: 500;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .content {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
            text-align: left;
        }
        p {
            margin-bottom: 20px;
            text-align: left;
            font-size: 18px;
            line-height: 1.8;
        }
        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        li {
            margin-bottom: 10px;
            font-size: 18px;
        }
        strong {
            font-weight: 600;
        }
        .date {
            text-align: right;
            margin-top: 30px;
            color: #666;
            font-style: italic;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 40px;
            border-left: 4px solid #4285f4;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px;
                font-size: 16px;
            }
            .content {
                padding: 25px;
            }
            h1 {
                font-size: 28px;
            }
            h2 {
                font-size: 22px;
            }
            h3 {
                font-size: 18px;
            }
            p, li {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="content">
        ${processedContent}
        <div class="date">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
</body>
</html>`;

        zip.file(`${doc.id}.html`, htmlContent);
      });

      // Add robots.txt to the archive (unchanged from root directory)
      try {
        const robotsResponse = await fetch('/robots.txt');
        const robotsContent = await robotsResponse.text();
        zip.file('robots.txt', robotsContent);
        console.log('robots.txt successfully added to PHP zip');
      } catch (error) {
        console.warn('Could not fetch robots.txt for PHP, using default content');
        zip.file('robots.txt', 'User-agent: *\nDisallow:');
      }

      // Add sitemap.xml to the archive (dynamically generated with domain from settings)
      try {
        const sitemapContent = generateSitemapPHP(siteData);
        zip.file('sitemap.xml', sitemapContent);
        console.log('sitemap.xml successfully added to PHP zip with domain:', siteData.headerData.domain);
      } catch (error) {
        console.error('Error generating sitemap.xml for PHP:', error);
      }

      // Add update-sitemap.php to site root
      try {
        const updateSitemapResponse = await fetch('/assets/js/update-sitemap.php');
        const updateSitemapContent = await updateSitemapResponse.text();
        zip.file('update-sitemap.php', updateSitemapContent);
        console.log('update-sitemap.php successfully added to PHP site root');
      } catch (error) {
        console.warn('Could not fetch update-sitemap.php for PHP, using default content');
        // Fallback content if file is not found
        const defaultContent = `<?php
/**
 * Автоматическое обновление домена в sitemap.xml
 * Запустите этот скрипт один раз после размещения сайта на новом домене
 */

// Определяем текущий домен
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$currentDomain = $protocol . $_SERVER['HTTP_HOST'];

// Путь к файлу sitemap.xml
$sitemapFile = 'sitemap.xml';

// Проверяем, существует ли файл
if (!file_exists($sitemapFile)) {
    die("❌ Файл sitemap.xml не найден!");
}

// Читаем содержимое файла
$sitemapContent = file_get_contents($sitemapFile);

if ($sitemapContent === false) {
    die("❌ Не удалось прочитать файл sitemap.xml!");
}

// Заменяем все вхождения example.com на текущий домен
$updatedContent = str_replace('https://example.com', $currentDomain, $sitemapContent);
$updatedContent = str_replace('http://example.com', $currentDomain, $updatedContent);

// Обновляем дату последнего изменения на текущую
$currentDate = date('c');
$updatedContent = preg_replace(
    '/<lastmod>.*?<\\/lastmod>/',
    '<lastmod>' . $currentDate . '</lastmod>',
    $updatedContent
);

// Сохраняем обновленный файл
if (file_put_contents($sitemapFile, $updatedContent) !== false) {
    echo "✅ <strong>Успешно!</strong><br>";
    echo "📍 Домен обновлен на: <strong>" . htmlspecialchars($currentDomain) . "</strong><br>";
    echo "📅 Дата обновления: " . date('d.m.Y H:i:s') . "<br><br>";
    echo "🎯 <strong>Что дальше:</strong><br>";
    echo "1. Удалите этот файл (update-sitemap.php) с сервера<br>";
    echo "2. Загрузите обновленный sitemap.xml в Google Search Console<br>";
    echo "3. Проверьте работоспособность всех страниц<br>";
} else {
    echo "❌ Ошибка при сохранении файла sitemap.xml!";
}
?>`;
        zip.file('update-sitemap.php', defaultContent);
      }

      // Get hero image from cache only if background type is image
      if (heroData.backgroundImage && heroData.backgroundType === 'image') {
        try {
          const imageMetadata = JSON.parse(localStorage.getItem('heroImageMetadata') || '{}');
          if (imageMetadata.filename) {
            const blob = await imageCacheService.getImage(imageMetadata.filename);
            if (blob) {
              imagesFolder.file(imageMetadata.filename, blob);
              console.log('✅ Hero image successfully added to zip from cache');
            } else {
              console.warn('⚠️ Hero image not found in cache');
            }
          }
        } catch (error) {
          console.error('❌ Error getting hero image from cache:', error);
        }
      } else if (heroData.backgroundType === 'video') {
        // Skip hero image export for video
      } else if (heroData.backgroundType === 'gif') {
        // Skip hero image export for GIF
      }

      // Get about image from cache
      try {
        const aboutImageMetadata = JSON.parse(localStorage.getItem('aboutImageMetadata') || '{}');
        // Также проверим наличие метаданных для About.jpg с большой буквы (возможно осталось от предыдущей версии)
        const aboutImageMetadataOld = JSON.parse(localStorage.getItem('AboutImageMetadata') || '{}');
        
        // Пробуем сначала найти изображение с маленькой буквы
        if (aboutImageMetadata.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadata.filename);
          if (blob) {
            // Всегда сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image successfully added to zip from cache');
          } else {
            console.warn('About image (lowercase) not found in cache');
          }
        } 
        // Если не нашли с маленькой буквы, проверяем с большой буквы
        else if (aboutImageMetadataOld.filename) {
          const blob = await imageCacheService.getImage(aboutImageMetadataOld.filename);
          if (blob) {
            // Всё равно сохраняем с именем about.jpg с маленькой буквы
            imagesFolder.file('about.jpg', blob);
            console.log('About image (uppercase) converted to lowercase and added to zip');
          } else {
            console.warn('About image (uppercase) not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting about image from cache:', error);
      }

      // Get section images from cache
      try {
        // Перебираем все пункты меню (секции)
        for (const item of headerData.menuItems) {
          const sectionId = item.id;
          const sectionImageMetadata = JSON.parse(localStorage.getItem(`section_${sectionId}_ImageMetadata`) || '{}');
          
          if (sectionImageMetadata.filename) {
            const blob = await imageCacheService.getImage(sectionImageMetadata.filename);
            if (blob) {
              imagesFolder.file(sectionImageMetadata.filename, blob);
              console.log(`Section ${sectionId} image successfully added to zip from cache`);
            } else {
              console.warn(`Section ${sectionId} image not found in cache`);
            }
          }
        }
      } catch (error) {
        console.error('Error getting section images from cache:', error);
      }

      // Get advantages image from cache
      try {
        const advantagesImageMetadata = JSON.parse(localStorage.getItem('advantagesImageMetadata') || '{}');
        if (advantagesImageMetadata.filename) {
          const blob = await imageCacheService.getImage(advantagesImageMetadata.filename);
          if (blob) {
            imagesFolder.file(advantagesImageMetadata.filename, blob);
            console.log('Advantages image successfully added to zip from cache');
          } else {
            console.warn('Advantages image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting advantages image from cache:', error);
      }

      // Get site background image from cache
      try {
        const siteBackgroundMetadata = JSON.parse(localStorage.getItem('siteBackgroundMetadata') || '{}');
        if (siteBackgroundMetadata.filename) {
          const blob = await imageCacheService.getImage(siteBackgroundMetadata.filename);
          if (blob) {
            imagesFolder.file(siteBackgroundMetadata.filename, blob);
            console.log('Site background image successfully added to zip from cache');
          } else {
            console.warn('Site background image not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting site background image from cache:', error);
      }

      // Add images from sections for PHP version
      for (const section of sectionsArray) {
        // Обработка массива изображений
        if (Array.isArray(section.images) && section.images.length > 0) {
          for (const image of section.images) {
            try {
              let imageFilename = '';
              
              if (typeof image === 'string') {
                imageFilename = image.split('/').pop();
              } else if (image && (image.path || image.url)) {
                imageFilename = (image.path || image.url).split('/').pop();
              }
              
              if (!imageFilename) continue;
              
              // Пропускаем about.jpg и About.jpg, так как оно уже было добавлено ранее из aboutImageMetadata
              if (imageFilename.toLowerCase() === 'about.jpg') {
                console.log(`Skipping ${imageFilename} as it was already added for PHP version`);
                continue;
              }
              
              const blob = await imageCacheService.getImage(imageFilename);
              if (blob) {
                imagesFolder.file(imageFilename, blob);
                console.log(`Section multi-image ${imageFilename} successfully added to zip from cache for PHP version`);
              } else {
                console.warn(`Section multi-image ${imageFilename} not found in cache for PHP version`);
              }
            } catch (error) {
              console.error(`Error getting section multi-image from cache for PHP version:`, error);
            }
          }
        }
        
        // Обработка одиночных изображений
        if (section.backgroundImage || section.imagePath) {
          try {
            const imageFilename = (section.backgroundImage || section.imagePath).split('/').pop();
            // Пропускаем about.jpg и About.jpg, так как оно уже было добавлено ранее из aboutImageMetadata
            if (imageFilename.toLowerCase() === 'about.jpg') {
              console.log(`Skipping ${imageFilename} as it was already added for PHP version`);
              continue;
            }
            const blob = await imageCacheService.getImage(imageFilename);
            if (blob) {
              imagesFolder.file(imageFilename, blob);
              console.log(`Section image ${imageFilename} successfully added to zip from cache for PHP version`);
            } else {
              console.warn(`Section image ${imageFilename} not found in cache for PHP version`);
            }
          } catch (error) {
            console.error(`Error getting section image from cache for PHP version:`, error);
          }
        }
      }

      // Get favicon from cache
      try {
        const faviconMetadata = JSON.parse(localStorage.getItem('faviconMetadata') || '{}');
        if (faviconMetadata.filename) {
          const blob = await imageCacheService.getImage(faviconMetadata.filename);
          if (blob) {
            imagesFolder.file(faviconMetadata.filename, blob);
            console.log('Favicon successfully added to zip from cache');
          } else {
            console.warn('Favicon not found in cache');
          }
        }
      } catch (error) {
        console.error('Error getting favicon from cache:', error);
      }

      // Export hero video from cache for PHP
      try {
        const heroVideoMetadata = JSON.parse(localStorage.getItem('heroVideoMetadata') || '{}');
        if (heroVideoMetadata.filename && siteData.heroData.backgroundType === 'video') {
          try {
            const videoFile = await videoCacheService.getVideo(heroVideoMetadata.filename);
            if (videoFile) {
              videosFolder.file(heroVideoMetadata.filename, videoFile);
              console.log(`✅ PHP Hero video added to zip: ${heroVideoMetadata.filename} (${videoFile.size} bytes)`);
            } else {
              console.warn('⚠️ PHP Hero video not found in cache:', heroVideoMetadata.filename);
            }
          } catch (videoError) {
            console.error('❌ Error getting hero video from cache for PHP:', videoError);
          }
        }
      } catch (error) {
        console.error('❌ Error during video export for PHP:', error);
      }

      // Export hero GIF from cache for PHP
      try {
        const heroGifMetadata = JSON.parse(localStorage.getItem('heroGifMetadata') || '{}');
        if (heroGifMetadata.filename && siteData.heroData.backgroundType === 'gif') {
          try {
            const gifFile = await imageCacheService.getImage(heroGifMetadata.filename);
            if (gifFile) {
              imagesFolder.file(heroGifMetadata.filename, gifFile);
              console.log(`✅ PHP Hero GIF added to zip: ${heroGifMetadata.filename} (${gifFile.size} bytes)`);
            } else {
              console.warn('⚠️ PHP Hero GIF not found in cache:', heroGifMetadata.filename);
            }
          } catch (gifError) {
            console.error('❌ Error getting hero GIF from cache for PHP:', gifError);
          }
        }
      } catch (error) {
        console.error('❌ Error during GIF export for PHP:', error);
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ 
        type: 'blob',
        mimeType: 'application/zip'
      });
      const fileName = generateSafeFileName(siteData);
      saveAs(content, `${fileName}-php.zip`);
    } catch (error) {
      console.error('Error during PHP site download:', error);
      alert('Ошибка при скачивании PHP сайта: ' + error.message);
    }
  };

  const generatePHP = (data) => {
    console.log('Generating PHP site with data:', data);
    
    // Prepare data for HTML generation
    const siteData = {
      headerData: {
        ...data.headerData,
        siteName: data.headerData.siteName || 'My Site',
        title: data.headerData.siteName || 'My Site',
        description: data.headerData.description || 'Our site offers the best solutions',
        menuItems: data.headerData.menuItems || [],
        siteBackgroundImage: data.headerData.siteBackgroundType === 'image' ? 'assets/images/fon.jpg' : '',
        language: data.headerData.language || 'en',
        runningLine: {
          ...data.headerData.runningLine,
          enabled: data.headerData.runningLine?.enabled || false,
          text: data.headerData.runningLine?.text || '',
          speed: data.headerData.runningLine?.speed || 25,
          backgroundColor: data.headerData.runningLine?.backgroundColor || '#1976d2',
          textColor: data.headerData.runningLine?.textColor || '#ffffff',
          fontSize: data.headerData.runningLine?.fontSize || '20px',
          fontWeight: data.headerData.runningLine?.fontWeight || 'bold',
          fontFamily: data.headerData.runningLine?.fontFamily || 'system-ui, -apple-system, sans-serif',
          textStyle: data.headerData.runningLine?.textStyle || 'normal',
          lineHeight: data.headerData.runningLine?.lineHeight || '1.2',
          padding: data.headerData.runningLine?.padding || '4'
        }
      },
      heroData: {
        ...data.heroData,
        backgroundImage: data.heroData.backgroundImage ? 'assets/images/' + data.heroData.backgroundImage.split('/').pop() : '',
        backgroundVideo: data.heroData.backgroundVideo ? 'assets/videos/' + data.heroData.backgroundVideo.split('/').pop() : '',
        backgroundGif: data.heroData.backgroundGif ? 'assets/images/' + data.heroData.backgroundGif.split('/').pop() : ''
      },
      sectionsData: data.sectionsData,
      contactData: data.contactData,
      footerData: data.footerData,
      legalDocuments: {
        privacyPolicy: data.legalDocuments?.privacyPolicy || '',
        termsOfService: data.legalDocuments?.termsOfService || '',
        cookiePolicy: data.legalDocuments?.cookiePolicy || ''
      }
    };

    console.log('Prepared data for generation:', siteData);

    // Создаем экземпляр JSZip
    const zip = new JSZip();

    // Генерируем HTML документы
    const legalDocs = [
      {
        id: 'privacy-policy',
        type: 'privacyPolicy',
        title: ''
      },
      {
        id: 'terms-of-service',
        type: 'termsOfService',
        title: ''
      },
      {
        id: 'cookie-policy',
        type: 'cookiePolicy',
        title: ''
      }
    ];

    // Генерируем HTML файлы для документов
    legalDocs.forEach(doc => {
      const htmlContent = generateLegalDocument(data, doc.type);
      zip.file(`${doc.id}.html`, htmlContent);
    });

    // Генерируем основной HTML с данными документов
    const fullHtml = generateHTML(data);
    // Извлекаем только содержимое body без тегов
    const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let mainHtml = bodyMatch ? bodyMatch[1] : fullHtml;
    
    // Удаляем live chat из body content чтобы избежать дублирования
    if (data.liveChatData?.enabled) {
      // Удаляем live chat HTML
      mainHtml = mainHtml.replace(/<!-- Live Chat Widget -->[\s\S]*?<\/div>\s*(?=<script|$)/g, '');
      // Удаляем live chat JavaScript
      mainHtml = mainHtml.replace(/<script[^>]*>[\s\S]*?console\.log\('🚀 Live Chat JS loaded.*?<\/script>/g, '');
    }
    
    return `<?php
require_once DIR. '/../vendor/autoload.php';
$dotenv = Dotenv\\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$returnPage = !empty($_ENV['WHITE_FORM_RETURN_PAGE']) ? $_ENV['WHITE_FORM_RETURN_PAGE'] : 'merci.html';

if (!str_ends_with($returnPage, '.html')) {
    $returnPage = $returnPage . '.html';
}

if (isset($_GET['email']) || isset($_GET['name'])) {
   echo <<<EOL
   <script>
      setTimeout( () => {
         window.location.href = '/$returnPage';
      }, 500)
   </script>
EOL;
   exit();
}
?>
<!DOCTYPE html>
<html lang="${data.headerData.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.headerData.title || data.headerData.siteName}</title>
  <link rel="icon" type="image/png" href="assets/images/Favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="assets/css/styles.css">
  <meta name="description" content="${data.headerData.description || 'Our site offers the best solutions'}">
  <style>
    /* Live Chat Styles */
    ${data.liveChatData?.enabled ? generateLiveChatCSS() : ''}
  </style>
</head>
<body>
${mainHtml}

${data.liveChatData?.enabled ? generateLiveChatHTML(data.headerData.siteName || 'Наш сайт', data.headerData.language || 'ru', data.liveChatData) : ''}

<!-- Cookie consent notification -->
<div id="cookieConsent" style="
  position: fixed;
  left: 20px;
  bottom: 20px;
  background: rgba(30, 30, 30, 0.97);
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  padding: 1.2rem 1.5rem;
  z-index: 9999;
  display: none;
  min-width: 280px;
  max-width: 350px;
  font-size: 1rem;
  animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) both;
">
  <div style="display: flex; align-items: flex-start; gap: 1rem;">
    <div style="flex:1;">
      <strong>We use cookies</strong><br>
      This website uses cookies to ensure you get the best experience on our website. <a href="cookie-policy.html" style="color:#90caf9;text-decoration:underline;">Learn more</a>.
    </div>
    <button id="cookieAcceptBtn" style="margin-left: 8px; background: #1976d2; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.1rem; font-weight: 500; cursor: pointer; transition: background 0.2s;">Accept</button>
  </div>
</div>
<style>
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  #cookieConsent a:hover { color: #fff; text-decoration: underline; }
  #cookieAcceptBtn:hover { background: #1565c0; }
</style>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    var consent = localStorage.getItem('cookieConsent');
    var consentBox = document.getElementById('cookieConsent');
    var acceptBtn = document.getElementById('cookieAcceptBtn');
    if (!consent && consentBox) {
      consentBox.style.display = 'block';
    }
    if (acceptBtn) {
      acceptBtn.onclick = function() {
        localStorage.setItem('cookieConsent', 'accepted');
        if (consentBox) consentBox.style.display = 'none';
      };
    }
  });

  // Live Chat JavaScript
  ${data.liveChatData?.enabled ? generateLiveChatJS(data.headerData.siteName || 'Наш сайт', data.headerData.language || 'ru', data.liveChatData) : ''}
</script>
</body>
</html>`;
  };

  const generateLegalDocument = (siteData, type) => {
    const titles = {
      privacyPolicy: '',
      termsOfService: '',
      cookiePolicy: ''
    };
    
    const content = siteData.legalDocuments?.[type]?.content || '';
    const title = siteData.legalDocuments?.[type]?.title || titles[type];
    
    // Обработка контента: первая строка будет отцентрирована и выделена
    const contentLines = content.split('\n');
    const firstLine = contentLines[0] ? `<h1>${contentLines[0]}</h1>` : '';
    const remainingContent = contentLines.slice(1).join('\n');
    
    // Улучшенная обработка текста для выделения заголовков разделов и форматирования
    let processedContent = firstLine;
    
    // Шаблоны для определения заголовков разделов
    const sectionHeaderPattern = /^\d+\.\s+(.+)/;  // Для формата: "1. Раздел"
    const sectionHeaderPattern2 = /^([IVX]+)\.\s+(.+)/; // Для римских цифр: "I. Раздел"
    const sectionHeaderPattern3 = /^([А-ЯA-Z][\wа-яА-Я\s]{2,}):$/; // Для ЗАГОЛОВКОВ ПРОПИСНЫМИ
    
    // Разбиваем текст на абзацы
    const paragraphs = remainingContent.split('\n');
    
    // Обрабатываем каждый абзац
    paragraphs.forEach(paragraph => {
      paragraph = paragraph.trim();
      
      if (!paragraph) {
        // Пустые строки превращаем в разделители
        processedContent += '<br>';
      return;
    }

      // Проверяем, является ли строка заголовком раздела
      const match1 = paragraph.match(sectionHeaderPattern);
      const match2 = paragraph.match(sectionHeaderPattern2);
      const match3 = paragraph.match(sectionHeaderPattern3);
      
      if (match1) {
        // Формат "1. Заголовок"
        processedContent += `<h2>${paragraph}</h2>`;
      } else if (match2) {
        // Формат "I. Заголовок"
        processedContent += `<h2>${paragraph}</h2>`;
      } else if (match3) {
        // Формат "ЗАГОЛОВОК:"
        processedContent += `<h2>${paragraph}</h2>`;
      } else if (/^\d+\.\d+\./.test(paragraph)) {
        // Подразделы вида "1.1. Подраздел"
        processedContent += `<h3>${paragraph}</h3>`;
      } else if (paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
        // Маркированные списки
        if (!processedContent.endsWith('</ul>') && !processedContent.endsWith('<ul>')) {
          processedContent += '<ul>';
        }
        processedContent += `<li>${paragraph.substring(1).trim()}</li>`;
        
        // Проверяем, нужно ли закрыть список
        if (paragraphs.indexOf(paragraph) === paragraphs.length - 1 || 
            !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('•') &&
            !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('-') &&
            !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('*')) {
          processedContent += '</ul>';
        }
      } else {
        // Обычные параграфы
        if (paragraph.length > 0) {
          // Выделяем важные термины жирным
          paragraph = paragraph
            .replace(/«([^»]+)»/g, '«<strong>$1</strong>»')
            .replace(/"([^"]+)"/g, '"<strong>$1</strong>"');
            
          processedContent += `<p>${paragraph}</p>`;
        }
      }
    });
    
    // Дополнительная обработка для улучшения читабельности
    processedContent = processedContent
      .replace(/(\d+\.\d+\.\d+\.)/g, '<strong>$1</strong>') // Выделяем номера подразделов
      .replace(/([А-ЯA-Z]{2,})/g, '<strong>$1</strong>') // Выделяем слова ПРОПИСНЫМИ
      .replace(/(ФЗ [№"]\d+[^<]*?[»"])/g, '<strong>$1</strong>') // Выделяем упоминания законов
      .replace(/([0-9]+\s*(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s*[0-9]{4})/gi, '<em>$1</em>'); // Выделяем даты
    
    return `
<!DOCTYPE html>
<html lang="${siteData.headerData.language || 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.8;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            font-size: 18px;
            color: #333;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            color: #333;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }
        h2 {
            color: #333;
            font-size: 26px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        h3 {
            color: #444;
            font-size: 22px;
            font-weight: 500;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .content {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
            text-align: left;
        }
        p {
            margin-bottom: 20px;
            text-align: left;
            font-size: 18px;
            line-height: 1.8;
        }
        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        li {
            margin-bottom: 10px;
            font-size: 18px;
        }
        strong {
            font-weight: 600;
        }
        .date {
            text-align: right;
            margin-top: 30px;
            color: #666;
            font-style: italic;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 40px;
            border-left: 4px solid #4285f4;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px;
                font-size: 16px;
            }
            .content {
                padding: 25px;
            }
            h1 {
                font-size: 28px;
            }
            h2 {
                font-size: 22px;
            }
            h3 {
                font-size: 18px;
            }
            p, li {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="content">
        ${processedContent}
        <div class="date">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
</body>
</html>`;
  };

  const handleExport = async () => {
    try {
      const siteData = {
        headerData: {
          ...headerData,
          siteName: headerData.siteName || 'Мой сайт',
          title: headerData.title || headerData.siteName || 'Мой сайт',
          domain: headerData.domain || '',
          description: headerData.description || 'Наш сайт предлагает лучшие решения',
          menuItems: headerData.menuItems || [],
          siteBackgroundImage: headerData.siteBackgroundType === 'image' ? 'assets/images/hero/fon.jpg' : '',
          language: headerData.language || 'ru',
          runningLine: {
            ...headerData.runningLine,
            enabled: headerData.runningLine?.enabled || false,
            text: headerData.runningLine?.text || '',
            speed: headerData.runningLine?.speed || 25,
            backgroundColor: headerData.runningLine?.backgroundColor || '#1976d2',
            textColor: headerData.runningLine?.textColor || '#ffffff',
            fontSize: headerData.runningLine?.fontSize || '20px',
            fontWeight: headerData.runningLine?.fontWeight || 'bold',
            fontFamily: headerData.runningLine?.fontFamily || 'system-ui, -apple-system, sans-serif',
            textStyle: headerData.runningLine?.textStyle || 'normal',
            lineHeight: headerData.runningLine?.lineHeight || '1.2',
            padding: headerData.runningLine?.padding || '4'
          }
        },
        heroData: {
          ...heroData,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          buttonText: heroData.buttonText || '',
          backgroundImage: heroData.backgroundImage ? 'assets/images/hero/' + heroData.backgroundImage.split('/').pop() : '',
          backgroundVideo: heroData.backgroundVideo ? 'assets/videos/' + heroData.backgroundVideo.split('/').pop() : '',
          // Видео настройки
          videoAutoplay: heroData.videoAutoplay || true,
          videoLoop: heroData.videoLoop || true,
          videoMuted: heroData.videoMuted || true,
          videoControls: heroData.videoControls || false
        },
        sectionsData: sectionsData.map(section => ({
          ...section,
          title: section.title || '',
          description: section.description || '',
          titleColor: section.titleColor || '#000000',
          descriptionColor: section.descriptionColor || '#666666',
          cards: section.cards || []
        })),
        contactData: {
          ...contactData,
          title: contactData.title || 'Контакты',
          description: contactData.description || ''
        },
        footerData: {
          ...footerData,
          title: footerData.title || 'О нас',
          description: footerData.description || '',
          contacts: footerData.contacts || '',
          copyright: footerData.copyright || '© 2024 Все права защищены',
          backgroundColor: footerData.backgroundColor || '#333',
          textColor: footerData.textColor || '#fff'
        },
        legalDocuments: {
          privacyPolicy: {
            title: legalDocuments?.privacyPolicy?.title || '',
            content: legalDocuments?.privacyPolicy?.content || ''
          },
          termsOfService: {
            title: legalDocuments?.termsOfService?.title || '',
            content: legalDocuments?.termsOfService?.content || ''
          },
          cookiePolicy: {
            title: legalDocuments?.cookiePolicy?.title || '',
            content: legalDocuments?.cookiePolicy?.content || ''
          }
        },
        liveChatData: {
          ...liveChatData,
          enabled: liveChatData.enabled || false,
          apiKey: liveChatData.apiKey || '',
          selectedResponses: liveChatData.selectedResponses || '',
          allTranslations: liveChatData.allTranslations || ''
        }
      };

      // Отладочная информация для видео
      console.log('🔍 DEBUG: siteData.heroData:', {
        backgroundType: siteData.heroData.backgroundType,
        backgroundVideo: siteData.heroData.backgroundVideo,
        originalBackgroundVideo: heroData.backgroundVideo,
        videoAutoplay: siteData.heroData.videoAutoplay,
        videoLoop: siteData.heroData.videoLoop,
        videoMuted: siteData.heroData.videoMuted,
        videoControls: siteData.heroData.videoControls
      });

      await exportSite(siteData);
      } catch (error) {
      console.error('Error exporting site:', error);
      alert('Ошибка при экспорте сайта: ' + error.message);
    }
  };

  const handleAboutImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Проверка формата
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, выберите изображение');
      }

      // Создаем FormData
      const formData = new FormData();
      formData.append('image', file);

      // Отправляем запрос на сервер
      const response = await fetch('/api/upload-about', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения');
      }

      const data = await response.json();
      
      // Сохраняем метаданные изображения в localStorage
      const imageMetadata = {
        filename: 'about.jpg', // Всегда используем about.jpg с маленькой буквы
        originalPath: data.path,
        timestamp: Date.now()
      };
      
      console.log('Метаданные изображения "О нас":', imageMetadata);
      localStorage.setItem('aboutImageMetadata', JSON.stringify(imageMetadata));
      
      // Кешируем изображение
      try {
        // Добавляем временную метку, чтобы избежать кеширования браузером
        const imageUrl = `${data.path}?t=${Date.now()}`;
        const imageBlob = await (await fetch(imageUrl)).blob();
        await imageCacheService.saveImage(imageMetadata.filename, imageBlob);
      } catch (cacheError) {
        console.warn('Ошибка при кешировании изображения "О нас":', cacheError);
        // Продолжаем выполнение, кеширование некритично
      }
      
      // Обновляем путь к изображению в данных секции
      const aboutSection = Object.entries(sectionsData).find(([id, section]) => id === 'about');
      if (aboutSection) {
        const [id, section] = aboutSection;
        onSectionsChange({
          ...sectionsData,
          [id]: {
            ...section,
            imagePath: data.path
          }
        });
      } else {
        console.warn('Секция "О нас" не найдена');
      }
      
      // Отправляем сообщение в превью для обновления изображения
      try {
        // Находим iframe с превью
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          // Отправляем сообщение с информацией об обновлении изображения
          previewIframe.contentWindow.postMessage({
            type: 'UPDATE_SECTION_IMAGE',
            sectionId: 'about',
            imagePath: data.path
          }, '*');
          console.log(`Отправлено сообщение для обновления изображения секции "О нас"`);
        } else {
          console.warn('Iframe превью не найден');
        }
      } catch (messageError) {
        console.error('Ошибка при отправке сообщения в превью:', messageError);
        // Не критичная ошибка, продолжаем выполнение
      }
      
      alert('Изображение успешно загружено');
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      alert(error.message || 'Произошла ошибка при загрузке изображения');
    }
  };

  // Функция для удаления изображения секции
  const handleDeleteSectionImage = async (sectionId, imageIndex) => {
    try {
      if (!sectionId) {
        throw new Error('ID секции не указан');
      }

      const section = sectionsData[sectionId];
      if (!section?.images?.[imageIndex]) {
        throw new Error('Изображение не найдено');
      }

      const imageToDelete = section.images[imageIndex];
      console.log('[EditorPanel] Deleting image:', imageToDelete, 'at index:', imageIndex, 'from section:', sectionId);

      // Удаляем изображение из кеша
      await imageCacheService.deleteImage(imageToDelete.filename);

      // Создаем новый массив изображений без удаленного
      const updatedImages = section.images.filter((_, idx) => idx !== imageIndex);
      
      // Обновляем данные секции
      const updatedSectionsData = {
        ...sectionsData,
        [sectionId]: {
          ...sectionsData[sectionId],
          images: updatedImages
        }
      };
      
      onSectionsChange(updatedSectionsData);

      // Отправляем сообщение в превью
      try {
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          console.log('[EditorPanel] Sending DELETE message to preview for section:', sectionId, 'index:', imageIndex);
          previewIframe.contentWindow.postMessage({
            type: 'REMOVE_SECTION_IMAGE',
            sectionId: sectionId,
            imageIndex: imageIndex
          }, '*');
        }
      } catch (messageError) {
        console.error('Ошибка при отправке сообщения в превью:', messageError);
      }

      alert('Изображение успешно удалено');
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      alert(error.message || 'Произошла ошибка при удалении изображения');
    }
  };

  // Также добавим функцию для удаления изображения "О нас"
  const handleDeleteAboutImage = async () => {
    try {
      // Ищем секцию about
      const aboutSection = Object.entries(sectionsData).find(([id, section]) => id === 'about');
      if (aboutSection) {
        const [id, section] = aboutSection;
        onSectionsChange({
          ...sectionsData,
          [id]: {
            ...section,
            imagePath: null
          }
        });
      }
      
      // Удаляем метаданные изображения из localStorage
      localStorage.removeItem('aboutImageMetadata');
      localStorage.removeItem('AboutImageMetadata'); // На всякий случай удаляем и старый ключ
      
      // Отправляем сообщение в превью для обновления отображения
      try {
        const previewIframe = document.querySelector('iframe.preview-iframe');
        if (previewIframe && previewIframe.contentWindow) {
          previewIframe.contentWindow.postMessage({
            type: 'REMOVE_SECTION_IMAGE',
            sectionId: 'about'
          }, '*');
          console.log('Отправлено сообщение для удаления изображения секции "О нас"');
        } else {
          console.warn('Iframe превью не найден');
        }
      } catch (messageError) {
        console.error('Ошибка при отправке сообщения в превью:', messageError);
      }
      
      alert('Изображение "О нас" успешно удалено');
    } catch (error) {
      console.error('Ошибка при удалении изображения "О нас":', error);
      alert(error.message || 'Произошла ошибка при удалении изображения "О нас"');
    }
  };

  // Создаем блоки для разных частей редактора
  const headerEditorBlock = (
        <HeaderEditor 
          headerData={headerData} 
          onHeaderChange={onHeaderChange}
          heroData={heroData}
          contactData={contactData}
          expanded={expandedSections.header}
          onToggle={() => toggleSection('header')}
          id="header"
        />
  );

  const heroEditorBlock = (
        <HeroEditor 
          heroData={heroData}
          onHeroChange={onHeroChange}
          expanded={expandedSections.hero}
          onToggle={() => toggleSection('hero')}
          id="hero"
        />
  );

  // Обертка для логирования изменений contactData
  const handleContactChangeWithLogging = (newContactData) => {
    console.log('📡 EDITOR PANEL: Contact data change received');
    console.log('📊 Previous contactData:', contactData);
    console.log('✨ New contactData:', newContactData);
    
    // Сравнение фоновых настроек
    const backgroundFields = ['showBackground', 'backgroundType', 'backgroundColor', 'gradientColor1', 'gradientColor2', 'gradientDirection'];
    const backgroundChanges = {};
    
    backgroundFields.forEach(field => {
      if (contactData[field] !== newContactData[field]) {
        backgroundChanges[field] = {
          from: contactData[field],
          to: newContactData[field]
        };
      }
    });
    
    if (Object.keys(backgroundChanges).length > 0) {
      console.log('🎨 BACKGROUND CHANGES DETECTED:', backgroundChanges);
    }
    
    onContactChange(newContactData);
  };

  // Добавляем блок с AI парсером
  const aiParserBlock = (
    <Box sx={{ mb: 4 }}>
      <AiParser 
        sectionsData={sectionsData} 
        onSectionsChange={onSectionsChange}
        headerData={headerData}
        onHeaderChange={onHeaderChange}
        contactData={contactData}
        onContactChange={handleContactChangeWithLogging}
        legalDocuments={legalDocuments}
        onLegalDocumentsChange={onLegalDocumentsChange}
        heroData={heroData}
        onHeroChange={onHeroChange}
        aboutData={sectionsData.about}
        onAboutChange={(aboutData) => {
          console.log('onAboutChange called with:', aboutData);
          onSectionsChange({
            ...sectionsData,
            about: aboutData
          });
        }}
        servicesData={sectionsData.services}
        onServicesChange={(servicesData) => {
          console.log('onServicesChange called with:', servicesData);
          onSectionsChange({
            ...sectionsData,
            services: servicesData
          });
        }}
        featuresData={sectionsData.features}
        onFeaturesChange={(featuresData) => {
          console.log('onFeaturesChange called with:', featuresData);
          onSectionsChange({
            ...sectionsData,
            features: featuresData
          });
        }}
        testimonialsData={sectionsData.testimonials}
        onTestimonialsChange={(testimonialsData) => {
          console.log('onTestimonialsChange called with:', testimonialsData);
          onSectionsChange({
            ...sectionsData,
            testimonials: testimonialsData
          });
        }}
        faqData={sectionsData.faq}
        onFaqChange={(faqData) => {
          console.log('onFaqChange called with:', faqData);
          onSectionsChange({
            ...sectionsData,
            faq: faqData
          });
        }}
        newsData={sectionsData.news}
        onNewsChange={(newsData) => {
          console.log('onNewsChange called with:', newsData);
          onSectionsChange({
            ...sectionsData,
            news: newsData
          });
        }}
        merciData={sectionsData.merci}
        onMerciChange={(merciData) => {
          console.log('onMerciChange called with:', merciData);
          onSectionsChange({
            ...sectionsData,
            merci: merciData
          });
        }}
      />
    </Box>
  );

  const contactEditorBlock = (
    <ContactEditor 
      contactData={contactData} 
      onContactChange={handleContactChangeWithLogging}
      expanded={expandedSections.contact}
      onToggle={() => toggleSection('contact')}
      id="contact"
      headerData={headerData}
    />
  );

  const footerEditorBlock = (
    <FooterEditor 
      footerData={footerData} 
      onFooterChange={onFooterChange}
      expanded={expandedSections.footer}
      onToggle={() => toggleSection('footer')}
      id="footer"
    />
  );

  const legalDocumentsEditorBlock = (
    <LegalDocumentsEditor
      documents={legalDocuments}
      onSave={handleLegalDocumentsSave}
      expanded={expandedSections.legal}
      onToggle={() => toggleSection('legal')}
      id="legal"
    />
  );

  const liveChatEditorBlock = (
    <LiveChatEditor
      liveChatData={liveChatData}
      onLiveChatChange={onLiveChatChange}
      expanded={expandedSections.liveChat}
      onToggle={() => toggleSection('liveChat')}
      headerData={headerData}
      id="liveChat"
    />
  );

  const sectionsEditor = (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 2,
            backgroundColor: '#f0fff0'
          }}
          id="menu"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ cursor: 'pointer', flexGrow: 1 }}
              onClick={() => toggleSection('menu')}
            >
              Пункты меню
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleAddMenuItem('menu')}
                sx={{ 
                  minWidth: 'auto',
                  px: 2,
                  mr: 1
                }}
              >
                Добавить
              </Button>
              <IconButton
                onClick={() => toggleSection('menu')}
                aria-expanded={expandedSections.menu}
                aria-label="show more"
                sx={{ cursor: 'pointer' }}
              >
                {expandedSections.menu ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={expandedSections.menu} timeout="auto" unmountOnExit>
            <Stack spacing={1} sx={{ mt: 2 }}>
              {headerData.menuItems.map((item) => {
                const section = sectionsData[item.id] || {
                  id: item.id,
                  title: '',
                  description: '',
                  cardType: CARD_TYPES.NONE,
                  cards: []
                };
                
                return (
                  <Paper
                    key={item.id}
                    elevation={2}
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 2,
                      backgroundColor: '#bdc5da',
                      borderRadius: 2,
                      border: '1px solid #c5cae9',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleSection(`menuItem_${item.id}`)}
                    >
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {item.text}
                      </Typography>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(`menuItem_${item.id}`);
                        }}
                        aria-expanded={expandedSections.menuItems[item.id]}
                        aria-label="show more"
                        sx={{ cursor: 'pointer' }}
                      >
                        {expandedSections.menuItems[item.id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>

                    <Collapse in={expandedSections.menuItems[item.id]} timeout="auto" unmountOnExit>
                      <Stack spacing={1} sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Название пункта меню"
                          value={item.text}
                          onChange={(e) => handleMenuItemChange(item.id, 'text', e.target.value)}
                          margin="dense"
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Заголовок секции"
                          value={section.title || ''}
                          onChange={(e) => handleSectionChange(item.id, 'title', e.target.value)}
                          margin="dense"
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Описание секции"
                          value={section.description || ''}
                          onChange={(e) => handleSectionChange(item.id, 'description', e.target.value)}
                          margin="dense"
                          multiline
                          rows={2}
                        />
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 1 }}>
                          {/* Удаляем первую кнопку и оставляем только вторую */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                            <Button
                              variant="contained"
                              startIcon={<ImageIcon />}
                              onClick={() => document.getElementById(`section-image-upload-${item.id}`).click()}
                              sx={{ minWidth: '200px' }}
                            >
                              {section.images && section.images.length > 0 ? 'Добавить еще изображения' : 'Добавить изображения'}
                            </Button>
                            
                            <input
                              type="file"
                              id={`section-image-upload-${item.id}`}
                              accept="image/*"
                              multiple
                              style={{ display: 'none' }}
                              onChange={(e) => handleSectionImageUpload(item.id, e)}
                            />
                            
                            {section.images && section.images.length > 0 && (
                              <Box sx={{ mt: 2, width: '100%' }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  Загруженные изображения (перетащите для изменения порядка)
                                </Typography>
                                <SectionImageGallery
                                  sectionId={item.id}
                                  images={section.images}
                                  onReorder={(startIndex, endIndex) => handleReorderImagesInSection(item.id, startIndex, endIndex)}
                                  onDelete={(index) => handleDeleteSectionImage(item.id, index)}
                                />
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Цвет заголовка секции"
                            type="color"
                            value={section.titleColor || '#000000'}
                            onChange={(e) => handleSectionChange(item.id, 'titleColor', e.target.value)}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Цвет описания секции"
                            type="color"
                            value={section.descriptionColor || '#666666'}
                            onChange={(e) => handleSectionChange(item.id, 'descriptionColor', e.target.value)}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={section.showBackground ?? true}
                                onChange={(e) => handleSectionChange(item.id, 'showBackground', e.target.checked)}
                                color="primary"
                              />
                            }
                            label="Показывать фон секции"
                          />
                        </Box>

                        <Box sx={{ mb: 2, mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>Быстрые стили</Typography>
                          <FormControl fullWidth size="small">
                            <InputLabel>Выберите стиль</InputLabel>
                            <Select
                              label="Выберите стиль"
                              onChange={(e) => applyPreset(e.target.value, item.id)}
                              defaultValue=""
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 400,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              sx={{
                                '& .MuiSelect-select': {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }
                              }}
                            >
                              {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
                                <MenuItem 
                                  key={key} 
                                  value={key}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    minHeight: '48px',
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: 1,
                                      background: preset.cardBackgroundType === 'gradient'
                                        ? `linear-gradient(${preset.cardGradientDirection}, ${preset.cardGradientColor1}, ${preset.cardGradientColor2})`
                                        : preset.cardBackgroundColor,
                                      border: `1px solid ${preset.borderColor}`,
                                      boxShadow: preset.style.shadow
                                    }}
                                  />
                                  <Typography>
                                    {key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                                  </Typography>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                    
                        <FormControl fullWidth size="small">
                          <InputLabel>Тип карточки</InputLabel>
                          <Select
                            value={section.cardType || CARD_TYPES.NONE}
                            label="Тип карточки"
                            onChange={(e) => handleSectionChange(item.id, 'cardType', e.target.value)}
                          >
                            <MenuItem value={CARD_TYPES.NONE}>Без карточек</MenuItem>
                            <MenuItem value={CARD_TYPES.SIMPLE}>Простая</MenuItem>
                            <MenuItem value={CARD_TYPES.ACCENT}>Акцентная</MenuItem>
                            <MenuItem value={CARD_TYPES.ELEVATED}>Приподнятая</MenuItem>
                            <MenuItem value={CARD_TYPES.GRADIENT}>Градиентная</MenuItem>
                          </Select>
                        </FormControl>

                        {section.cardType !== CARD_TYPES.NONE && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Карточки секции
                            </Typography>
                            <Stack spacing={2}>
                              {(section.cards || []).length > 0 ? (
                                (section.cards || []).map((card) => (
                                  <Paper key={card.id} sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                      <Typography variant="subtitle2">
                                        Карточка {card.id}
                                      </Typography>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteCard(item.id, card.id)}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                    <Stack spacing={2}>
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Заголовок карточки"
                                        value={card.title || ''}
                                        onChange={(e) => handleCardChange(item.id, card.id, 'title', e.target.value)}
                                      />
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Содержание карточки"
                                        value={card.content || ''}
                                        onChange={(e) => handleCardChange(item.id, card.id, 'content', e.target.value)}
                                        multiline
                                        rows={3}
                                      />
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            checked={card.showTitle !== false}
                                            onChange={(e) => handleCardChange(item.id, card.id, 'showTitle', e.target.checked)}
                                          />
                                        }
                                        label="Показывать заголовок"
                                      />
                                      <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет заголовка"
                                          type="color"
                                          value={card.titleColor || '#1976d2'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'titleColor', e.target.value)}
                                        />
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет текста"
                                          type="color"
                                          value={card.contentColor || '#666666'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'contentColor', e.target.value)}
                                        />
                                      </Box>
                                      <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет обводки"
                                          type="color"
                                          value={card.borderColor || '#e0e0e0'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'borderColor', e.target.value)}
                                        />
                                      </Box>
                                      <FormControl fullWidth size="small">
                                        <InputLabel>Тип фона</InputLabel>
                                        <Select
                                          value={card.backgroundType || 'solid'}
                                          label="Тип фона"
                                          onChange={(e) => handleCardChange(item.id, card.id, 'backgroundType', e.target.value)}
                                        >
                                          <MenuItem value="solid">Сплошной цвет</MenuItem>
                                          <MenuItem value="gradient">Градиент</MenuItem>
                                        </Select>
                                      </FormControl>
                                      {card.backgroundType === 'solid' ? (
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Цвет фона"
                                          type="color"
                                          value={card.backgroundColor || '#ffffff'}
                                          onChange={(e) => handleCardChange(item.id, card.id, 'backgroundColor', e.target.value)}
                                        />
                                      ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                          <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label="Цвет 1"
                                              type="color"
                                              value={card.gradientColor1 || '#ffffff'}
                                              onChange={(e) => handleCardChange(item.id, card.id, 'gradientColor1', e.target.value)}
                                            />
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label="Цвет 2"
                                              type="color"
                                              value={card.gradientColor2 || '#f5f5f5'}
                                              onChange={(e) => handleCardChange(item.id, card.id, 'gradientColor2', e.target.value)}
                                            />
                                          </Box>
                                          <FormControl fullWidth size="small">
                                            <InputLabel>Направление градиента</InputLabel>
                                            <Select
                                              value={card.gradientDirection || 'to right'}
                                              label="Направление градиента"
                                              onChange={(e) => handleCardChange(item.id, card.id, 'gradientDirection', e.target.value)}
                                            >
                                              <MenuItem value="to right">Слева направо</MenuItem>
                                              <MenuItem value="to left">Справа налево</MenuItem>
                                              <MenuItem value="to bottom">Сверху вниз</MenuItem>
                                              <MenuItem value="to top">Снизу вверх</MenuItem>
                                              <MenuItem value="45deg">По диагонали (45°)</MenuItem>
                                              <MenuItem value="135deg">По диагонали (135°)</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Box>
                                      )}
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Цвет текста заголовка"
                                        type="color"
                                        value={card.titleColor || '#000000'}
                                        onChange={(e) => handleCardChange(item.id, card.id, 'titleColor', e.target.value)}
                                      />
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Цвет текста содержимого"
                                        type="color"
                                        value={card.contentColor || '#000000'}
                                        onChange={(e) => handleCardChange(item.id, card.id, 'contentColor', e.target.value)}
                                      />
                                    </Stack>
                                  </Paper>
                                ))
                              ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                  Нет добавленных карточек
                                </Typography>
                              )}
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => handleAddCard(item.id)}
                                sx={{ mt: 1 }}
                              >
                                Добавить карточку
                              </Button>
                            </Stack>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            startIcon={<DeleteIcon fontSize="small" />}
                          >
                            Удалить секцию
                          </Button>
                        </Box>
                      </Stack>
                    </Collapse>
                  </Paper>
                );
              })}
            </Stack>
          </Collapse>
        </Paper>
  );

  // Обработчик сообщений для обновления фона и изображений секций
  function handleMessage(event) {
    if (event.data.type === 'UPDATE_BACKGROUND') {
      const backgroundImage = document.querySelector('.background-image');
      if (backgroundImage) {
        backgroundImage.style.backgroundImage = `url(${event.data.imageUrl})`;
      }
    } else if (event.data.type === 'UPDATE_SECTION_IMAGE') {
      // Обновляем изображение для конкретной секции
      const { sectionId, imagePath } = event.data;
      if (sectionId && imagePath) {
        console.log(`Updating image for section ${sectionId}: ${imagePath}`);
        // Добавляем параметр времени, чтобы избежать кеширования браузером
        const imageUrl = `${imagePath}?t=${Date.now()}`;
        
        // Найти элемент изображения секции
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          const imgElement = sectionElement.querySelector('.section-image img');
          if (imgElement) {
            imgElement.src = imageUrl;
          } else if (sectionId === 'about') {
            // Для секции "О нас" структура может быть другой
            const aboutImgElement = sectionElement.querySelector('.about-image img');
            if (aboutImgElement) {
              aboutImgElement.src = imageUrl;
            }
          }
        }
      }
    } else if (event.data.type === 'REMOVE_SECTION_IMAGE') {
      // Обрабатываем удаление изображения секции
      const { sectionId } = event.data;
      if (sectionId) {
        console.log(`Removing image for section ${sectionId}`);
        
        // Найти элемент изображения секции
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          // В зависимости от структуры секции, ищем разные элементы
          if (sectionId === 'about') {
            // Для секции "О нас"
            const aboutImgElement = sectionElement.querySelector('.about-image img');
            if (aboutImgElement) {
              // Можно скрыть или поставить заглушку
              aboutImgElement.style.display = 'none';
              // Или установить заглушку 
              // aboutImgElement.src = '/placeholder.jpg'; 
            }
          } else {
            // Для обычных секций
            const sectionImageDiv = sectionElement.querySelector('.section-image');
            if (sectionImageDiv) {
              sectionImageDiv.style.display = 'none';
            }
          }
        }
      }
    }
  }

  // Блок для редактирования "О нас"
  const aboutEditorBlock = (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 2,
        backgroundColor: '#f0f9ff'
      }}
      id="about"
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="h6" 
          sx={{ cursor: 'pointer', flexGrow: 1 }}
          onClick={() => toggleSection('about')}
        >
          О нас
        </Typography>
        <IconButton
          onClick={() => toggleSection('about')}
          aria-expanded={expandedSections.about}
          aria-label="show more"
          sx={{ cursor: 'pointer' }}
        >
          {expandedSections.about ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expandedSections.about} timeout="auto" unmountOnExit>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Заголовок секции"
            value={sectionsData.about?.title || ''}
            onChange={(e) => handleSectionChange('about', 'title', e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Описание секции"
            value={sectionsData.about?.description || ''}
            onChange={(e) => handleSectionChange('about', 'description', e.target.value)}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Цвет заголовка"
              type="color"
              value={sectionsData.about?.titleColor || '#000000'}
              onChange={(e) => handleSectionChange('about', 'titleColor', e.target.value)}
            />
            <TextField
              fullWidth
              label="Цвет описания"
              type="color"
              value={sectionsData.about?.descriptionColor || '#666666'}
              onChange={(e) => handleSectionChange('about', 'descriptionColor', e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<ImageIcon />}
                onClick={() => document.getElementById('about-image-upload').click()}
                sx={{ minWidth: '200px' }}
              >
                {sectionsData.about?.imagePath ? 'Изменить изображение' : 'Загрузить изображение'}
              </Button>
              
              {sectionsData.about?.imagePath && (
                <>
                  <IconButton
                    color="error"
                    onClick={handleDeleteAboutImage}
                    aria-label="Удалить изображение"
                  >
                    <DeleteIcon />
                  </IconButton>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                    {sectionsData.about.imagePath.split('/').pop()}
                  </Typography>
                </>
              )}
            </Box>
            
            <input
              type="file"
              id="about-image-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAboutImageUpload}
            />
          </Box>
        </Stack>
      </Collapse>
    </Paper>
  );

  // Компонент для отображения галереи изображений секции
  // SectionImageGallery был перемещен в отдельный файл

  const handleReorderImagesInSection = (sectionId, startIndex, endIndex) => {
  const updatedSectionsData = handleReorderImages(sectionsData, sectionId, startIndex, endIndex);
  
  if (updatedSectionsData === sectionsData) return;

  console.log('[EditorPanel] Reordered images for section:', sectionId, 'Images:', updatedSectionsData[sectionId].images);

  onSectionsChange(updatedSectionsData);

  // Обновляем превью
  try {
    const previewIframe = document.querySelector('iframe.preview-iframe');
    if (previewIframe && previewIframe.contentWindow) {
      previewIframe.contentWindow.postMessage({
        type: 'REORDER_SECTION_IMAGES',
        sectionId: sectionId,
        images: updatedSectionsData[sectionId].images
      }, '*');
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения в превью:', error);
  }
};

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3 }}>
        {aiParserBlock}
        {headerEditorBlock}
        {heroEditorBlock}
        {sectionsEditor}
        {contactEditorBlock}
        {footerEditorBlock}
        {legalDocumentsEditorBlock}
        {liveChatEditorBlock}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<DownloadIcon />}
          onClick={handleDownloadSite}
        >
          Скачать сайт
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPHP}
        >
          Скачать PHP версию
        </Button>
      </Box>
      </Paper>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this section? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditorPanel; 