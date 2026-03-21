// .paket/ConfirmModal.tsx
import React, { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    Box,
    Typography,
    IconButton,
    Fade,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
    HiX,
    HiTrash,
    HiOutlineBan,
    HiOutlineShieldExclamation,
    HiFire,
} from 'react-icons/hi';
import { GiSkullCrossedBones } from 'react-icons/gi';
import { MdWarning } from 'react-icons/md';  // ✅ Material Design
  // ✅ FontAwesome'dan gelir

// ===== ANİMASYONLAR =====
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-8px); }
  20% { transform: translateX(8px); }
  30% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  50% { transform: translateX(-2px); }
  60% { transform: translateX(2px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const glow = keyframes`
  0% { filter: drop-shadow(0 0 5px #f44336); }
  50% { filter: drop-shadow(0 0 25px #f44336); }
  100% { filter: drop-shadow(0 0 5px #f44336); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const fireAnimation = keyframes`
  0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(5deg); }
  100% { opacity: 0; transform: scale(0.5) rotate(10deg); }
`;

// ===== STYLED COMPONENTS =====
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '32px',
        background: 'linear-gradient(145deg, #1a1a2a 0%, #16213e 100%)',
        boxShadow: '0 30px 60px rgba(244, 67, 54, 0.3), 0 0 0 2px rgba(244, 67, 54, 0.2) inset',
        overflow: 'visible',
        animation: `${float} 0.5s ease-out`,
        maxWidth: '450px',
        width: '100%',
        position: 'relative',
        border: '1px solid rgba(244, 67, 54, 0.3)',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: 'linear-gradient(135deg, #f44336, #ff9800, #ff6b6b, #f44336)',
            backgroundSize: '400% 400%',
            borderRadius: '34px',
            zIndex: -1,
            animation: 'gradientShift 6s ease infinite',
            opacity: 0.5,
        },
    },
}));

const IconContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'relative',
    '& svg': {
        fontSize: '6rem',
        color: '#f44336',
        animation: `${bounce} 2s ease-in-out infinite, ${glow} 2s ease-in-out infinite`,
        filter: 'drop-shadow(0 10px 20px rgba(244, 67, 54, 0.5))',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'scale(1.2) rotate(10deg)',
            color: '#ff6b6b',
        },
    },
});

const FireIcon = styled(HiFire)({
    position: 'absolute',
    fontSize: '1.5rem',
    color: '#ff9800',
    animation: `${fireAnimation} 1.5s ease-in-out infinite`,
    '&:nth-of-type(1)': {
        top: '-10px',
        right: '20px',
        animationDelay: '0s',
    },
    '&:nth-of-type(2)': {
        top: '20px',
        left: '-10px',
        fontSize: '2rem',
        animationDelay: '0.5s',
    },
    '&:nth-of-type(3)': {
        bottom: '-10px',
        right: '30px',
        fontSize: '1.8rem',
        animationDelay: '1s',
    },
});

const Title = styled(Typography)({
    fontSize: '2.2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #f44336, #ff9800)',
    backgroundSize: '200% 200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    animation: `${shake} 0.8s ease-in-out`,
    '& svg': {
        fontSize: '2.2rem',
    },
});

const Message = styled(Typography)({
    fontSize: '1.2rem',
    color: '#b0b0b0',
    marginBottom: '24px',
    textAlign: 'center',
    padding: '0 20px',
    '& strong': {
        fontWeight: 700,
        fontSize: '1.3rem',
        background: 'linear-gradient(135deg, #f44336, #ff9800)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        padding: '0 4px',
    },
});

const WarningBox = styled(Box)({
    background: 'rgba(244, 67, 54, 0.1)',
    border: '1px solid rgba(244, 67, 54, 0.3)',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    animation: `${pulse} 2s ease-in-out infinite`,
    '& svg': {
        fontSize: '1.5rem',
        color: '#ff9800',
        animation: `${spin} 3s linear infinite`,
    },
    '& span': {
        color: '#ff9800',
        fontWeight: 500,
    },
});

const StyledButton = styled(Button)(({ theme, variant }: any) => ({
    borderRadius: '50px',
    padding: '12px 28px',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
    overflow: 'hidden',
    minWidth: '140px',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: 'left 0.5s ease',
    },
    '&:hover': {
        transform: 'translateY(-5px) scale(1.05)',
        '&::before': {
            left: '100%',
        },
    },
    '&:active': {
        transform: 'translateY(0) scale(0.95)',
    },
    '& svg': {
        fontSize: '1.3rem',
        transition: 'all 0.3s ease',
        marginRight: theme.spacing(1),
    },
    ...(variant === 'danger' && {
        background: 'linear-gradient(135deg, #f44336, #d32f2f)',
        color: 'white',
        boxShadow: '0 10px 20px -5px rgba(244, 67, 54, 0.5)',
        '&:hover': {
            background: 'linear-gradient(135deg, #d32f2f, #b71c1c)',
            boxShadow: '0 15px 25px -5px rgba(244, 67, 54, 0.7)',
        },
        '& .rotating': {
            animation: `${spin} 1s linear infinite`,
        },
    }),
    ...(variant === 'secondary' && {
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#b0b0b0',
        border: '1px solid rgba(244, 67, 54, 0.3)',
        backdropFilter: 'blur(10px)',
        '&:hover': {
            background: 'rgba(244, 67, 54, 0.1)',
            color: '#f44336',
            borderColor: '#f44336',
        },
    }),
}));

const CloseButton = styled(IconButton)({
    position: 'absolute',
    right: 16,
    top: 16,
    color: '#b0b0b0',
    transition: 'all 0.3s ease',
    '&:hover': {
        color: '#f44336',
        transform: 'rotate(90deg) scale(1.1)',
        background: 'rgba(244, 67, 54, 0.1)',
    },
});

// ===== PROPS TİPİ =====
interface ConfirmModalProps {
    open: boolean;
    message: string;
    productName: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

// ===== ANA BİLEŞEN =====
const ConfirmModal: React.FC<ConfirmModalProps> = ({
    open,
    message,
    productName,
    onConfirm,
    onCancel,
    confirmText = "Evet, Sil",
    cancelText = "Vazgeç",
    isLoading = false,
}) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open && !isLoading) {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [open, isLoading, onCancel]);

    return (
        <StyledDialog
            open={open}
            onClose={isLoading ? undefined : onCancel}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Fade}
            transitionDuration={500}
            disableEscapeKeyDown={isLoading}
        >
            <CloseButton onClick={onCancel} disabled={isLoading}>
                <HiX />
            </CloseButton>

            <DialogContent sx={{ padding: '32px 24px', overflow: 'visible' }}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                    {/* Ateş efektleri */}
                    <FireIcon as={HiFire} />
                    <FireIcon as={HiFire} />
                    <FireIcon as={HiFire} />

                    {/* Ana ikon */}
                    <IconContainer>
                        <GiSkullCrossedBones />
                    </IconContainer>

                    {/* Başlık */}
                    <Title variant="h3">
                        <MdWarning />
                        DİKKAT!
                        <MdWarning />
                    </Title>

                    {/* Mesaj */}
                    <Message>
                        {message} <strong>"{productName}"</strong>
                    </Message>

                    {/* Uyarı kutusu */}
                    <WarningBox>
                        <HiOutlineShieldExclamation />
                        <span>Bu işlem geri alınamaz!</span>
                        <HiOutlineShieldExclamation />
                    </WarningBox>

                    {/* Aksiyon butonları */}
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}>
                        <StyledButton
                            variant="secondary"
                            onClick={onCancel}
                            disabled={isLoading}
                            startIcon={<HiOutlineBan />}
                        >
                            {cancelText}
                        </StyledButton>

                        <StyledButton
                            variant="danger"
                            onClick={onConfirm}
                            disabled={isLoading}
                            startIcon={isLoading ? <HiTrash className="rotating" /> : <HiTrash />}
                        >
                            {isLoading ? 'Siliniyor...' : confirmText}
                        </StyledButton>
                    </Box>
                </Box>
            </DialogContent>
        </StyledDialog>
    );
};

export default ConfirmModal;