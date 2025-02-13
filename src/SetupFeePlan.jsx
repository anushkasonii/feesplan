import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Stack,
  FormControl,
  Collapse,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import dayjs from 'dayjs';

const SetupFeePlan = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      feeHead: '',
      feeType: 'class-linked',
      amount: '',
      installments: 1,
      dates: [null],
      isEditing: false,
      class: 'LKG',
    },
  ]);
  const [showSavedData, setShowSavedData] = useState(false);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [savedData, setSavedData] = useState([]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        feeHead: '',
        feeType: 'class-linked',
        amount: '',
        installments: 1,
        dates: [null],
        class: 'LKG',
      },
    ]);
  };

  const handleChange = (id, field, value) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          if (field === 'installments') {
            const currentDates = row.dates || [];
            const newDates = Array(value).fill(null);
            currentDates.forEach((date, index) => {
              if (index < value) {
                newDates[index] = date;
              }
            });
            return {
              ...row,
              [field]: value,
              dates: newDates,
            };
          }
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const handleDateChange = (id, dateIndex, date) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          const newDates = [...(row.dates || [])];
          newDates[dateIndex] = date;
          return { ...row, dates: newDates };
        }
        return row;
      })
    );
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleSaveChanges = () => {
    // Group the data by class
    const groupedData = rows.reduce((acc, row) => {
      if (!acc[row.class]) {
        acc[row.class] = [];
      }
      acc[row.class].push({
        ...row,
        totalFees: row.amount,
        feeType: row.feeHead,
        isEditing: false
      });
      return acc;
    }, {});

    // Convert to array format with class as the main grouping
    const formattedData = Object.entries(groupedData).map(([className, fees], index) => ({
      sNo: index + 1,
      class: className,
      fees: fees,
      isExpanded: false
    }));

    setSavedData(formattedData);
    setShowSavedData(true);
  };

  const SavedDataTable = () => {
    const handleEdit = (classIndex, feeIndex) => {
      const newData = [...savedData];
      newData[classIndex].fees[feeIndex].isEditing = !newData[classIndex].fees[feeIndex].isEditing;
      setSavedData(newData);
    };

    const handleDelete = (classIndex, feeIndex) => {
      const newData = [...savedData];
      newData[classIndex].fees.splice(feeIndex, 1);
      if (newData[classIndex].fees.length === 0) {
        newData.splice(classIndex, 1);
      }
      setSavedData(newData);
    };

    const handleDataChange = (classIndex, feeIndex, field, value) => {
      const newData = [...savedData];
      newData[classIndex].fees[feeIndex][field] = value;
      setSavedData(newData);
    };

    const toggleClassExpansion = (classIndex) => {
      setExpandedClasses({
        ...expandedClasses,
        [classIndex]: !expandedClasses[classIndex]
      });
    };

    const toggleRowExpansion = (classIndex, feeIndex) => {
      setExpandedRows((prevExpandedRows) => ({
        ...prevExpandedRows,
        [`${classIndex}-${feeIndex}`]: !prevExpandedRows[`${classIndex}-${feeIndex}`],
      }));
    };

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Fee Structure Overview</Typography>
        <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1FB892", }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '50px' }}></TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold',fontSize:'17px' }}>S No.</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold',fontSize:'17px' }}>Class</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' ,fontSize:'17px'}}>Total Fees</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold',fontSize:'17px' }}>Number of Fee Types</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savedData.map((classData, classIndex) => (
                <React.Fragment key={classIndex}>
                  <TableRow 
                    sx={{ 
                      '& > *': { borderBottom: 'unset' },
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                    onClick={() => toggleClassExpansion(classIndex)}
                  >
                    <TableCell>
                      <IconButton size="small">
                        {expandedClasses[classIndex] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{classData.sNo}</TableCell>
                    <TableCell>{classData.class}</TableCell>
                    <TableCell>
                      ₹{classData.fees.reduce((sum, fee) => sum + Number(fee.totalFees), 0)}
                    </TableCell>
                    <TableCell>{classData.fees.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={expandedClasses[classIndex]} timeout="auto" unmountOnExit>
                        <Box sx={{ 
                          margin: 2, 
                          backgroundColor: 'rgba(31, 184, 146, 0.02)',
                          borderRadius: '8px',
                          border: '1px solid rgba(31, 184, 146, 0.1)',
                          p: 2 
                        }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              mb: 2,
                              color: '#1FB892',
                              fontWeight: 500
                            }}
                          >
                            Fee Types for {classData.class}
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ 
                                '& th': { 
                                  fontWeight: 600,
                                  color: '#53389E'
                                }
                              }}>
                                <TableCell>Fee Type</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Installments</TableCell>
                                <TableCell align="right">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {classData.fees.map((fee, feeIndex) => (
                                <React.Fragment key={feeIndex}>
                                  <TableRow>
                                    <TableCell>
                                      {fee.isEditing ? (
                                        <TextField
                                          value={fee.feeType}
                                          onChange={(e) => handleDataChange(classIndex, feeIndex, 'feeType', e.target.value)}
                                          size="small"
                                          sx={{ minWidth: 150 }}
                                        />
                                      ) : fee.feeType}
                                    </TableCell>
                                    <TableCell>
                                      {fee.isEditing ? (
                                        <TextField
                                          value={fee.totalFees}
                                          onChange={(e) => handleDataChange(classIndex, feeIndex, 'totalFees', e.target.value)}
                                          size="small"
                                          type="number"
                                          sx={{ minWidth: 120 }}
                                        />
                                      ) : `₹${fee.totalFees}`}
                                    </TableCell>
                                    <TableCell>{fee.installments} Installments</TableCell>
                                    <TableCell align="right">
                                      <IconButton 
                                        onClick={() => handleEdit(classIndex, feeIndex)}
                                        size="small"
                                        sx={{ 
                                          color: fee.isEditing ? '#1FB892' : '#53389E',
                                          mr: 1
                                        }}
                                      >
                                        {fee.isEditing ? <SaveIcon /> : <EditIcon />}
                                      </IconButton>
                                      <IconButton 
                                        onClick={() => handleDelete(classIndex, feeIndex)}
                                        size="small"
                                        sx={{ color: 'error.main' }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        onClick={() => toggleRowExpansion(classIndex, feeIndex)}
                                        sx={{ color: '#1FB892', ml: 1 }}
                                      >
                                        {expandedRows[`${classIndex}-${feeIndex}`] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell colSpan={4} sx={{ pb: 3, pt: 0 }}>
                                      <Collapse in={expandedRows[`${classIndex}-${feeIndex}`]} timeout="auto" unmountOnExit>
                                        <Box sx={{ 
                                          pl: 2,
                                          borderLeft: '2px solid rgba(31, 184, 146, 0.2)',
                                          mt: 1
                                        }}>
                                          <Typography 
                                            variant="caption" 
                                            sx={{ 
                                              color: '#666',
                                              display: 'block',
                                              mb: 1
                                            }}
                                          >
                                            Installment Schedule
                                          </Typography>
                                          <Table size="small">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell sx={{ color: '#53389E', fontWeight: 500 }}>Installment</TableCell>
                                                <TableCell sx={{ color: '#53389E', fontWeight: 500 }}>Due Date</TableCell>
                                                <TableCell sx={{ color: '#53389E', fontWeight: 500 }}>Amount</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {fee.dates.map((date, i) => (
                                                <TableRow key={i}>
                                                  <TableCell>Installment {i + 1}</TableCell>
                                                  <TableCell>
                                                    {fee.isEditing ? (
                                                      <DatePicker
                                                        value={dayjs(date)}
                                                        onChange={(newDate) => {
                                                          const newDates = [...fee.dates];
                                                          newDates[i] = newDate;
                                                          handleDataChange(classIndex, feeIndex, 'dates', newDates);
                                                        }}
                                                        slotProps={{ 
                                                          textField: { 
                                                            size: 'small',
                                                            sx: { minWidth: 150 }
                                                          } 
                                                        }}
                                                      />
                                                    ) : (
                                                      date ? dayjs(date).format('DD/MM/YYYY') : '-'
                                                    )}
                                                  </TableCell>
                                                  <TableCell>₹{(fee.totalFees / fee.installments).toFixed(2)}</TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </Box>
                                      </Collapse>
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {!showSavedData ? (
        <>
          <Typography variant="h5" sx={{color: '#53389E', fontWeight: 'bold', mb: 3}}>
            Setup Fee Plan
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#1FB892", justifyContent:'center', fontSize:'17px' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold',fontSize:'17px'  }}>Class</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold',fontSize:'17px'  }}>Fee Heads</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold',fontSize:'17px'  }}>Fee Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold',fontSize:'17px'  }}>Amount</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold',fontSize:'17px'  }}>Installments</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold',fontSize:'17px'  }}>Requested Dates</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold',fontSize:'17px'  }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={row.class}
                          onChange={(e) => handleChange(row.id, 'class', e.target.value)}
                        >
                          <MenuItem value="LKG">LKG</MenuItem>
                          <MenuItem value="UKG">UKG</MenuItem>
                          <MenuItem value="1">Class 1</MenuItem>
                          <MenuItem value="2">Class 2</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        value={row.feeHead}
                        onChange={(e) => handleChange(row.id, 'feeHead', e.target.value)}
                        size="small"
                        placeholder="Enter Fee Head"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={row.feeType}
                          onChange={(e) => handleChange(row.id, 'feeType', e.target.value)}
                        >
                          <MenuItem value="class-linked">Class Linked</MenuItem>
                          <MenuItem value="non-class-linked">Non Class Linked</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        type="number"
                        value={row.amount}
                        onChange={(e) => handleChange(row.id, 'amount', e.target.value)}
                        size="small"
                        placeholder="Enter Amount"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={row.installments}
                          onChange={(e) => handleChange(row.id, 'installments', e.target.value)}
                        >
                          {[...Array(12)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                              {i + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        {[...Array(row.installments)].map((_, index) => (
                          <DatePicker
                            key={index}
                            value={row.dates?.[index] || null}
                            onChange={(date) => handleDateChange(row.id, index, date)}
                            slotProps={{ 
                              textField: { 
                                size: 'small',
                                fullWidth: true
                              } 
                            }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteRow(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 3 }}
          >
            <Button
              variant="outlined"
              onClick={handleAddRow}
              sx={{ 
                color: '#53389E',
                '&:hover': {
                  bgcolor: 'rgba(83, 56, 158, 0.04)',
                }
              }}
            >
              Add New +
            </Button>
            <Button
              variant="outlined"
              onClick={handleSaveChanges}
              sx={{
                borderRadius: "20px",
                marginBottom: "15px",
                marginRight: "20px",
                marginTop: "10px",
                borderColor: "#1FB892",
                color: "#1FB892",
                fontSize: "17px",
                backgroundColor: "white",
                width: '185px',
                alignItems: "center",
                "&:hover": {
                  borderColor: "#1FB892",
                  backgroundColor: "#1FB892",
                  color: "white",
                },
              }}
            >
              Save Template
            </Button>
          </Stack>
        </>
      ) : (
        <SavedDataTable />
      )}
    </Container>
  );
};

export default SetupFeePlan;