import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableCell, Typography, Box } from '@mui/material';
import Swal from 'sweetalert2';
import { supabase } from '../supabaseConfig';

function EventAttendance() {
  const { eventId } = useParams();
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          attendance_person_id (
            person_name,
            person_lastname,
            person_ci
          )
        `)
        .eq('attendance_event_id', eventId);

      if (error) throw error;

      setAttendees(data.map(att => att.attendance_person_id));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar asistentes',
        text: error.message,
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Asistentes del Evento
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: 'primary.main', color: 'white' }}>Nombre</TableCell>
            <TableCell sx={{ backgroundColor: 'primary.main', color: 'white' }}>Apellido</TableCell>
            <TableCell sx={{ backgroundColor: 'primary.main', color: 'white' }}>CI</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendees.map((person, index) => (
            <TableRow key={index}>
              <TableCell>{person.person_name}</TableCell>
              <TableCell>{person.person_lastname}</TableCell>
              <TableCell>{person.person_ci}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default EventAttendance;
