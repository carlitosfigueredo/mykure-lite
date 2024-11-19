import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import Swal from 'sweetalert2';
import { supabase } from '../supabaseConfig';
import { getAuth } from 'firebase/auth';

function Dashboard() {
  return (
    <h1>hola</h1>
  );
}

export default Dashboard;