import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Link,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useFeeContext } from './context/FeeContext';
import { jsPDF } from 'jspdf';

const FeeDetails = () => {
  const { studentFees, calculateStats, feePlans } = useFeeContext();
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const stats = calculateStats();

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const generatePDF = (student) => {
    const doc = new jsPDF();
    
    doc.setFillColor(83, 56, 158);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('Receipt', 20, 25);

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('KidzShala', 80, 25);
    
    doc.setFontSize(10);
    doc.text('Near Dona Paula, 3rd main road, 5th Cross', 80, 32);
    doc.text('Gurgaon, 122334 | Phone: 9761118811', 80, 37);
    
    doc.rect(120, 45, 70, 12, 'F');
    doc.setTextColor(83, 56, 158);
    doc.setFontSize(10);
    doc.text(`Receipt #${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, 165, 52);

    doc.setDrawColor(83, 56, 158); 
    doc.setLineWidth(0.5);
    doc.rect(15, 65, 180, 45);

    doc.setFillColor(242, 242, 252); 
    doc.rect(15, 65, 180, 8, 'F');
    doc.setTextColor(83, 56, 158);
    doc.setFontSize(12);
    doc.text('Student Information', 20, 70);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const leftCol = [
      `Student Name     : ${student.name}`,
      `Class           : ${student.class}`,
      `Phone Number    : ${student.phone}`
    ];
    const rightCol = [
      `Parent's Name   : ${student.parentName}`,
      `Payment Date    : ${dayjs().format('MMM D, YYYY')}`,
      `Payment Method  : Cash`
    ];
    
    leftCol.forEach((text, i) => {
      doc.text(text, 20, 80 + (i * 10));
    });
    rightCol.forEach((text, i) => {
      doc.text(text, 110, 80 + (i * 10));
    });

    doc.setFontSize(12);
    doc.setTextColor(83, 56, 158);
    doc.text('Fee Details', 20, 125);

    doc.setFillColor(242, 242, 252);
    doc.rect(15, 130, 180, 10, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);
    doc.line(15, 130, 195, 130); 
    doc.line(15, 140, 195, 140);
    doc.line(15, 130, 15, 140);
    doc.line(195, 130, 195, 140);
    doc.line(140, 130, 140, 140); 

    doc.setTextColor(83, 56, 158);
    doc.setFontSize(10);
    doc.text('Fee Type', 20, 136);
    doc.text('Amount Paid', 145, 136);

    doc.setTextColor(0, 0, 0);
    doc.rect(15, 140, 180, 10);
    doc.text('Tuition Fee', 20, 146);
    doc.text(`₹ ${parseInt(student.fee).toLocaleString('en-IN')}`, 145, 146);

    doc.setFillColor(242, 242, 252);
    doc.rect(15, 150, 180, 10, 'F');
    doc.setTextColor(83, 56, 158);
    doc.setFontSize(11);
    doc.text('Total', 20, 156);
    doc.text(`₹ ${parseInt(student.fee).toLocaleString('en-IN')}`, 145, 156);

    doc.setTextColor(128, 128, 128);
    doc.setFontSize(9);
    doc.text('Powered by KidzShala', 90, 280);

    doc.save(`${student.name}_receipt.pdf`);
  };

  const allFees = [...studentFees, ...feePlans.flatMap(plan => 
    Array(plan.installments).fill().map((_, index) => ({
      name: `Student ${index + 1}`,
      class: plan.class || 'LKG',
      parentName: 'Parent Name',
      phone: '9999999999',
      fee: (parseFloat(plan.amount) / plan.installments).toString(),
      status: 'Pending',
      dueDate: plan.dates[index],
      feeType: plan.feeHead
    }))
  )];

  const filteredData = allFees.filter(student => {
    const matchesStatus = selectedFilter === 'all' || student.status.toLowerCase() === selectedFilter.toLowerCase();
    const matchesClass = selectedClass === 'all' || student.class.toLowerCase() === selectedClass.toLowerCase();
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = dayjs(student.dueDate).isSame(selectedDate, 'day');
    
    return matchesStatus && matchesClass && matchesSearch && matchesDate;
  });


  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card 
            onClick={() => handleFilterClick('all')}
            sx={{
              cursor: 'pointer',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'visible',
              width: '250px',
              bgcolor: selectedFilter === 'all' ? 'rgba(31, 184, 146, 0.1)' : 'white',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                backgroundColor: '#1FB892',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: '#637381', mb: 1 }}>
                Total Students
              </Typography>
              <Typography variant="h4" sx={{ color: '#212B36', fontWeight: 'bold' }}>
                ₹{stats.totalFee}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={10} md={3}>
          <Card 
            onClick={() => handleFilterClick('received')}
            sx={{
              cursor: 'pointer',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'visible',
              width: '250px',
              bgcolor: selectedFilter === 'received' ? 'rgba(31, 184, 146, 0.1)' : 'white',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                backgroundColor: '#1FB892',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
              }
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: '#637381', mb: 1 }}>
                Fees Received
              </Typography>
              <Typography variant="h4" sx={{ color: '#212B36', fontWeight: 'bold' }}>
                ₹{stats.received}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            onClick={() => handleFilterClick('pending')}
            sx={{
              cursor: 'pointer',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'visible',
              width: '250px',
              bgcolor: selectedFilter === 'pending' ? 'rgba(31, 184, 146, 0.1)' : 'white',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                backgroundColor: '#1FB892',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
              }
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: '#637381', mb: 1 }}>
                Pending Fees
              </Typography>
              <Typography variant="h4" sx={{ color: '#212B36', fontWeight: 'bold' }}>
                ₹{stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters and Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                size="small"
                placeholder="Search by Student Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 200 }}
              />
              <FormControl size="small" sx={{ width: 150 }}>
                <InputLabel>Select Class</InputLabel>
                <Select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  label="Select Class"
                >
                  <MenuItem value="all">All Classes</MenuItem>
                  <MenuItem value="lkg">LKG</MenuItem>
                  <MenuItem value="ukg">UKG</MenuItem>
                  <MenuItem value="first">First</MenuItem>
                  <MenuItem value="second">Second</MenuItem>
                </Select>
              </FormControl>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Stack>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#1FB892" }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Parent Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone Number</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fee</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Due Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Receipt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>₹{student.fee}</TableCell>
                      <TableCell>{student.status}</TableCell>
                      <TableCell>{dayjs(student.dueDate).format('DD/MM/YYYY')}</TableCell>
                      <TableCell>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => generatePDF(student)}
                          sx={{ color: '#1FB892', textDecoration: 'none', cursor: 'pointer' }}
                        >
                          PDF
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FeeDetails;