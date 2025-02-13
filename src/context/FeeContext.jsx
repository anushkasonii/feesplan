import React, { createContext, useContext, useState } from 'react';
import dayjs from 'dayjs';

const FeeContext = createContext();

export const useFeeContext = () => {
  const context = useContext(FeeContext);
  if (!context) {
    throw new Error('useFeeContext must be used within a FeeProvider');
  }
  return context;
};

export const FeeProvider = ({ children }) => {
  const [feePlans, setFeePlans] = useState([]);
  // Initialize with dummy data
  const [studentFees, setStudentFees] = useState([
    {
      name: 'John Doe',
      class: 'LKG',
      parentName: 'Robert Doe',
      phone: '9876543210',
      fee: '15000',
      status: 'Pending',
      dueDate: dayjs().format('YYYY-MM-DD'),
    },
    {
      name: 'Jane Smith',
      class: 'UKG',
      parentName: 'Michael Smith',
      phone: '9876543211',
      fee: '12000',
      status: 'Received',
      dueDate: dayjs().format('YYYY-MM-DD'),
    },
    {
      name: 'Alice Johnson',
      class: 'First',
      parentName: 'David Johnson',
      phone: '9876543212',
      fee: '18000',
      status: 'Pending',
      dueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    },
    {
      name: 'Bob Wilson',
      class: 'Second',
      parentName: 'James Wilson',
      phone: '9876543213',
      fee: '20000',
      status: 'Received',
      dueDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    },
    {
      name: 'Emma Davis',
      class: 'LKG',
      parentName: 'William Davis',
      phone: '9876543214',
      fee: '15000',
      status: 'Pending',
      dueDate: dayjs().format('YYYY-MM-DD'),
    }
  ]);

  const calculateStats = () => {
    const total = studentFees.reduce((sum, student) => sum + parseFloat(student.fee), 0);
    const received = studentFees
      .filter(student => student.status === 'Received')
      .reduce((sum, student) => sum + parseFloat(student.fee), 0);
    const pending = total - received;

    return {
      totalFee: total.toLocaleString('en-IN'),
      received: received.toLocaleString('en-IN'),
      pending: pending.toLocaleString('en-IN'),
      totalCount: studentFees.length,
      receivedCount: studentFees.filter(student => student.status === 'Received').length,
      pendingCount: studentFees.filter(student => student.status === 'Pending').length,
    };
  };

  const addFeePlan = (plan) => {
    setFeePlans(prevPlans => [...prevPlans, plan]);
  };

  const value = {
    feePlans,
    studentFees,
    addFeePlan,
    calculateStats,
  };

  return <FeeContext.Provider value={value}>{children}</FeeContext.Provider>;
};