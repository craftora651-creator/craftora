import React from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    HiCheckCircle,
    HiX,
    HiOutlineEye,
    HiOutlinePlus,
    HiExclamationCircle,
} from 'react-icons/hi';

// ===== STYLED COMPONENTS =====
const StyledDialog = styled(Dialog)(({ theme, isError }: { theme?: any; isError?: boolean }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '32px',  // 🔼 Biraz daha yuvarlak
        background: '#ffffff',
        boxShadow: isError
            ? '0 25px 50px rgba(244, 67, 54, 0.2)'
            : '0 25px 50px rgba(76, 175, 80, 0.2)',
        maxWidth: '500px',     // 🔼 400px'den 500px'e çıktı
        width: '100%',
        padding: '8px',
    },
}));

const IconContainer = styled(Box)(({ isError }: { isError?: boolean }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '24px',     // 🔼 16px'den 24px'e
    '& svg': {
        fontSize: '5rem',      // 🔼 4rem'den 5rem'e
        color: isError ? '#f44336' : '#4caf50',
    },
}));

const Title = styled(Typography)(({ isError }: { isError?: boolean }) => ({
    fontSize: '2rem',          // 🔼 1.5rem'den 2rem'e
    fontWeight: 600,
    color: isError ? '#f44336' : '#2e7d32',
    marginBottom: '12px',      // 🔼 8px'den 12px'e
    textAlign: 'center',
}));

const Message = styled(Typography)({
    fontSize: '1.1rem',        // 🔼 1rem'den 1.1rem'e
    color: '#64748b',
    marginBottom: '32px',      // 🔼 24px'den 32px'e
    textAlign: 'center',
    lineHeight: 1.6,
    '& strong': {
        color: '#0f172a',
        fontWeight: 600,
    },
});

const StyledButton = styled(Button)(({ theme, variant, isError }: any) => ({
    borderRadius: '14px',      // 🔼 12px'den 14px'e
    padding: '12px 24px',      // 🔼 10px 20px'den 12px 24px'e
    fontSize: '1rem',          // 🔼 0.9rem'den 1rem'e
    fontWeight: 500,
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '& svg': {
        fontSize: '1.3rem',    // 🔼 1.2rem'den 1.3rem'e
        marginRight: theme.spacing(1),
    },
    ...(variant === 'primary' && {
        background: isError
            ? 'linear-gradient(135deg, #f44336, #ff6b6b)'
            : 'linear-gradient(135deg, #4caf50, #66bb6a)',
        color: 'white',
        boxShadow: 'none',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: isError
                ? '0 15px 25px -10px rgba(244, 67, 54, 0.5)'
                : '0 15px 25px -10px rgba(76, 175, 80, 0.5)',
        },
    }),
    ...(variant === 'secondary' && {
        background: '#f8fafc',
        color: isError ? '#f44336' : '#4caf50',
        border: '1px solid #e2e8f0',
        '&:hover': {
            background: isError ? '#ffebee' : '#f1f8e9',
        },
    }),
}));

const CloseButton = styled(IconButton)({
    position: 'absolute',
    right: 16,                // 🔼 12px'den 16px'e
    top: 16,                  // 🔼 12px'den 16px'e
    color: '#94a3b8',
    '& svg': {
        fontSize: '1.5rem',   // 🔼 İkon boyutu büyüdü
    },
    '&:hover': {
        color: '#ef4444',
        background: '#fee2e2',
    },
});

const ErrorDetails = styled(Box)({
    marginTop: '20px',         // 🔼 16px'den 20px'e
    padding: '16px',           // 🔼 12px'den 16px'e
    backgroundColor: '#fee2e2',
    borderRadius: '12px',      // 🔼 8px'den 12px'e
    border: '1px solid #fecaca',
    marginBottom: '24px',      // 🔼 16px'den 24px'e
    '& p': {
        color: '#b91c1c',
        fontSize: '0.95rem',   // 🔼 0.875rem'den 0.95rem'e
        margin: 0,
    },
});

// ===== PROPS TİPİ =====
interface SuccessModalProps {
    open: boolean;
    onClose: () => void;
    productName: string;
    isError?: boolean;
    errorMessage?: string;
    onViewProducts?: () => void;
    onAddAnother?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    open,
    onClose,
    productName,
    isError = false,
    errorMessage = '',
    onViewProducts,
    onAddAnother,
}) => {
    const handleViewProducts = () => {
        if (onViewProducts) onViewProducts();
        onClose();
    };

    const handleAddAnother = () => {
        if (onAddAnother) onAddAnother();
        onClose();
    };

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            isError={isError}
        >
            <CloseButton onClick={onClose}>
                <HiX />
            </CloseButton>

            <DialogContent sx={{ padding: '40px 32px' }}>  {/* 🔼 32px 24px'den 40px 32px'e */}
                <Box sx={{ textAlign: 'center' }}>
                    {/* İkon */}
                    <IconContainer isError={isError}>
                        {isError ? <HiExclamationCircle /> : <HiCheckCircle />}
                    </IconContainer>

                    {/* Başlık */}
                    <Title variant="h5" isError={isError}>
                        {isError ? 'İşlem Başarısız' : 'Başarılı!'}
                    </Title>

                    {/* Mesaj */}
                    <Message>
                        {isError ? (
                            <>
                                <strong>"{productName}"</strong> eklenirken bir hata oluştu.
                            </>
                        ) : (
                            <>
                                <strong>"{productName}"</strong> başarıyla eklendi.
                            </>
                        )}
                    </Message>

                    {/* Hata detayı */}
                    {isError && errorMessage && (
                        <ErrorDetails>
                            <p>{errorMessage}</p>
                        </ErrorDetails>
                    )}

                    {/* Butonlar */}
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        mt: 3,  // 🔼 2'den 3'e
                    }}>
                        {isError ? (
                            <>
                                <StyledButton
                                    variant="primary"
                                    onClick={handleAddAnother}
                                    startIcon={<HiOutlinePlus />}
                                    isError={isError}
                                >
                                    Tekrar Dene
                                </StyledButton>
                                <StyledButton
                                    variant="secondary"
                                    onClick={onClose}
                                    startIcon={<HiX />}
                                    isError={isError}
                                >
                                    Kapat
                                </StyledButton>
                            </>
                        ) : (
                            <>
                                <StyledButton
                                    variant="primary"
                                    onClick={handleViewProducts}
                                    startIcon={<HiOutlineEye />}
                                >
                                    Ürünleri Görüntüle
                                </StyledButton>
                                <StyledButton
                                    variant="secondary"
                                    onClick={handleAddAnother}
                                    startIcon={<HiOutlinePlus />}
                                >
                                    Yeni Ürün Ekle
                                </StyledButton>
                            </>
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </StyledDialog>
    );
};

export default SuccessModal;