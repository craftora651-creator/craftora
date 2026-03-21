// paket/createModal.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { 
  FiX, 
  FiTruck, 
  FiCloud 
} from 'react-icons/fi';
import { 
  MdDevices, 
  MdInventory 
} from 'react-icons/md';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  colors?: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

const CreateModal: React.FC<CreateModalProps> = ({ open, onClose, colors }) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm')); // 600px altı
  const isTablet = useMediaQuery(muiTheme.breakpoints.between('sm', 'md')); // 600-900px arası

  // colors prop'u gelmezse varsayılan renkler kullan
  const theme = colors || {
    bg: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#475569'
  };

  const isDarkMode = theme.bg === '#0f172a'; // Admin panel dark mode kontrolü

  // Responsive modal stilleri
  const getModalWidth = () => {
    if (isMobile) return '95%';
    if (isTablet) return '80%';
    return 1000;
  };

  const getModalPadding = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: getModalWidth(),
    maxWidth: '1000px',
    maxHeight: isMobile ? '90vh' : 'auto',
    overflow: 'auto',
    bgcolor: theme.surface,
    borderRadius: isMobile ? 2 : 4,
    boxShadow: isDarkMode 
      ? '0 25px 50px -12px rgba(0,0,0,0.5)' 
      : '0 25px 50px -12px rgba(0,0,0,0.25)',
    p: getModalPadding(),
    outline: 'none',
    border: isDarkMode ? `1px solid ${theme.border}` : 'none'
  };

  // Styled kart - temaya göre
  const ProductOptionCard = styled(Card)(({ theme: muiTheme }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '2px solid transparent',
    borderRadius: isMobile ? '12px' : '16px',
    overflow: 'hidden',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    '&:hover': {
      transform: !isMobile ? 'translateY(-8px)' : 'none',
      boxShadow: isDarkMode 
        ? '0 20px 40px rgba(0,0,0,0.3)' 
        : '0 20px 40px rgba(14,165,233,0.15)',
      borderColor: !isMobile ? '#0ea5e9' : 'transparent',
    },
  }));

  const handleDigitalClick = () => {
    window.location.href = '/products/add';
    onClose();
  };

  const handlePhysicalClick = () => {
    window.location.href = '/physical-products/add';
    onClose();
  };

  return (
    <Modal
      aria-labelledby="create-product-modal-title"
      aria-describedby="create-product-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: isDarkMode 
              ? 'rgba(0,0,0,0.8)' 
              : 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)'
          }
        },
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          {/* Kapatma Butonu */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: isMobile ? 1 : 2 }}>
            <Button
              onClick={onClose}
              sx={{
                minWidth: 'auto',
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                borderRadius: '50%',
                color: theme.textSecondary,
                '&:hover': {
                  backgroundColor: isDarkMode ? '#334155' : '#f1f5f9'
                }
              }}
            >
              <FiX size={isMobile ? 16 : 20} />
            </Button>
          </Box>

          {/* Başlık */}
          <Box sx={{ textAlign: 'center', mb: isMobile ? 3 : 6 }}>
            <Typography 
              id="create-product-modal-title" 
              variant={isMobile ? "h4" : "h3"} 
              component="h2" 
              sx={{ 
                fontWeight: 800, 
                mb: isMobile ? 1 : 2,
                fontSize: { xs: '24px', sm: '28px', md: '36px' },
                background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                px: isMobile ? 1 : 0
              }}
            >
              Ne satmak istiyorsun?
            </Typography>
            <Typography 
              id="create-product-modal-description" 
              variant="body1" 
              sx={{ 
                color: theme.textSecondary, 
                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                maxWidth: 500,
                mx: 'auto',
                px: isMobile ? 2 : 0
              }}
            >
              Ürün tipini seç, hemen satışa başla. Her iki ürün tipi için de özel araçlar sunuyoruz.
            </Typography>
          </Box>

          {/* Ürün Kartları */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: '1fr 1fr' 
            }, 
            gap: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 2, sm: 3, md: 4 }
          }}>
            {/* Dijital Ürün Kartı */}
            <ProductOptionCard onClick={handleDigitalClick}>
              <Box sx={{ 
                height: { xs: 120, sm: 140, md: 160 }, 
                background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: { xs: 80, sm: 100, md: 120 },
                  height: { xs: 80, sm: 100, md: 120 },
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }} />
                <Box sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: { xs: 100, sm: 120, md: 150 },
                  height: { xs: 100, sm: 120, md: 150 },
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }} />
                <MdDevices size={isMobile ? 60 : 80} color="white" style={{ position: 'relative', zIndex: 2 }} />
              </Box>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography gutterBottom variant="h5" component="h3" sx={{ 
                  fontWeight: 700, 
                  mb: { xs: 1, md: 2 },
                  fontSize: { xs: '18px', sm: '20px', md: '24px' },
                  color: isDarkMode ? '#f1f5f9' : '#0f172a'
                }}>
                  Dijital Ürün
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b', 
                  mb: { xs: 2, md: 3 }, 
                  lineHeight: 1.7,
                  fontSize: { xs: '12px', sm: '13px', md: '14px' }
                }}>
                  E-kitaplar, yazılımlar, online kurslar, grafik tasarımlar, müzikler ve daha fazlası. 
                  Stok derdi yok, anında teslimat.
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: { xs: 2, md: 3 } }}>
                  {['E-kitap', 'Yazılım', 'Online Kurs', 'Grafik', 'Müzik'].map((tag) => (
                    <Box
                      key={tag}
                      sx={{
                        px: { xs: 1, md: 1.5 },
                        py: 0.5,
                        bgcolor: isDarkMode ? '#334155' : '#e2e8f0',
                        borderRadius: 2,
                        fontSize: { xs: '10px', sm: '11px', md: '12px' },
                        color: isDarkMode ? '#cbd5e1' : '#475569',
                        fontWeight: 500
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiCloud size={isMobile ? 16 : 20} color="#0ea5e9" />
                  <Typography variant="body2" sx={{ 
                    color: isDarkMode ? '#cbd5e1' : '#475569', 
                    fontWeight: 500,
                    fontSize: { xs: '11px', sm: '12px', md: '14px' }
                  }}>
                    Anında teslimat, düşük maliyet
                  </Typography>
                </Box>
              </CardContent>
            </ProductOptionCard>

            {/* Fiziksel Ürün Kartı */}
            <ProductOptionCard onClick={handlePhysicalClick}>
              <Box sx={{ 
                height: { xs: 120, sm: 140, md: 160 }, 
                background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: { xs: 80, sm: 100, md: 120 },
                  height: { xs: 80, sm: 100, md: 120 },
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }} />
                <Box sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: { xs: 100, sm: 120, md: 150 },
                  height: { xs: 100, sm: 120, md: 150 },
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }} />
                <MdInventory size={isMobile ? 60 : 80} color="white" style={{ position: 'relative', zIndex: 2 }} />
              </Box>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography gutterBottom variant="h5" component="h3" sx={{ 
                  fontWeight: 700, 
                  mb: { xs: 1, md: 2 },
                  fontSize: { xs: '18px', sm: '20px', md: '24px' },
                  color: isDarkMode ? '#f1f5f9' : '#0f172a'
                }}>
                  Fiziksel Ürün
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b', 
                  mb: { xs: 2, md: 3 }, 
                  lineHeight: 1.7,
                  fontSize: { xs: '12px', sm: '13px', md: '14px' }
                }}>
                  Giyim, aksesuar, ev dekorasyonu, kozmetik, oyuncak ve daha fazlası. 
                  Stok takibi, kargo entegrasyonu ve tedarikçi yönetimi.
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: { xs: 2, md: 3 } }}>
                  {['Giyim', 'Aksesuar', 'Dekorasyon', 'Kozmetik', 'Oyuncak'].map((tag) => (
                    <Box
                      key={tag}
                      sx={{
                        px: { xs: 1, md: 1.5 },
                        py: 0.5,
                        bgcolor: isDarkMode ? '#334155' : '#e2e8f0',
                        borderRadius: 2,
                        fontSize: { xs: '10px', sm: '11px', md: '12px' },
                        color: isDarkMode ? '#cbd5e1' : '#475569',
                        fontWeight: 500
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiTruck size={isMobile ? 16 : 20} color="#8b5cf6" />
                  <Typography variant="body2" sx={{ 
                    color: isDarkMode ? '#cbd5e1' : '#475569', 
                    fontWeight: 500,
                    fontSize: { xs: '11px', sm: '12px', md: '14px' }
                  }}>
                    Kargo takibi, stok yönetimi, tedarikçi entegrasyonu
                  </Typography>
                </Box>
              </CardContent>
            </ProductOptionCard>
          </Box>

          {/* Alt bilgi */}
          <Box sx={{ 
            mt: { xs: 2, sm: 3, md: 4 }, 
            pt: { xs: 2, sm: 2.5, md: 3 }, 
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, sm: 3 }
          }}>
            <Typography variant="caption" sx={{ 
              color: theme.textSecondary, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '10px', sm: '11px', md: '12px' }
            }}>
              <span style={{ fontSize: isMobile ? '16px' : '20px' }}>✨</span> 7/24 destek
            </Typography>
            <Typography variant="caption" sx={{ 
              color: theme.textSecondary, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '10px', sm: '11px', md: '12px' }
            }}>
              <span style={{ fontSize: isMobile ? '16px' : '20px' }}>🛡️</span> Güvenli ödeme
            </Typography>
            <Typography variant="caption" sx={{ 
              color: theme.textSecondary, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '10px', sm: '11px', md: '12px' }
            }}>
              <span style={{ fontSize: isMobile ? '16px' : '20px' }}>⚡</span> Anında kurulum
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateModal;