import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputLabel,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const theme = createTheme({
  palette: {
    primary: {
      main: "#53389E",
    },
    secondary: {
      main: "#635881",
    },
    background: {
      default: "#F8F7F9",
    },
  },
});

function ManualFeesSetup({ onBack }) {
  const [manualFees, setManualFees] = useState([
    { id: 1, name: "Tuition fee", amount: null, discount: null },
    { id: 2, name: "Uniform fee", amount: null, discount: null },
    { id: 3, name: "Picnic fee", amount: null, discount: null },
    { id: 4, name: "EDU FEE", amount: null, discount: null },
    { id: 5, name: "Annual", amount: null, discount: null },
    { id: 6, name: "School fees", amount: null, discount: null },
    { id: 7, name: "Transport fees", amount: null, discount: null },
    { id: 8, name: "Student book", amount: null, discount: null },
    { id: 9, name: "SCHOOL BOARD FEES", amount: null, discount: null },
    { id: 10, name: "Tie, dairy, id etc", amount: null, discount: null },
  ]);

  const handleManualFeeChange = (id, field, value) => {
    setManualFees(
      manualFees.map((fee) => {
        if (fee.id === id) {
          return { ...fee, [field]: value === "" ? null : parseFloat(value) };
        }
        return fee;
      })
    );
  };

  const getTotalAmount = () => {
    return manualFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  };

  const getTotalDiscount = () => {
    return manualFees.reduce((sum, fee) => sum + (fee.discount || 0), 0);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              sx={{ mb: 3, color: "#53389E" }}
            >
              Back
            </Button>

            <Paper sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Select Class</InputLabel>
                  <Select label="Select Class">
                    <MenuItem value="">Select Class</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Select Fee Template</InputLabel>
                  <Select label="Select Fee Template">
                    <MenuItem value="">Select Fee Template</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Student Name</InputLabel>
                  <Select label="Student Name">
                    <MenuItem value="">Student Name</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Paper sx={{ mb: 3 }}>
                <Box sx={{ backgroundColor: "#1FB892", color: "white", p: 2,  }}>
                  <Stack direction="row" spacing={3}>
                    <Typography sx={{ flex: 1, fontWeight: 600 , justifyItems:'center'}}>
                      Collection Head
                    </Typography>
                    <Typography sx={{ flex: 1, fontWeight: 600 }}>
                      Amount Paid
                    </Typography>
                    <Typography sx={{ flex: 1, fontWeight: 600 }}>
                      Discount
                    </Typography>
                  </Stack>
                </Box>

                {manualFees.map((fee) => (
                  <Box
                    key={fee.id}
                    sx={{ p: 2, borderBottom: "1px solid #eee" }}
                  >
                    <Stack direction="row" spacing={2}>
                      <Typography sx={{ flex: 1 }}>{fee.name}</Typography>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="₹"
                          value={fee.amount === null ? "" : fee.amount}
                          onChange={(e) =>
                            handleManualFeeChange(
                              fee.id,
                              "amount",
                              e.target.value
                            )
                          }
                          size="small"
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="₹"
                          value={fee.discount === null ? "" : fee.discount}
                          onChange={(e) =>
                            handleManualFeeChange(
                              fee.id,
                              "discount",
                              e.target.value
                            )
                          }
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </Box>
                ))}

                <Box sx={{ p: 2, bgcolor: "#F8F9FA" }}>
                  <Stack direction="row" spacing={2}>
                    <Typography sx={{ flex: 1, fontWeight: 600 }}>
                      Total
                    </Typography>
                    <Typography sx={{ flex: 1, fontWeight: 600 }}>
                      ₹{getTotalAmount()}
                    </Typography>
                    <Typography sx={{ flex: 1, fontWeight: 600 }}>
                      ₹{getTotalDiscount()}
                    </Typography>
                  </Stack>
                </Box>
              </Paper>

              <Box
                sx={{ p: 3, bgcolor: "#F8F9FA", borderTop: "1px solid #ccc" }}
              >
                <Typography
                  sx={{
                    mb: 2,
                    fontSize: "19px",
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                  }}
                >
                  Payment Details
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      Mode of Payment
                    </Typography>
                    <RadioGroup row>
                      <FormControlLabel
                        value="cheque"
                        control={<Radio />}
                        label="Cheque"
                      />
                      <FormControlLabel
                        value="digital"
                        control={<Radio />}
                        label="Digital Payment"
                      />
                      <FormControlLabel
                        value="cash"
                        control={<Radio />}
                        label="Cash"
                      />
                      <FormControlLabel
                        value="challan"
                        control={<Radio />}
                        label="Challan"
                      />
                      <FormControlLabel
                        value="send-reminder"
                        control={<Radio />}
                        label="Send Reminder"
                      />
                    </RadioGroup>
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      Payment Date
                    </Typography>
                    <DatePicker
                      slotProps={{
                        textField: { fullWidth: true, size: "small" },
                      }}
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>Remarks</Typography>
                    <TextField
                      fullWidth
                      placeholder="Type your remarks (if any)"
                      multiline
                      rows={3}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Stack>
              </Box>

              <Stack spacing={3}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: theme.palette.primary.main, fontSize: "16px" }}
                >
                  Generate Receipt
                </Button>
              </Stack>
            </Paper>
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default ManualFeesSetup;