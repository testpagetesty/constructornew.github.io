import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormControlLabel,
  Switch,
  Slider,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import { headerPresets } from '../../utils/headerPresets';

const defaultMenuItems = [
  { id: 1, title: 'Главная', url: '/' },
  { id: 2, title: 'О нас', url: '/about' },
  { id: 3, title: 'Услуги', url: '/services' },
  { id: 4, title: 'Портфолио', url: '/portfolio' },
  { id: 5, title: 'Блог', url: '/blog' },
  { id: 6, title: 'FAQ', url: '/faq' }
];

const initialHeaderData = {
  siteName: 'Мой сайт',
  titleColor: '#000000',
  backgroundColor: '#ffffff',
  linksColor: '#000000',
  menuItems: [
    { id: 1, title: 'Главная' },
    { id: 2, title: 'О нас' },
    { id: 3, title: 'Услуги' }
  ],
  runningLine: {
    enabled: false,
    text: '',
    speed: 35,
    backgroundColor: '#1976d2',
    textColor: '#ffffff',
    fontSize: '14px',
    fontWeight: 'normal'
  }
};

const HeaderEditor = ({ headerData, onHeaderChange, expanded, setExpanded }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!headerData.menuItems || headerData.menuItems.length === 0) {
      onHeaderChange({
        ...headerData,
        menuItems: defaultMenuItems
      });
    }
  }, []);

  const handleAddItem = () => {
    const newId = Math.max(...headerData.menuItems.map(item => item.id), 0) + 1;
    const newItem = {
      id: newId,
      title: `Новый пункт ${newId}`,
      url: `/new-${newId}`
    };
    onHeaderChange({
      ...headerData,
      menuItems: [...headerData.menuItems, newItem]
    });
  };

  const handleDeleteItem = (id) => {
    onHeaderChange({
      ...headerData,
      menuItems: headerData.menuItems.filter(item => item.id !== id)
    });
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleSaveItem = () => {
    onHeaderChange({
      ...headerData,
      menuItems: headerData.menuItems.map(item =>
        item.id === editingItem.id ? editingItem : item
      )
    });
    setEditingItem(null);
  };

  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey);
    const preset = headerPresets[presetKey];
    onHeaderChange({
      ...headerData,
      titleColor: preset.titleColor,
      backgroundColor: preset.backgroundColor,
      linksColor: preset.linksColor,
      siteBackgroundType: preset.siteBackgroundType,
      ...(preset.siteBackgroundType === 'solid' && {
        siteBackgroundColor: preset.siteBackgroundColor
      }),
      ...(preset.siteBackgroundType === 'gradient' && {
        siteGradientColor1: preset.siteGradientColor1,
        siteGradientColor2: preset.siteGradientColor2,
        siteGradientDirection: preset.siteGradientDirection
      })
    });
  };

  const handleFaviconUpload = (e) => {
    // Implementation of handleFaviconUpload
  };

  return (
    <Box>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ minHeight: '48px', '& .MuiAccordionSummary-content': { my: 0 } }}
        >
          <Typography variant="subtitle1">Настройки шапки</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Название сайта"
                value={headerData.title || headerData.siteName}
                onChange={(e) => onHeaderChange({ ...headerData, title: e.target.value })}
              />
            </Grid>

            {/* Настройки бегущей строки */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#1565c0' }}>
                Бегущая строка
              </Typography>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={headerData.runningLine?.enabled || false}
                      onChange={(e) => onHeaderChange({
                        ...headerData,
                        runningLine: {
                          ...headerData.runningLine,
                          enabled: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Включить бегущую строку"
                />
              </Box>
              
              {headerData.runningLine?.enabled && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Текст бегущей строки"
                    value={headerData.runningLine?.text || ''}
                    onChange={(e) => {
                      const newText = e.target.value;
                      onHeaderChange({
                        ...headerData,
                        runningLine: {
                          ...headerData.runningLine,
                          text: newText,
                          enabled: newText.trim() !== '' // Автоматически выключаем если текст пустой
                        }
                      });
                    }}
                    placeholder="Введите текст для бегущей строки"
                  />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Скорость (секунды)
                        </Typography>
                        <Slider
                          value={headerData.runningLine?.speed || 25}
                          onChange={(e, value) => onHeaderChange({
                            ...headerData,
                            runningLine: {
                              ...headerData.runningLine,
                              speed: value
                            }
                          })}
                          min={12}
                          max={100}
                          step={5}
                          marks
                          valueLabelDisplay="auto"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Размер шрифта
                        </Typography>
                        <Select
                          fullWidth
                          size="small"
                          value={headerData.runningLine?.fontSize || '14px'}
                          onChange={(e) => onHeaderChange({
                            ...headerData,
                            runningLine: {
                              ...headerData.runningLine,
                              fontSize: e.target.value
                            }
                          })}
                        >
                          <MenuItem value="12px">12px</MenuItem>
                          <MenuItem value="14px">14px</MenuItem>
                          <MenuItem value="16px">16px</MenuItem>
                          <MenuItem value="18px">18px</MenuItem>
                          <MenuItem value="20px">20px</MenuItem>
                        </Select>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>Цвет фона</Typography>
                        <input
                          type="color"
                          value={headerData.runningLine?.backgroundColor || '#1976d2'}
                          onChange={(e) => onHeaderChange({
                            ...headerData,
                            runningLine: {
                              ...headerData.runningLine,
                              backgroundColor: e.target.value
                            }
                          })}
                          style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>Цвет текста</Typography>
                        <input
                          type="color"
                          value={headerData.runningLine?.textColor || '#ffffff'}
                          onChange={(e) => onHeaderChange({
                            ...headerData,
                            runningLine: {
                              ...headerData.runningLine,
                              textColor: e.target.value
                            }
                          })}
                          style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет заголовка</Typography>
                <input
                  type="color"
                  value={headerData.titleColor}
                  onChange={(e) => onHeaderChange({ ...headerData, titleColor: e.target.value })}
                  style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет фона шапки</Typography>
                <input
                  type="color"
                  value={headerData.backgroundColor}
                  onChange={(e) => onHeaderChange({ ...headerData, backgroundColor: e.target.value })}
                  style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет ссылок</Typography>
                <input
                  type="color"
                  value={headerData.linksColor}
                  onChange={(e) => onHeaderChange({ ...headerData, linksColor: e.target.value })}
                  style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#1565c0' }}>
                Предустановленные стили
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Выберите стиль оформления</InputLabel>
                <Select
                  value={selectedPreset}
                  label="Выберите стиль оформления"
                  onChange={(e) => handlePresetChange(e.target.value)}
                >
                  {Object.entries(headerPresets).map(([key, preset]) => (
                    <MenuItem 
                      key={key} 
                      value={key}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        py: 1
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          background: preset.siteBackgroundType === 'gradient'
                            ? `linear-gradient(${preset.siteGradientDirection || 'to right'}, ${preset.siteGradientColor1}, ${preset.siteGradientColor2})`
                            : preset.backgroundColor,
                          border: `2px solid ${preset.titleColor}`,
                          flexShrink: 0
                        }}
                      />
                      <Typography>{preset.name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                fullWidth
              >
                Загрузить Favicon
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFaviconUpload}
                />
              </Button>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                Рекомендуемый размер: 32x32 пикселей, формат PNG
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет заголовка</Typography>
                <input
                  type="color"
                  value={headerData.titleColor}
                  onChange={(e) => onHeaderChange({ ...headerData, titleColor: e.target.value })}
                  style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет фона шапки</Typography>
                <input
                  type="color"
                  value={headerData.backgroundColor}
                  onChange={(e) => onHeaderChange({ ...headerData, backgroundColor: e.target.value })}
                  style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет ссылок</Typography>
                <input
                  type="color"
                  value={headerData.linksColor}
                  onChange={(e) => onHeaderChange({ ...headerData, linksColor: e.target.value })}
                  style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Accordion 
            expanded={menuExpanded} 
            onChange={() => setMenuExpanded(!menuExpanded)}
            sx={{ 
              boxShadow: 'none',
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
              sx={{ 
                minHeight: '36px', 
                '& .MuiAccordionSummary-content': { my: 0 },
                p: 0
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="subtitle2">Пункты меню</Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon fontSize="small" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddItem();
                  }}
                >
                  Добавить
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {headerData.menuItems.map((item) => (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{ 
                    p: 1, 
                    mb: 1, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  {editingItem?.id === item.id ? (
                    <Box sx={{ flexGrow: 1, mr: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Название"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="URL"
                        value={editingItem.url}
                        onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">{item.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.url}</Typography>
                    </Box>
                  )}
                  <Box>
                    {editingItem?.id === item.id ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleSaveItem}
                        sx={{ mr: 0.5 }}
                      >
                        Сохранить
                      </Button>
                    ) : (
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditItem(item)}
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default HeaderEditor; 