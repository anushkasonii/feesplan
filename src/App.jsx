import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ManualFeesSetup from './ManualFeesSetup';
import FeeDetails from './FeeDetails';
import SetupFeePlan from './SetupFeePlan';
import { FeeProvider } from './context/FeeContext';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#53389E',
    },
    secondary: {
      main: '#635881',
    },
    background: {
      default: '#F8F7F9',
    },
  },
});

function App() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <FeeDetails />;
      case 1:
        return <ManualFeesSetup />;
      case 2:
        return <SetupFeePlan />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FeeProvider>
          <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
              <Toolbar>
                <Typography variant="h6" sx={{ color: '#53389E', fontWeight: "bold" }}>
                  KidzShala
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <Tabs value={selectedTab} onChange={handleTabChange} sx={{ ml: 4 }}>
                    <Tab label="Fee Details" />
                    <Tab label="Fee Collection (Manual)" />
                    <Tab label="Setup Fee Plan" />
                  </Tabs>
                </Box>
                <Typography sx={{ color: 'black' }}>
                  XYZ
                </Typography>
                <Typography sx={{ ml: 1, color: 'gray' }}>
                  Finance
                </Typography>
              </Toolbar>
            </AppBar>

            {renderContent()}
          </Box>
        </FeeProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;