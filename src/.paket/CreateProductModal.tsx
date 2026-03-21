import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
  Fade,
  Grow,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  MdClose,
  MdCloudDownload,
  MdSchool,
  MdPalette,
  MdUpload,
  MdContentCopy,
  MdArrowForward,
  MdRocketLaunch,
  MdAutoAwesome,
  MdStars
} from 'react-icons/md';

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
  onProductCreate?: (productName: string) => void;
}


const CreateProductModal: React.FC<CreateProductModalProps> = ({
  open,
  onClose,
  onSelectType
}) => {
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const productTypes = [
    {
      id: 'digital',
      title: 'Digital Product',
      description: 'E-books, software, digital assets, templates',
      icon: <MdCloudDownload size={36} />,
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      features: ['Instant Delivery', 'No Inventory', 'High Margin'],
      popularity: 'Most Popular'
    },
    {
      id: 'course',
      title: 'Course',
      description: 'Online courses, tutorials, workshops, video content',
      icon: <MdSchool size={36} />,
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
      features: ['Recurring Revenue', 'Community Building', 'High Engagement'],
      popularity: 'Trending'
    },
    {
      id: 'design',
      title: 'Design Assets',
      description: 'UI kits, templates, graphics, illustrations',
      icon: <MdPalette size={36} />,
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      features: ['One-time Purchase', 'Easy to Scale', 'High Demand'],
      popularity: 'Best Seller'
    }
  ];

// Component içinde:

const navigate = useNavigate();

const handleSelectType = (typeId: string) => {
  setActiveCard(typeId);
  setTimeout(() => {
    if (typeId === 'digital') {
      navigate('/products/add/book');  // ✅ React Router ile yönlendir
    } else {
      onSelectType(typeId);
    }
    onClose();
  }, 300);
};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={useMediaQuery(theme.breakpoints.down('md'))} // Mobile'da full screen
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 4, md: 6 }, // Mobile'da köşeleri kaldır
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha('#0F172A', 0.95)} 100%)`
            : `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha('#F8FAFC', 0.98)} 100%)`,
          backdropFilter: 'blur(40px) saturate(180%)',
          border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
          boxShadow: `0 60px 120px -20px ${alpha(theme.palette.common.black, 0.4)}`,
          overflow: 'hidden',
          position: 'relative',
          margin: { xs: 0, sm: 2 },
          maxHeight: { xs: '100vh', sm: '90vh' }, // Mobile'da full height
          width: { xs: '100%', sm: 'auto' },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${alpha('#8B5CF6', 0.5)}, ${alpha('#EC4899', 0.5)}, transparent)`,
            animation: 'shimmer 3s infinite linear',
          }
        }
      }}
    >
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${alpha('#8B5CF6', 0.1)} 0%, transparent 70%)`,
          top: '-300px',
          left: '-300px',
          animation: 'float 20s infinite ease-in-out'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${alpha('#10B981', 0.08)} 0%, transparent 70%)`,
          bottom: '-250px',
          right: '-250px',
          animation: 'float 25s infinite ease-in-out reverse'
        }
      }} />
      {/* Header */}
      <DialogTitle sx={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        pb: 4,
        pt: 5,
        px: 5,
        background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.6)} 0%, transparent 100%)`
      }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Avatar sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              width: 56,
              height: 56,
              borderRadius: 3
            }}>
              <MdRocketLaunch size={28} />
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="900" gutterBottom sx={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #FFF 0%, #A5B4FC 100%)'
                  : 'linear-gradient(135deg, #1F2937 0%, #4F46E5 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.025em'
              }}>
                Launch Your Product
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="500">
                Choose your product type to get started
              </Typography>
            </Box>
          </Stack>
          <Chip
            icon={<MdStars size={16} />}
            label="Recommended for you"
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
              borderRadius: 2,
              px: 1.5,
              '& .MuiChip-icon': {
                color: theme.palette.primary.main
              }
            }}
          />
        </Box>
        <IconButton
          onClick={onClose}
          size="large"
          sx={{
            borderRadius: 3,
            bgcolor: alpha(theme.palette.action.hover, 0.1),
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
              borderColor: alpha(theme.palette.error.main, 0.3),
              transform: 'rotate(180deg) scale(1.1)',
              boxShadow: `0 10px 30px ${alpha(theme.palette.error.main, 0.2)}`
            }
          }}
        >
          <MdClose size={24} />
        </IconButton>
      </DialogTitle>
      {/* Content */}
      <DialogContent sx={{
        position: 'relative',
        zIndex: 1,
        py: 5,
        px: 5
      }}>
        {/* Product Type Cards Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {productTypes.map((type, index) => (
            <Grid item xs={12} md={4} key={type.id}>
              <Grow in={open} timeout={index * 200 + 300}>
                <Card
                  onClick={() => handleSelectType(type.id)}
                  onMouseEnter={() => setHoveredCard(type.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 5,
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(145deg, ${alpha('#1E293B', 0.8)} 0%, ${alpha('#0F172A', 0.9)} 100%)`
                      : `linear-gradient(145deg, ${alpha('#FFF', 0.9)} 0%, ${alpha('#F8FAFC', 0.95)} 100%)`,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    minHeight: 380,
                    transform: activeCard === type.id ? 'scale(0.95)' : 'scale(1)',
                    '&:hover': {
                      transform: 'translateY(-16px)',
                      borderColor: alpha(type.color, 0.4),
                      boxShadow: `
                        0 32px 64px -12px ${alpha(type.color, 0.25)},
                        0 0 0 1px ${alpha(type.color, 0.1)} inset
                      `,
                      '& .card-glow': {
                        opacity: 0.4,
                        transform: 'scale(1.2) rotate(10deg)'
                      },
                      '& .type-icon': {
                        transform: 'scale(1.15)',
                        boxShadow: `0 20px 60px ${alpha(type.color, 0.3)}`
                      }
                    }
                  }}
                >
                  {/* Glow Effect */}
                  <Box
                    className="card-glow"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: type.gradient,
                      opacity: 0,
                      transition: 'all 0.6s ease',
                      filter: 'blur(40px)',
                      zIndex: 0
                    }}
                  />
                  {/* Popularity Badge */}
                  <Chip
                    label={type.popularity}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      zIndex: 2,
                      bgcolor: alpha(type.color, 0.1),
                      color: type.color,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      borderRadius: 3,
                      height: 28,
                      border: `1px solid ${alpha(type.color, 0.2)}`,
                      '& .MuiChip-label': {
                        px: 1.5
                      }
                    }}
                  />

                  <CardContent sx={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 4,
                    gap: 3
                  }}>
                    {/* Animated Icon Container */}
                    <Box
                      className="type-icon"
                      sx={{
                        position: 'relative',
                        width: 120,
                        height: 120,
                        borderRadius: 4,
                        background: theme.palette.mode === 'dark'
                          ? `linear-gradient(145deg, ${alpha(type.color, 0.15)} 0%, ${alpha(type.color, 0.05)} 100%)`
                          : `linear-gradient(145deg, ${alpha(type.color, 0.1)} 0%, ${alpha(type.color, 0.02)} 100%)`,
                        border: `2px solid ${alpha(type.color, 0.2)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        mb: 2,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: -2,
                          borderRadius: 4,
                          padding: '2px',
                          background: type.gradient,
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                          opacity: 0,
                          transition: 'opacity 0.4s ease'
                        },
                        '&:hover::before': {
                          opacity: 1
                        }
                      }}
                    >
                      <Box sx={{
                        color: type.color,
                        transform: hoveredCard === type.id ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.3s ease',
                        filter: hoveredCard === type.id ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' : 'none'
                      }}>
                        {type.icon}
                      </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ width: '100%' }}>
                      <Typography
                        variant="h4"
                        fontWeight="800"
                        gutterBottom
                        sx={{
                          mb: 2,
                          background: theme.palette.mode === 'dark'
                            ? `linear-gradient(135deg, ${type.color} 0%, ${alpha(type.color, 0.8)} 100%)`
                            : type.color,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          letterSpacing: '-0.025em'
                        }}
                      >
                        {type.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          lineHeight: 1.6,
                          fontSize: '0.95rem'
                        }}
                      >
                        {type.description}
                      </Typography>

                      {/* Features */}
                      <Stack spacing={1} alignItems="center" mb={3}>
                        {type.features.map((feature, idx) => (
                          <Chip
                            key={idx}
                            label={feature}
                            size="small"
                            sx={{
                              bgcolor: alpha(type.color, 0.08),
                              color: 'text.primary',
                              fontWeight: 500,
                              borderRadius: 2,
                              px: 2,
                              py: 0.5,
                              fontSize: '0.8rem',
                              border: `1px solid ${alpha(type.color, 0.1)}`
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* CTA Button */}
                    <Button
                      variant="contained"
                      endIcon={<MdArrowForward />}
                      sx={{
                        mt: 'auto',
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        background: type.gradient,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        opacity: hoveredCard === type.id ? 1 : 0.9,
                        transform: hoveredCard === type.id
                          ? 'translateY(0) scale(1.05)'
                          : 'translateY(0)',
                        boxShadow: hoveredCard === type.id
                          ? `0 15px 30px ${alpha(type.color, 0.4)}`
                          : `0 8px 20px ${alpha(type.color, 0.2)}`,
                        '&:hover': {
                          transform: 'translateY(-2px) scale(1.05)',
                          boxShadow: `0 20px 40px ${alpha(type.color, 0.4)}`,
                          background: type.gradient
                        }
                      }}
                    >
                      Select This Type
                    </Button>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Quick Options Section */}
        <Fade in={open} timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: alpha(theme.palette.background.default, 0.5),
              p: 4,
              mb: 4
            }}
          >
            <Typography variant="h6" fontWeight="700" gutterBottom align="center" sx={{ mb: 3 }}>
              Quick Actions
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<MdUpload size={22} />}
                  onClick={() => console.log('Import CSV')}
                  sx={{
                    py: 2.5,
                    borderRadius: 3,
                    border: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
                    color: 'text.primary',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateY(-4px)',
                      boxShadow: `0 15px 40px ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }}
                >
                  Import from CSV
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<MdContentCopy size={22} />}
                  onClick={() => console.log('Duplicate')}
                  sx={{
                    py: 2.5,
                    borderRadius: 3,
                    border: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
                    color: 'text.primary',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.secondary.main,
                      bgcolor: alpha(theme.palette.secondary.main, 0.05),
                      transform: 'translateY(-4px)',
                      boxShadow: `0 15px 40px ${alpha(theme.palette.secondary.main, 0.2)}`
                    }
                  }}
                >
                  Duplicate Existing Product
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{
        position: 'relative',
        zIndex: 1,
        px: 5,
        py: 4,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(to top, ${alpha(theme.palette.background.default, 0.8)} 0%, transparent 100%)`,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={onClose}
          variant="text"
          sx={{
            textTransform: 'none',
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem',
            color: 'text.secondary',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: 'text.primary',
              bgcolor: alpha(theme.palette.action.hover, 0.1),
              transform: 'translateY(-2px)'
            }
          }}
        >
          Cancel
        </Button>

        <Stack direction="row" spacing={2} alignItems="center">
          <MdAutoAwesome size={20} color={theme.palette.warning.main} />
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            <strong>Pro tip:</strong> You can change product type anytime
          </Typography>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProductModal;