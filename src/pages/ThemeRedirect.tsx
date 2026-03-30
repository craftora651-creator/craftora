
import { useSearchParams } from 'react-router-dom';
import EnterpriseTheme from '../themes/EnterpriseTheme';

const ThemeRedirect = () => {
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme');

  // Tema seçimine göre ilgili temayı göster
  switch(theme) {
    case 'enterprise':
      return <EnterpriseTheme />;
    default:
      return <EnterpriseTheme />;
  }
};

export default ThemeRedirect;